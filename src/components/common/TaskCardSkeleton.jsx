export default function TaskCardSkeleton() {

    return (

        <div
            className="
                bg-white
                rounded-xl
                shadow
                p-6
                animate-pulse
                border
                border-gray-100
            "
        >

            <div className="flex justify-between mb-5">

                <div className="h-6 w-48 bg-gray-200 rounded"></div>

                <div className="flex gap-2">

                    <div className="h-6 w-20 bg-gray-200 rounded-full"></div>

                    <div className="h-6 w-20 bg-gray-200 rounded-full"></div>

                </div>

            </div>


            <div className="space-y-2">

                <div className="h-4 bg-gray-200 rounded"></div>

                <div className="h-4 bg-gray-200 rounded w-5/6"></div>

                <div className="h-4 bg-gray-200 rounded w-2/3"></div>

            </div>


            <div className="flex justify-between items-center mt-8">

                <div className="flex items-center gap-3">

                    <div className="w-10 h-10 rounded-full bg-gray-200"></div>

                    <div>

                        <div className="h-3 w-20 bg-gray-200 rounded mb-2"></div>

                        <div className="h-4 w-28 bg-gray-200 rounded"></div>

                    </div>

                </div>

                <div className="h-8 w-28 bg-gray-200 rounded-full"></div>

            </div>

        </div>

    );

}