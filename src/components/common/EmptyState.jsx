export default function EmptyState({
    icon = "📭",
    title = "Nothing here",
    description = "There is no data available.",
    actionLabel,
    onAction
}) {

    return (

        <div className="
            bg-white
            rounded-2xl
            shadow-sm
            border
            border-gray-100
            p-10
            text-center
            flex
            flex-col
            items-center
        ">


            <div className="
                text-5xl
                mb-5
            ">
                {icon}
            </div>


            <h2 className="
                text-2xl
                font-semibold
                text-gray-700
            ">
                {title}
            </h2>


            <p className="
                mt-3
                text-gray-500
                max-w-md
            ">
                {description}
            </p>


            {
                actionLabel && onAction && (

                    <button
                        onClick={onAction}
                        className="
                            mt-6
                            px-6
                            py-2.5
                            rounded-xl
                            bg-blue-600
                            text-white
                            hover:bg-blue-700
                            transition
                        "
                    >
                        {actionLabel}
                    </button>

                )
            }


        </div>

    );
}