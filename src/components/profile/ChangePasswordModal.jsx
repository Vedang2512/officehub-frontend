import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Loader2, X } from "lucide-react";
import profileService from "../../services/profileService";
import PasswordField from "./PasswordField";

export default function ChangePasswordModal({
    isOpen,
    onClose
}) {

    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [loading, setLoading] = useState(false);

    useEffect(() => {

        if (!isOpen) return;

        const handleEsc = (e) => {

            if (e.key === "Escape") {
                onClose();
            }

        };

        window.addEventListener("keydown", handleEsc);

        return () => {
            window.removeEventListener("keydown", handleEsc);
        };

    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const closeModal = () => {

        if (loading) return;

        setFormData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
        });

        onClose();

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (formData.newPassword !== formData.confirmPassword) {

            toast.error("Passwords do not match");
            return;

        }

        if (formData.newPassword.length < 6) {

            toast.error("Password must be at least 6 characters");
            return;

        }

        try {

            setLoading(true);

            await profileService.changePassword({
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword
            });

            toast.success("Password updated successfully");

            closeModal();

        } catch (error) {

            toast.error(
                error.response?.data ||
                "Unable to update password."
            );

        } finally {

            setLoading(false);

        }

    };

    

    return (

        <div
            onClick={closeModal}
            className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4"
        >

            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-xl w-full max-w-md"
            >

                <div className="flex justify-between items-center border-b p-5">

                    <h2 className="text-2xl font-bold">
                        Change Password
                    </h2>

                    <button
                        onClick={closeModal}
                        disabled={loading}
                    >
                        <X size={22} />
                    </button>

                </div>

                <form
                    onSubmit={handleSubmit}
                    className="p-6 space-y-5"
                >

                    <PasswordField
                        label="Current Password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        show={showCurrent}
                        toggle={() => setShowCurrent(!showCurrent)}
                        onChange={handleChange}
                    />

                    <PasswordField
                        label="New Password"
                        name="newPassword"
                        value={formData.newPassword}
                        show={showNew}
                        toggle={() => setShowNew(!showNew)}
                        onChange={handleChange}
                    />

                    <PasswordField
                        label="Confirm Password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        show={showConfirm}
                        toggle={() => setShowConfirm(!showConfirm)}
                        onChange={handleChange}
                    />

                    <div className="flex justify-end gap-3 pt-2">

                        <button
                            type="button"
                            onClick={closeModal}
                            disabled={loading}
                            className="border px-5 py-2 rounded-lg"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg flex items-center gap-2 disabled:opacity-70"
                        >
                            {loading && (
                                <Loader2
                                    size={18}
                                    className="animate-spin"
                                />
                            )}

                            {loading
                                ? "Updating..."
                                : "Update Password"}

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}