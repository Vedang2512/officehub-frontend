import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import profileService from "../../services/profileService";
import SkeletonLoader from "../../components/common/SkeletonLoader";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/auth/authSlice";
import { useNavigate } from "react-router-dom";

export default function Profile() {

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showEdit, setShowEdit] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: "",
        phoneNumber: "",
        designation: ""
    });


    useEffect(() => {

        const loadProfile = async () => {

            try {

                const data = await profileService.getProfile();

                setProfile(data);

                dispatch(setUser(data));
                setFormData({
                    fullName: data.fullName || "",
                    phoneNumber: data.phoneNumber || "",
                    designation: data.designation || ""
                });

            } catch (err) {

                console.error(err);
                setError("Failed to load profile");

            } finally {

                setLoading(false);

            }
        };


        loadProfile();

    }, [dispatch]);



    if (loading) {

        return (

            <MainLayout>

                <div className="max-w-4xl mx-auto">

                    <h1 className="text-3xl font-bold mb-6">
                        My Profile
                    </h1>


                    <SkeletonLoader type="profile" />


                </div>

            </MainLayout>

        );

    }


    if (error) {

        return (

            <MainLayout>

                <div className="
                    bg-red-50
                    border
                    border-red-200
                    rounded-xl
                    p-6
                    text-red-600
                ">

                    {error}

                </div>

            </MainLayout>

        );

    }

    const handleUpdateProfile = async () => {

        try {

            const updated = await profileService.updateProfile(formData);

            setProfile(updated);

            setShowEdit(false);

        } catch (error) {

            console.error(error);

            alert("Failed to update profile");

        }

    };


    const handleImageUpload = async (e) => {

        const file = e.target.files[0];

        if (!file) return;


        const formData = new FormData();

        formData.append("file", file);


        try {

            setUploading(true);


            const response =
                await profileService.uploadImage(formData);


            const updatedProfile = {
                ...profile,
                profileImage: response
            };

            setProfile(updatedProfile);

            dispatch(setUser(updatedProfile));

            window.dispatchEvent(
                new CustomEvent("profile-image-updated", {
                    detail: updatedProfile
                })
            );


        } catch(error) {

            console.error(error);

            alert("Image upload failed");

        } finally {

            setUploading(false);

        }

    };

    const handleDeleteAccount = async () => {

        try {

            setDeleting(true);

            await profileService.deleteAccount();

            localStorage.removeItem("token");

            dispatch({
                type: "auth/logout"
            });

            navigate("/");

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Failed to delete account"
            );

        } finally {

            setDeleting(false);

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

                <h1 className="text-3xl font-bold mb-6">
                    My Profile
                </h1>


                <div className="
                    bg-white 
                    rounded-2xl 
                    shadow-md 
                    p-4
                    md:p-6
                ">


                    {/* Profile Header */}

                    <div className="
                        flex
                        flex-col
                        sm:flex-row
                        items-center
                        sm:items-start
                        gap-5
                    ">


                        <div>

                            <input
                                type="file"
                                id="profileUpload"
                                hidden
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={uploading}
                            />


                            <label
                                htmlFor="profileUpload"
                                className="
                                    cursor-pointer
                                    relative
                                    group
                                "
                            >
                                {
                                    profile.profileImage ?

                                    <img
                                        src={profile.profileImage}
                                        alt="Profile"
                                        className="
                                            w-20
                                            h-20
                                            md:w-24
                                            md:h-24
                                            rounded-full
                                            object-cover
                                        "
                                    />

                                    :

                                    <div className="
                                        w-20
                                        h-20
                                        md:w-24
                                        md:h-24
                                        rounded-full
                                        bg-blue-600
                                        text-white
                                        flex
                                        items-center
                                        justify-center
                                        text-3xl
                                        font-bold
                                    ">
                                        {
                                            profile.fullName
                                            ?.charAt(0)
                                            .toUpperCase()
                                        }
                                    </div>
                                }
                            </label>

                            {uploading && (
                                <p className="text-sm text-gray-500 mt-2">
                                    Uploading...
                                </p>
                            )}

                            </div>



                        <div>

                            <h2 className="
                                text-xl
                                md:text-2xl
                                font-bold
                            ">
                                {profile.fullName}
                            </h2>


                            <p className="text-gray-600">
                                {profile.email}
                            </p>


                            <span className="
                                inline-block
                                mt-2
                                px-3
                                py-1
                                rounded-full
                                bg-blue-100
                                text-blue-700
                                text-sm
                                font-medium
                            ">
                                {profile.role}
                            </span>


                        </div>


                    </div>



                    {/* Details */}


                    <div className="
                        grid
                        grid-cols-1
                        md:grid-cols-2
                        gap-5
                        mt-8
                    ">


                        <ProfileItem
                            label="Organization"
                            value={profile.organizationName}
                        />


                        <ProfileItem
                            label="Designation"
                            value={profile.designation}
                        />


                        <ProfileItem
                            label="Phone Number"
                            value={profile.phoneNumber}
                        />


                        <ProfileItem
                            label="Email"
                            value={profile.email}
                        />


                    </div>



                    <button
                        onClick={() => setShowEdit(true)}
                        className="
                        mt-8
                        w-full
                        sm:w-auto
                        px-5
                        py-2
                        rounded-lg
                        bg-blue-600
                        text-white
                        hover:bg-blue-700
                        transition
                        shadow-sm
                    "
                    >
                        Edit Profile
                    </button>

                    <div className="
                        mt-6
                        bg-white
                        rounded-2xl
                        shadow-md
                        p-4
                        md:p-6
                        border
                        border-red-200
                    ">

                        <h2 className="text-xl font-bold text-red-600">
                            Danger Zone
                        </h2>

                        <p className="text-gray-600 mt-2">
                            Permanently delete your account and all associated data.
                            This action cannot be undone.
                        </p>

                        <button
                            onClick={() => setShowDeleteModal(true)}
                            className="
                                mt-4
                                px-5
                                py-2
                                rounded-lg
                                bg-red-600
                                text-white
                                hover:bg-red-700
                                transition
                            "
                        >
                            Delete Account
                        </button>

                    </div>


                </div>


            </div>

            {
                showEdit && (

                <div className="
                    fixed
                    inset-0
                    bg-black/40
                    flex
                    items-center
                    justify-center
                    p-4
                ">


                <div className="
                    bg-white
                    rounded-2xl
                    p-6
                    w-full
                    max-w-md
                    max-h-[90vh]
                    overflow-y-auto
                ">


                <h2 className="
                    text-xl
                    font-bold
                    mb-5
                ">
                    Edit Profile
                </h2>


                <input
                    className="
                        w-full
                        border
                        rounded-lg
                        p-3
                        mb-3
                    "
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={(e)=>
                        setFormData({
                            ...formData,
                            fullName:e.target.value
                        })
                    }
                />


                <input
                    className="
                        w-full
                        border
                        rounded-lg
                        p-3
                        mb-3
                    "
                    placeholder="Phone Number"
                    value={formData.phoneNumber}
                    onChange={(e)=>
                        setFormData({
                            ...formData,
                            phoneNumber:e.target.value
                        })
                    }
                />


                <input
                    className="
                        w-full
                        border
                        rounded-lg
                        p-3
                        mb-3
                    "
                    placeholder="Designation"
                    value={formData.designation}
                    onChange={(e)=>
                        setFormData({
                            ...formData,
                            designation:e.target.value
                        })
                    }
                />



                <div className="
                    flex
                    flex-col
                    sm:flex-row
                    justify-end
                    gap-3
                    mt-5
                ">


                <button
                    onClick={() => setShowEdit(false)}
                    className="
                        px-4
                        py-2
                        rounded-lg
                        border
                        w-full
                        sm:w-auto
                    "
                >
                    Cancel
                </button>



                <button
                    onClick={handleUpdateProfile}
                    className="
                        px-4
                        py-2
                        rounded-lg
                        bg-blue-600
                        text-white
                        w-full
                        sm:w-auto
                    "
                >
                    Save
                </button>


                </div>


                </div>


                </div>

                )
                }


                {
                    showDeleteModal && (

                        <div className="
                            fixed
                            inset-0
                            bg-black/50
                            flex
                            items-center
                            justify-center
                            p-4
                            z-50
                        ">

                            <div className="
                                bg-white
                                rounded-2xl
                                p-6
                                w-full
                                max-w-md
                                shadow-xl
                            ">

                                <h2 className="
                                    text-xl
                                    font-bold
                                    text-red-600
                                ">
                                    Delete Account?
                                </h2>

                                <p className="text-gray-600 mt-3">
                                    This will permanently delete your account,
                                    tasks, messages, notifications and team
                                    memberships.
                                </p>

                                <p className="
                                    text-sm
                                    font-semibold
                                    text-red-600
                                    mt-3
                                ">
                                    This action cannot be undone.
                                </p>

                                <div className="
                                    flex
                                    flex-col
                                    sm:flex-row
                                    justify-end
                                    gap-3
                                    mt-6
                                ">

                                    <button
                                        onClick={() => setShowDeleteModal(false)}
                                        disabled={deleting}
                                        className="
                                            px-4
                                            py-2
                                            rounded-lg
                                            border
                                            w-full
                                            sm:w-auto
                                        "
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        onClick={handleDeleteAccount}
                                        disabled={deleting}
                                        className="
                                            px-4
                                            py-2
                                            rounded-lg
                                            bg-red-600
                                            text-white
                                            hover:bg-red-700
                                            w-full
                                            sm:w-auto
                                        "
                                    >
                                        {deleting
                                            ? "Deleting..."
                                            : "Yes, Delete My Account"
                                        }
                                    </button>

                                </div>

                            </div>

                        </div>
                    )
                }


        </MainLayout>

    );
}



function ProfileItem({label, value}) {

    return (

        <div className="
            border
            rounded-xl
            p-4
        ">

            <p className="
                text-sm
                text-gray-500
            ">
                {label}
            </p>


            <p className="
                font-semibold
                mt-1
            ">
                {value || "Not added"}
            </p>


        </div>

    );

}