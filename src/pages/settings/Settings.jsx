import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import MainLayout from "../../layouts/MainLayout";
import ChangePasswordModal from "../../components/profile/ChangePasswordModal";
import profileService from "../../services/profileService";
import ToggleSwitch from "../../components/common/ToggleSwitch";
import SkeletonLoader from "../../components/common/SkeletonLoader";
export default function Settings() {

    const [showPasswordModal, setShowPasswordModal] = useState(false);

    const [notifications, setNotifications] = useState({
        emailNotifications: true,
        taskNotifications: true,
        chatNotifications: true
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {

        const loadNotificationPreferences = async () => {

            try {

                const data =
                    await profileService.getNotificationPreferences();

                setNotifications(data);

            } catch {

                toast.error("Failed to load notification preferences");

            } finally {

                setLoading(false);

            }

        };

        loadNotificationPreferences();

    }, []);

    const handleToggle = async (key) => {

        const updated = {
            ...notifications,
            [key]: !notifications[key]
        };

        setNotifications(updated);

        try {

            setSaving(true);

            const response =
                await profileService.updateNotificationPreferences(updated);

            setNotifications(response);

            toast.success("Preferences updated");

        } catch {

            setNotifications(notifications);

            toast.error("Failed to update preferences");

        } finally {

            setSaving(false);
        }
    };

    return (

        <MainLayout>

            <div className="
                max-w-5xl
                mx-auto
                p-4
                md:p-6
            ">

                <h1 className="
                    text-2xl
                    md:text-3xl
                    font-bold
                    text-gray-800
                    mb-2
                ">
                    Settings
                </h1>

                <p className="
                    text-gray-500
                    mb-8
                ">
                    Manage your account, security and notification preferences.
                </p>

                {/* Account */}

                <div className="bg-white rounded-xl shadow p-6 mb-6">

                    <h2 className="text-xl font-semibold mb-2">
                        Account
                    </h2>

                    <p className="text-gray-500">
                        Manage your account information and preferences.
                    </p>

                </div>

                {/* Security */}

                <div className="bg-white rounded-xl shadow p-6 mb-6">

                    <h2 className="text-xl font-semibold mb-4">
                        Security
                    </h2>

                    <button
                        onClick={() => setShowPasswordModal(true)}
                        className="
                            bg-blue-600
                            hover:bg-blue-700
                            text-white
                            px-5
                            py-2
                            rounded-lg
                            transition
                            shadow-sm
                        "
                    >
                        Change Password
                    </button>

                </div>

                {/* Preferences */}

                <div className="bg-white rounded-xl shadow p-6 mb-6">

                    <h2 className="text-xl font-semibold mb-4">
                        Preferences
                    </h2>

                    <div className="flex justify-between items-center">

                        <span>Dark Mode</span>

                        <ToggleSwitch
                            enabled={false}
                            disabled={true}
                        />

                    </div>

                    <p className="text-sm text-gray-500 mt-3">
                        Dark Mode will be available in a future update.
                    </p>

                </div>

                {/* Notifications */}

                <div className="bg-white rounded-xl shadow p-6">

                    <div className="flex justify-between items-center mb-6">

                        <h2 className="text-xl font-semibold">
                            Notifications
                        </h2>

                        {saving && (
                            <span className="
                                text-sm
                                text-blue-600
                                animate-pulse
                            ">
                                Saving...
                            </span>
                        )}

                    </div>

                    {loading ? (

                        <div className="space-y-4">

                            <SkeletonLoader type="card" />

                            <SkeletonLoader type="card" />

                            <SkeletonLoader type="card" />

                        </div>

                    ) : (

                        <div className="space-y-4">

                            <label className="flex justify-between items-center">

                                <span className="text-gray-700 font-medium">
                                    Email Notifications
                                </span>

                                <ToggleSwitch
                                    enabled={notifications.emailNotifications}
                                    disabled={saving}
                                    onChange={() =>
                                        handleToggle("emailNotifications")
                                    }
                                />

                            </label>

                            <label className="flex justify-between items-center">

                                <span className="text-gray-700 font-medium">
                                    Task Notifications
                                </span>

                                <ToggleSwitch
                                    enabled={notifications.taskNotifications}
                                    disabled={saving}
                                    onChange={() =>
                                        handleToggle("taskNotifications")
                                    }
                                />

                            </label>

                            <label className="flex justify-between items-center">

                                <span className="text-gray-700 font-medium">
                                    Chat Notifications
                                </span>

                                <ToggleSwitch
                                    enabled={notifications.chatNotifications}
                                    disabled={saving}
                                    onChange={() =>
                                        handleToggle("chatNotifications")
                                    }
                                />

                            </label>

                        </div>

                    )}

                </div>

            </div>

            <ChangePasswordModal
                isOpen={showPasswordModal}
                onClose={() => setShowPasswordModal(false)}
            />

        </MainLayout>

    );
}