import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import MainLayout from "../../layouts/MainLayout";

import employeeService from "../../services/employeeService";
import chatService from "../../services/chatService";

import ChatSidebar from "../../components/chat/ChatSidebar";
import ChatWindow from "../../components/chat/ChatWindow";
import { useRef } from "react";
import websocketService from "../../services/websocketService";


export default function Chat() {


    const { user } = useSelector(
        (state) => state.auth
    );


    const [employees, setEmployees] = useState([]);

    const [selectedUser, setSelectedUser] = useState(null);

    const [messages, setMessages] = useState([]);

    const [loading, setLoading] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [unreadCounts, setUnreadCounts] = useState({});

    const chatSubscription = useRef(null);
    const presenceSubscription = useRef(null);
    

    // Load employees

    useEffect(() => {

        const loadEmployees = async () => {

            try {

                const data =
                    await employeeService.getEmployees();


                // remove current user from chat list

                const filtered =
                    data.filter(
                        (employee) =>
                            employee.id !== user.id
                    );


                setEmployees(filtered);


            } catch (error) {

                console.error(
                    "Failed loading employees",
                    error
                );

            }

        };


        if (user) {
            loadEmployees();
        }


    }, [user]);



    useEffect(() => {

        const handleProfileImageUpdated = (event) => {

            const updatedUser = event.detail;

            if (!updatedUser?.id) {
                return;
            }

            setEmployees((prev) =>
                prev.map((employee) =>
                    employee.id === updatedUser.id
                        ? {
                            ...employee,
                            profileImage: updatedUser.profileImage
                        }
                        : employee
                )
            );


            setSelectedUser((prev) => {

                if (!prev || prev.id !== updatedUser.id) {
                    return prev;
                }

                return {
                    ...prev,
                    profileImage: updatedUser.profileImage
                };

            });

        };


        window.addEventListener(
            "profile-image-updated",
            handleProfileImageUpdated
        );


        return () => {

            window.removeEventListener(
                "profile-image-updated",
                handleProfileImageUpdated
            );

        };

    }, []);

    useEffect(() => {

        if (!user) {
            return;
        }

        const loadUnreadCounts = async () => {

            try {

                const data =
                    await chatService.getUnreadCounts();

                setUnreadCounts(data);

            } catch (error) {

                console.error(
                    "Failed loading unread message counts",
                    error
                );

            }

        };

        loadUnreadCounts();

    }, [user]);

    useEffect(() => {

        if (!user) {
            return;
        }

        const setupSubscriptions = () => {

            console.log(
                "Chat subscriptions started"
            );

            chatSubscription.current =
                websocketService.subscribe(
                    "/user/queue/messages",

                    (message) => {

                        console.log(
                            "New message:",
                            message
                        );


                        // Check whether this message belongs
                        // to the currently open conversation
                        const isCurrentConversation =
                            selectedUser &&
                            (
                                message.senderId === selectedUser.id ||
                                message.receiverId === selectedUser.id
                            );


                        if (isCurrentConversation) {

                            // Message belongs to the chat currently open
                            setMessages((prev) => [
                                ...prev,
                                message
                            ]);

                            return;

                        }


                        // Message is from another conversation.
                        // Increase unread count for that sender.
                        if (message.senderId) {

                            setUnreadCounts((prev) => ({

                                ...prev,

                                [message.senderId]:
                                    (prev[message.senderId] || 0) + 1

                            }));

                        }

                    }
                );


            presenceSubscription.current =
                websocketService.subscribe(
                    "/topic/presence",

                    (presence) => {

                        const userId = presence.userId;
                        const status = presence.status;

                        setOnlineUsers((prev) => {

                            if (status === "ONLINE") {

                                if (prev.includes(userId)) {
                                    return prev;
                                }

                                return [
                                    ...prev,
                                    userId
                                ];

                            }

                            if (status === "OFFLINE") {

                                return prev.filter(
                                    id => id !== userId
                                );

                            }

                            return prev;

                        });

                    }
                );

        };


        websocketService.onConnected(
            setupSubscriptions
        );


        return () => {

            websocketService.unsubscribe(
                "/user/queue/messages"
            );

            websocketService.unsubscribe(
                "/topic/presence"
            );

            chatSubscription.current = null;
            presenceSubscription.current = null;

        };

    }, [user, selectedUser]);



    // Load conversation

    const handleSelectUser = async (employee) => {


        setSelectedUser(employee);

        setLoading(true);


        try {

            const data =
                await chatService.getConversation(
                    employee.id
                );


            setMessages(data);


            await chatService.markAsRead(
                employee.id
            );

            setUnreadCounts((prev) => {

                const updated = {
                    ...prev
                };

                delete updated[employee.id];

                return updated;

            });


        } catch(error) {

            console.error(
                "Failed loading conversation",
                error
            );

            setMessages([]);

        }
        finally {

            setLoading(false);

        }

    };





    // Send message placeholder
    // WebSocket will be added in Part 2

   
    const handleSendMessage = async (content) => {

        if (!selectedUser) {
            return;
        }

        try {

            const message =
                await chatService.sendMessage(
                    selectedUser.id,
                    content
                );

            setMessages((prev) => {

                const existingIndex =
                    prev.findIndex(
                        (item) => item.id === message.id
                    );

                // Existing message → update it
                if (existingIndex !== -1) {

                    return prev.map((item) =>
                        item.id === message.id
                            ? message
                            : item
                    );

                }

                // New message → add it
                return [
                    ...prev,
                    message
                ];

            });

        } catch (error) {

            console.error(
                "Failed sending message",
                error
            );

        }

    };

    useEffect(() => {

        const handleMessageUpdated = (event) => {

            const updatedMessage = event.detail;

            setMessages((prev) =>
                prev.map((message) =>
                    message.id === updatedMessage.id
                        ? updatedMessage
                        : message
                )
            );

        };


        window.addEventListener(
            "chat-message-updated",
            handleMessageUpdated
        );


        return () => {

            window.removeEventListener(
                "chat-message-updated",
                handleMessageUpdated
            );

        };

    }, []);




    return (

        <MainLayout>


            <div
                className="
                    h-[calc(100vh-120px)]
                    flex
                    rounded-xl
                    overflow-hidden
                    border
                    bg-white
                "
            >


                <ChatSidebar
                    employees={employees}
                    selectedUser={selectedUser}
                    onSelect={handleSelectUser}
                    onlineUsers={onlineUsers}
                    unreadCounts={unreadCounts}
                />



                {
                    loading ? (

                        <div
                            className="
                                flex-1
                                flex
                                items-center
                                justify-center
                            "
                        >

                            Loading conversation...

                        </div>


                    ) : (


                        <ChatWindow

                            selectedUser={selectedUser}

                            messages={messages}

                            currentUserId={user?.id}

                            onSend={handleSendMessage}

                        />


                    )

                }


            </div>


        </MainLayout>

    );

}