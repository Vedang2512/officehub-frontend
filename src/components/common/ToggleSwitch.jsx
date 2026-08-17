export default function ToggleSwitch({
    enabled,
    onChange,
    disabled = false
}) {

    return (

        <button
            type="button"
            onClick={onChange}
            disabled={disabled}
            className={`
                relative w-12 h-6 rounded-full transition-all duration-300
                ${
                    enabled
                    ? "bg-blue-600"
                    : "bg-gray-300"
                }
                ${
                    disabled
                    ? "cursor-not-allowed opacity-60"
                    : "cursor-pointer"
                }
            `}
        >

            <span
                className={`
                    absolute top-1 left-1
                    w-4 h-4 bg-white rounded-full
                    transition-transform duration-300 shadow
                    ${
                        enabled
                        ? "translate-x-6"
                        : "translate-x-0"
                    }
                `}
            />

        </button>

    );
}