import Button from "./Button";

export default function ConfirmationModal({
    isOpen,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    onCancel
}) {

    if (!isOpen) {
        return null;
    }

    return (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">

                <h2 className="text-xl font-bold mb-3">
                    {title}
                </h2>

                <p className="text-gray-600 mb-6">
                    {message}
                </p>

                <div className="flex justify-end gap-3">

                    <Button
                        type="button"
                        onClick={onCancel}
                        className="bg-gray-600 hover:bg-gray-700"
                    >
                        {cancelText}
                    </Button>

                    <Button
                        type="button"
                        onClick={onConfirm}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        {confirmText}
                    </Button>

                </div>

            </div>

        </div>

    );

}