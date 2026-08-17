import { useEffect, useState, useRef } from "react";

import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import User from "lucide-react/dist/esm/icons/user";
import websocketService from "../../services/websocketService";

export default function ChatWindow({

    selectedUser,
    messages,
    currentUserId,
    onSend

}) {

    const [typingUser, setTypingUser] = useState(null);

    const typingSubscription = useRef(null);

    const messagesEndRef = useRef(null);


    // Auto-scroll to the latest message

    useEffect(() => {

        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth"
        });

    }, [messages]);


    useEffect(() => {

        if (!selectedUser) {
            return;
        }


        typingSubscription.current =
            websocketService.subscribe(
                "/user/queue/typing",

                (event) => {

                    if (
                        event.senderId === selectedUser.id
                    ) {

                        if (event.typing) {

                            setTypingUser(
                                selectedUser.fullName
                            );

                        } else {

                            setTypingUser(null);

                        }

                    }

                }
            );


        return () => {

            typingSubscription.current?.unsubscribe();

            typingSubscription.current = null;

            setTypingUser(null);

        };

    }, [selectedUser]);


    const handleMessageUpdated = (updatedMessage) => {

        window.dispatchEvent(
            new CustomEvent(
                "chat-message-updated",
                {
                    detail: updatedMessage
                }
            )
        );

    };


    if (!selectedUser) {

        return (

            <div className="
                flex-1
                flex
                items-center
                justify-center
            ">

                <p className="
                    text-gray-500
                    text-lg
                ">

                    Select an employee to start chatting.

                </p>

            </div>

        );

    }


    return (

        <div className="
            flex
            flex-col
            flex-1
            bg-white
            min-h-0
        ">


            {/* Header */}

            <div className="
                border-b
                p-4
                flex
                items-center
                gap-3
                flex-shrink-0
            ">

                <div
                    className="
                        h-11
                        w-11
                        rounded-full
                        bg-gray-200
                        flex
                        items-center
                        justify-center
                        overflow-hidden
                    "
                >

                    {selectedUser.profileImage ? (
                        <img
                            src={selectedUser.profileImage}
                            alt={selectedUser.fullName}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <User size={20} />
                    )}

                </div>


                <h2 className="
                    font-bold
                    text-lg
                ">

                    {selectedUser.fullName}

                </h2>

            </div>


            {/* Messages */}

            <div className="
                flex-1
                min-h-0
                overflow-y-auto
                p-4
            ">

                {
                    messages.map((message) => (

                        <MessageBubble

                            key={message.id}

                            message={message}

                            currentUserId={currentUserId}

                            onMessageUpdated={
                                handleMessageUpdated
                            }

                        />

                    ))
                }


                {/* Invisible element at bottom */}

                <div ref={messagesEndRef} />

            </div>


            {/* Typing Indicator */}

            {
                typingUser && (

                    <div className="
                        px-4
                        py-2
                        text-sm
                        text-gray-500
                        italic
                        flex-shrink-0
                    ">

                        {typingUser} is typing...

                    </div>

                )
            }


            {/* Input */}

            <ChatInput

                onSend={onSend}

                receiverId={selectedUser.id}

            />

        </div>

    );

}