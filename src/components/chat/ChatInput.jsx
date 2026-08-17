import { useState, useRef } from "react";
import websocketService from "../../services/websocketService";
import { useSelector } from "react-redux";


export default function ChatInput({

    onSend,
    receiverId

}) {


    const [message, setMessage] = useState("");

    const typingTimeout = useRef(null);


    const { user } =
        useSelector(
            (state) => state.auth
        );



    const sendTypingStatus = (typing) => {


        if (!user || !receiverId) {
            return;
        }


        websocketService.send(
            "/app/chat.typing",
            {
                senderId: user.id,
                receiverId: receiverId,
                typing: typing
            }
        );

    };




    const handleChange = (e) => {


        setMessage(
            e.target.value
        );


        sendTypingStatus(true);



        if (typingTimeout.current) {

            clearTimeout(
                typingTimeout.current
            );

        }



        typingTimeout.current =
            setTimeout(() => {


                sendTypingStatus(false);


            }, 2000);

    };





    const handleSend = () => {


        if (!message.trim()) {
            return;
        }


        onSend(message);


        setMessage("");


        sendTypingStatus(false);


    };




    return (

        <div className="
            border-t
            p-4
            flex
            gap-3
        ">


            <input

                value={message}

                onChange={handleChange}

                placeholder="Type a message..."

                className="
                    flex-1
                    border
                    rounded-lg
                    px-4
                    py-2
                "


                onKeyDown={(e) => {


                    if (e.key === "Enter") {

                        handleSend();

                    }


                }}

            />



            <button

                onClick={handleSend}

                className="
                    bg-blue-600
                    text-white
                    px-5
                    rounded-lg
                "

            >

                Send

            </button>


        </div>

    );

}