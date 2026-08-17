import { useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";

export default function Forbidden() {

    const navigate = useNavigate();

    return (

        <MainLayout>

            <div className="
                min-h-[70vh]
                flex
                flex-col
                items-center
                justify-center
                text-center
            ">

                <h1 className="
                    text-7xl
                    font-bold
                    text-red-600
                ">
                    403
                </h1>


                <h2 className="
                    text-3xl
                    font-semibold
                    mt-4
                ">
                    Access Forbidden
                </h2>


                <p className="
                    text-gray-500
                    mt-3
                    max-w-md
                ">
                    You don't have permission to access this page.
                </p>


                <button
                    onClick={() => navigate("/dashboard")}
                    className="
                        mt-6
                        px-6
                        py-3
                        rounded-xl
                        bg-blue-600
                        text-white
                        hover:bg-blue-700
                        transition
                    "
                >
                    Back to Dashboard
                </button>


            </div>

        </MainLayout>

    );
}