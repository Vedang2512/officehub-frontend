import { useEffect } from "react";

export default function Toast({
    message,
    type = "success",
    onClose
}) {


    useEffect(() => {

        if(!message) {
            return;
        }


        const timer = setTimeout(() => {

            onClose();

        }, 3000);


        return () => clearTimeout(timer);


    }, [message, onClose]);




    if(!message) {
        return null;
    }



    const styles = {

        success:
            "bg-green-600 text-white",

        error:
            "bg-red-600 text-white",

        warning:
            "bg-yellow-500 text-white"

    };




    return (

        <div
            className={`
                fixed
                top-5
                right-5
                px-5
                py-3
                rounded-lg
                shadow-xl
                z-50
                transition-all
                duration-300
                ease-in-out
                ${styles[type]}
            `}
        >


            <div className="flex items-center gap-3">


                <span>

                    {
                        type === "success"
                        ? "✅"
                        : type === "error"
                        ? "❌"
                        : "⚠️"
                    }

                </span>



                <p className="font-medium">
                    {message}
                </p>



                <button
                    onClick={onClose}
                    className="
                        ml-3
                        text-lg
                        font-bold
                    "
                >
                    ×
                </button>


            </div>


        </div>

    );

}