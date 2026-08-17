import { useNavigate } from "react-router-dom";
import Button from "../common/Button";

export default function TaskCard({
    task,
    user,
    onStatusUpdate
}) {

    const navigate = useNavigate();
    const isAssignedToManager =
    user?.role === "MANAGER" &&
    task?.assignedToUserId === user?.id;

    const isOverdue = (date, status) => {

        if (!date || status === "COMPLETED") {
            return false;
        }

        return new Date(date) < new Date();

    };



    const statusColor = (status) => {

        switch(status) {

            case "TODO":
                return "bg-gray-100 text-gray-700";

            case "IN_PROGRESS":
                return "bg-yellow-100 text-yellow-700";

            case "COMPLETED":
                return "bg-green-100 text-green-700";

            default:
                return "";

        }

    };



    const priorityColor = (priority) => {

        switch(priority) {

            case "HIGH":
                return "bg-red-100 text-red-700";

            case "MEDIUM":
                return "bg-orange-100 text-orange-700";

            case "LOW":
                return "bg-blue-100 text-blue-700";

            default:
                return "";

        }

    };



    const getInitials = (name) => {

        if (!name) {
            return "?";
        }


        return name
            .split(" ")
            .map(word => word[0])
            .join("")
            .substring(0,2)
            .toUpperCase();

    };



    return (

        <div
            onClick={() => navigate(`/tasks/${task.id}`)}
            className={`
                group
                bg-white
                rounded-xl
                shadow
                p-4
                md:p-6
                cursor-pointer
                transition-all
                duration-200
                hover:shadow-xl
                hover:-translate-y-1
                active:scale-[0.98]
                border
                ${
                    isOverdue(task.dueDate, task.status)
                    ? "border-red-400"
                    : "border-gray-100"
                }
            `}
        >


            <div className="
                flex
                flex-col
                md:flex-row
                md:justify-between
                md:items-start
                gap-4
            ">


                <div>
                    <p className="text-xs font-semibold text-gray-400 mb-1">
                        Task #{task.taskNumber}
                    </p>

                    <h2 className="
                        text-lg
                        md:text-xl
                        font-semibold
                        break-words
                        group-hover:text-blue-600
                        transition
                    ">
                        {task.title}
                    </h2>
                </div>



                <div className="
                    flex
                    flex-wrap
                    gap-2
                    md:justify-end
                ">


                    <span
                        className={`
                            px-3
                            py-1
                            rounded-full
                            text-xs
                            font-semibold
                            ${statusColor(task.status)}
                        `}
                    >
                        {task.status}
                    </span>



                    <span
                        className={`
                            px-3
                            py-1
                            rounded-full
                            text-xs
                            font-semibold
                            ${priorityColor(task.priority)}
                        `}
                    >
                        {task.priority}
                    </span>


                </div>


            </div>





            <p
                className="
                    mt-3
                    text-gray-600
                    leading-6
                    min-h-[60px]
                    md:min-h-[72px]
                    line-clamp-3
                "
            >
                {task.description}
            </p>





            <div className="
                mt-5
                flex
                flex-col
                md:flex-row
                md:items-center
                md:justify-between
                gap-4
            ">


                <div className="
                    flex
                    items-center
                    gap-3
                    min-w-0
                ">


                    <div
                        className="
                            w-10
                            h-10
                            rounded-full
                            flex
                            items-center
                            justify-center
                            bg-blue-100
                            text-blue-700
                            font-bold
                        "
                    >
                        {getInitials(task.assignedToName)}
                    </div>



                    <div className="text-sm">

                        <p className="text-gray-500">
                            Assigned To
                        </p>

                        <p className="
                            font-semibold
                            truncate
                            max-w-[180px]
                        ">
                            {
                                task.assignedToName ||
                                "Not Assigned"
                            }
                        </p>

                    </div>


                </div>





                {task.dueDate && (

                    <div
                        className={`
                            w-full
                            md:w-auto
                            text-center
                            px-3
                            py-2
                            rounded-full
                            text-xs
                            md:text-sm
                            font-medium
                            ${
                                isOverdue(
                                    task.dueDate,
                                    task.status
                                )
                                ? "bg-red-100 text-red-700"
                                : "bg-gray-100 text-gray-700"
                            }
                        `}
                    >

                        📅{" "}
                        {
                            new Date(task.dueDate)
                            .toLocaleDateString()
                        }

                        {
                            isOverdue(
                                task.dueDate,
                                task.status
                            ) && (
                                <span className="ml-2">
                                    Overdue
                                </span>
                            )
                        }

                    </div>

                )}


            </div>






            <div className="mt-4 text-sm">

                <p>
                    Created By:
                    <b className="ml-1">
                        {task.assignedByName || "Unknown"}
                    </b>
                </p>

            </div>






            {(user?.role === "EMPLOYEE" || isAssignedToManager) && (

                <div className="
                    mt-5
                    w-full
                ">


                    {task.status === "TODO" && (

                        <Button
                            onClick={(e)=>{

                                e.stopPropagation();

                                onStatusUpdate(
                                    task.id,
                                    "IN_PROGRESS"
                                );

                            }}
                            className="
                                w-full
                                rounded-lg
                                shadow-sm
                                bg-yellow-500
                                hover:bg-yellow-600
                            "
                        >
                            Start Task
                        </Button>

                    )}




                    {task.status === "IN_PROGRESS" && (

                        <Button
                            onClick={(e)=>{

                                e.stopPropagation();

                                onStatusUpdate(
                                    task.id,
                                    "COMPLETED"
                                );

                            }}
                            className="
                                w-full
                                rounded-lg
                                shadow-sm
                                bg-green-600
                                hover:bg-green-700
                            "
                        >
                            Complete Task
                        </Button>

                    )}


                </div>

            )}


        </div>

    );

}