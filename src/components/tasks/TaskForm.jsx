import Button from "../common/Button";
import ErrorMessage from "../common/ErrorMessage";

export default function TaskForm({
    formData,
    handleChange,
    handleSubmit,
    employees,
    teams,
    loading,
    error,
    submitLabel,
    showStatus = false,
    onCancel
}) {

    return (

        <form
            onSubmit={handleSubmit}
            className="bg-white shadow rounded-lg p-6 space-y-4 max-w-xl"
        >

            <input
                type="text"
                name="title"
                placeholder="Task Title"
                value={formData.title}
                onChange={handleChange}
                className="w-full border rounded p-2"
                required
            />

            <textarea
                name="description"
                placeholder="Task Description"
                value={formData.description}
                onChange={handleChange}
                className="w-full border rounded p-2"
                rows="4"
            />

            <select
                name="assignedToUserId"
                value={formData.assignedToUserId}
                onChange={handleChange}
                className="w-full border rounded p-2"
                required
            >
                <option value="">
                    Select Employee
                </option>

                {employees.map(employee => (

                    <option
                        key={employee.id}
                        value={employee.id}
                    >
                        {employee.name} ({employee.email})
                    </option>

                ))}

            </select>

            <select
                name="teamId"
                value={formData.teamId}
                onChange={handleChange}
                className="w-full border rounded p-2"
                required
            >
                <option value="">
                    Select Team
                </option>

                {teams.map(team => (

                    <option
                        key={team.id}
                        value={team.id}
                    >
                        {team.name}
                    </option>

                ))}

            </select>

            <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full border rounded p-2"
            >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
            </select>

            {showStatus && (

                <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                >
                    <option value="TODO">TODO</option>
                    <option value="IN_PROGRESS">IN PROGRESS</option>
                    <option value="COMPLETED">COMPLETED</option>
                </select>

            )}

            <input
                type="datetime-local"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full border rounded p-2"
                required
            />

            <ErrorMessage message={error} />

            <div className="flex gap-3">

                <Button
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Saving..." : submitLabel}
                </Button>

                {onCancel && (

                    <Button
                        type="button"
                        onClick={onCancel}
                        className="bg-gray-600 hover:bg-gray-700"
                    >
                        Cancel
                    </Button>

                )}

            </div>

        </form>

    );

}