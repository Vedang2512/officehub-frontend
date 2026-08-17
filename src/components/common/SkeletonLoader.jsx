export default function SkeletonLoader({
    type = "text"
}) {

    if (type === "card") {

        return (

            <div className="bg-white rounded-xl shadow p-6 animate-pulse">

                <div className="h-5 bg-gray-200 rounded w-1/3 mb-4"></div>

                <div className="h-8 bg-gray-200 rounded w-1/2 mb-3"></div>

                <div className="h-4 bg-gray-200 rounded w-full"></div>

            </div>

        );

    }


    if (type === "profile") {

        return (

            <div className="bg-white rounded-xl shadow p-6 animate-pulse">

                <div className="flex items-center gap-5">

                    <div className="w-24 h-24 bg-gray-200 rounded-full"></div>

                    <div className="space-y-3 flex-1">

                        <div className="h-5 bg-gray-200 rounded w-1/3"></div>

                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>

                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>

                    </div>

                </div>

            </div>

        );

    }


    if (type === "task") {

        return (

            <div className="bg-white rounded-xl shadow p-5 animate-pulse">

                <div className="h-5 bg-gray-200 rounded w-2/3 mb-4"></div>

                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>

                <div className="h-4 bg-gray-200 rounded w-1/2"></div>


                <div className="flex justify-between mt-5">

                    <div className="h-6 bg-gray-200 rounded w-20"></div>

                    <div className="h-6 bg-gray-200 rounded w-20"></div>

                </div>

            </div>

        );

    }


    // Default text loader

    return (

        <div className="animate-pulse space-y-2">

            <div className="h-4 bg-gray-200 rounded w-full"></div>

            <div className="h-4 bg-gray-200 rounded w-3/4"></div>

            <div className="h-4 bg-gray-200 rounded w-1/2"></div>

        </div>

    );

}