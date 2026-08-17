
export default function DashboardStatCard({
    title,
    value,
    icon,
    accent = "blue"
}) {

    const accentColors = {
        blue: "border-l-blue-500",
        green: "border-l-green-500",
        yellow: "border-l-yellow-500",
        purple: "border-l-purple-500",
        red: "border-l-red-500"
    };

    return (
        <div
            className={`
                bg-white
                rounded-2xl
                border
                border-gray-100
                shadow-sm
                hover:shadow-lg
                transition-all
                duration-300
                border-l-4
                ${accentColors[accent]}
                p-5
                min-h-[125px]
            `}
        >

            <div className="flex justify-between items-start">

                <div className="flex-1">

                    <p className="
                        text-sm
                        text-gray-500
                        h-5
                        flex
                        items-center
                    ">
                        {title}
                    </p>

                    <h2 className="text-3xl font-bold mt-7 text-gray-800">
                        {value}
                    </h2>

                </div>

                <div className="text-3xl shrink-0">
                    {icon}
                </div>

            </div>

        </div>
    );
}

