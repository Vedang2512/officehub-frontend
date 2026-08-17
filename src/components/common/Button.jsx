export default function Button({
    children,
    type = "button",
    onClick,
    disabled = false,
    className = ""
}) {

    return (

        <button

            type={type}

            onClick={onClick}

            disabled={disabled}

            className={`
                bg-blue-600
                text-white
                px-5
                py-2
                rounded
                hover:bg-blue-700
                disabled:opacity-50
                ${className}
            `}

        >

            {children}

        </button>

    );

}