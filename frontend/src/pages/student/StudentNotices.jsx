import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function StudentNotices () {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const loadNotices = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("notices/");

            const data = Array.isArray(response.data)
                ? response.data
                : response.data.results || [];

            setNotices(data);
        } catch (error) {
            console.log("STUDENT NOTICES ERROR:", error.response?.data);

            setError(
                error.response?.data?.detail ||
                "Failed to load notices."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadNotices();
    }, []);

    if (loading) {
        return (
            <div className="py-12 text-center text-gray-500">
                Loading notices...
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">
                    Notices
                </h1>

                <p className="text-gray-500 mt-1">
                    Important announcements from your school
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
                        School Notices
                    </h2>

                    <p className="text-gray-500 mt-1">
                        {notices.length} notices
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
                                    Date
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y">
                            {notices.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="4"
                                        className="px-6 py-12 text-center text-gray-500"
                                    >
                                        No notices found.
                                    </td>
                                </tr>
                            ) : (
                                notices.map((notice, index) => (
                                    <tr
                                        key={notice.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {index + 1}
                                        </td>

                                        <td className="px-6 py-4">
                                            <p className="font-semibold text-gray-800">
                                                {notice.title || "-"}
                                            </p>
                                        </td>

                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {notice.created_at
                                                ? new Date(
                                                    notice.created_at
                                                ).toLocaleDateString()
                                                : notice.date || "-"}
                                        </td>

                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() =>
                                                    navigate(
                                                        `/student/notices/${notice.id}`
                                                    )
                                                }
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

export default StudentNotices;