import { useEffect, useState } from "react";
import {
    Pencil,
    Trash2,
    MoreVertical,
    Check,
    X
} from "lucide-react";

import chatService from "../../services/chatService";

export default function MessageBubble({
    message,
    currentUserId,
    onMessageUpdated
}) {

    const [menuOpen, setMenuOpen] = useState(false);
    const [editing, setEditing] = useState(false);
    const [editContent, setEditContent] = useState(message.content);
    const [saving, setSaving] = useState(false);
    

    const mine =
        message.senderId === currentUserId;

    const isDeleted =
        message.deleted;

    const [currentTime, setCurrentTime] = useState(0);

    useEffect(() => {

        if (!mine || isDeleted) {
            return;
        }

        const updateTime = () => {
            setCurrentTime(Date.now());
        };

        updateTime();

        const interval = setInterval(
            updateTime,
            1000
        );

        return () => clearInterval(interval);

    }, [mine, isDeleted]);

    const messageAge =
        currentTime -
        new Date(message.sentAt).getTime();

    const canModify =
        mine &&
        !isDeleted &&
        messageAge <= 5 * 60 * 1000;


    const handleEdit = async () => {

        if (!editContent.trim()) {
            return;
        }

        setSaving(true);

        try {

            const updatedMessage =
                await chatService.editMessage(
                    message.id,
                    editContent.trim()
                );

            onMessageUpdated(updatedMessage);

            setEditing(false);
            setMenuOpen(false);

        } catch (error) {

            console.error(
                "Failed to edit message",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to edit message"
            );

        } finally {

            setSaving(false);

        }

    };


    const handleDelete = async () => {

        const confirmed =
            window.confirm(
                "Delete this message?"
            );

        if (!confirmed) {
            return;
        }

        try {

            const updatedMessage =
                await chatService.deleteMessage(
                    message.id
                );

            onMessageUpdated(updatedMessage);

            setMenuOpen(false);

        } catch (error) {

            console.error(
                "Failed to delete message",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to delete message"
            );

        }

    };


    return (

        <div
            className={`
                flex
                mb-3

                ${
                    mine
                        ? "justify-end"
                        : "justify-start"
                }
            `}
        >

            <div className="relative max-w-sm">

                {
                    editing ? (

                        <div
                            className="
                                flex
                                items-center
                                gap-2
                                bg-blue-600
                                p-2
                                rounded-xl
                            "
                        >

                            <input
                                value={editContent}
                                onChange={(e) =>
                                    setEditContent(
                                        e.target.value
                                    )
                                }
                                className="
                                    px-3
                                    py-2
                                    rounded-lg
                                    text-black
                                    outline-none
                                    w-56
                                "
                                autoFocus
                            />

                            <button
                                onClick={handleEdit}
                                disabled={saving}
                                className="
                                    text-white
                                    hover:text-green-300
                                "
                            >
                                <Check size={18} />
                            </button>

                            <button
                                onClick={() => {
                                    setEditing(false);
                                    setEditContent(
                                        message.content
                                    );
                                }}
                                className="
                                    text-white
                                    hover:text-red-300
                                "
                            >
                                <X size={18} />
                            </button>

                        </div>

                    ) : (

                        <div
                            className={`
                                relative
                                px-4
                                py-2
                                pr-10
                                rounded-xl

                                ${
                                    isDeleted
                                        ? `
                                            bg-gray-200
                                            text-gray-500
                                            italic
                                        `
                                        : mine
                                            ? `
                                                bg-blue-600
                                                text-white
                                            `
                                            : `
                                                bg-gray-200
                                                text-gray-900
                                            `
                                }
                            `}
                        >

                            {/* Message content */}

                            <div
                                className="
                                    flex
                                    items-end
                                    gap-2
                                    leading-relaxed
                                "
                            >

                                <span
                                    className={`
                                        ${
                                            mine && !isDeleted
                                                ? "text-white"
                                                : ""
                                        }
                                    `}
                                >
                                    {message.content}
                                </span>


                                {
                                    message.edited &&
                                    !isDeleted && (

                                        <span
                                            className={`
                                                text-xs
                                                whitespace-nowrap
                                                opacity-70
                                                ml-1
                                                mb-0.5

                                                ${
                                                    mine
                                                        ? "text-white"
                                                        : "text-gray-600"
                                                }
                                            `}
                                        >
                                            Edited
                                        </span>

                                    )
                                }

                            </div>


                            {/* Three-dot menu */}

                            {
                                canModify && (

                                    <div
                                        className="
                                            absolute
                                            top-1
                                            right-1
                                        "
                                    >

                                        <button
                                            onClick={() =>
                                                setMenuOpen(
                                                    !menuOpen
                                                )
                                            }
                                            className="
                                                p-1
                                                rounded-full
                                                hover:bg-black/10
                                            "
                                        >

                                            <MoreVertical
                                                size={16}
                                            />

                                        </button>


                                        {
                                            menuOpen && (

                                                <div className="
                                                    absolute
                                                    right-0
                                                    bottom-full
                                                    mb-1
                                                    bg-white
                                                    text-gray-800
                                                    shadow-lg
                                                    rounded-lg
                                                    border
                                                    overflow-hidden
                                                    z-10
                                                    w-28
                                                ">

                                                    <button
                                                        onClick={() => {
                                                            setEditing(true);
                                                            setMenuOpen(false);
                                                        }}
                                                        className="
                                                            w-full
                                                            flex
                                                            items-center
                                                            gap-2
                                                            px-3
                                                            py-2
                                                            hover:bg-gray-100
                                                            text-sm
                                                        "
                                                    >

                                                        <Pencil size={14} />

                                                        Edit

                                                    </button>


                                                    <button
                                                        onClick={handleDelete}
                                                        className="
                                                            w-full
                                                            flex
                                                            items-center
                                                            gap-2
                                                            px-3
                                                            py-2
                                                            hover:bg-gray-100
                                                            text-sm
                                                            text-red-600
                                                        "
                                                    >

                                                        <Trash2 size={14} />

                                                        Delete

                                                    </button>

                                                </div>

                                            )
                                        }

                                    </div>

                                )
                            }

                        </div>

                    )
                }

            </div>

        </div>

    );
}