import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function StudentHomework () {
    const [homeworks, setHomeworks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const loadHomeworks = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("homework/");

            const data = Array.isArray(response.data)
                ? response.data
                : response.data.results || [];

            setHomeworks(data);
        } catch (error) {
            console.log("STUDENT HOMEWORK ERROR:", error.response?.data);
            setError(
                error.response?.data?.detail ||
                "Failed to load homework."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadHomeworks();
    }, []);

    if (loading) {
        return (
            <div className="py-12 text-center text-gray-500">
                Loading homework...
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">
                    My Homework
                </h1>
                <p className="text-gray-500 mt-1">
                    View homework assigned to your class
                </p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            <div className="bg-white rounded-xl shadow overflow-hidden">
                <div className="p-6 border-b">
                    <h2 className="text-xl font-bold text-gray-800">
                        Homework
                    </h2>
                    <p className="text-gray-500 mt-1">
                        {homeworks.length} homework records
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                    #
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                    Title
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                    Subject
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                    Teacher
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                    Due Date
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y">
                            {homeworks.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="px-6 py-12 text-center text-gray-500"
                                    >
                                        No homework found.
                                    </td>
                                </tr>
                            ) : (
                                homeworks.map((homework, index) => (
                                    <tr
                                        key={homework.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {index + 1}
                                        </td>

                                        <td className="px-6 py-4">
                                            <p className="font-semibold text-gray-800">
                                                {homework.title}
                                            </p>
                                        </td>

                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {homework.subject_name || "-"}
                                        </td>

                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {homework.teacher_name || "-"}
                                        </td>

                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {homework.due_date}
                                        </td>

                                        <td className="px-6 py-4">
                                            <button onClick={() =>navigate(`/student/homework/${homework.id}`)}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default StudentHomework;