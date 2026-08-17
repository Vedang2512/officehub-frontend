import { Eye, EyeOff } from "lucide-react";

export default function PasswordField({
    label,
    name,
    value,
    show,
    toggle,
    onChange
}) {
    return (
        <div>
            <label className="block text-sm font-medium mb-2">
                {label}
            </label>

            <div className="relative">
                <input
                    type={show ? "text" : "password"}
                    name={name}
                    value={value}
                    onChange={onChange}
                    required
                    className="w-full border rounded-lg p-3 pr-12 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />

                <button
                    type="button"
                    onClick={toggle}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                    {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>
        </div>
    );
}