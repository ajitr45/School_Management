import { useEffect, useState } from "react";
import api from "../../services/api";

function TeacherNotices () {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadNotices = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("notices/");

            setNotices(
                Array.isArray(response.data)
                    ? response.data
                    : response.data.results || []
            );
        } catch (error) {
            console.log("NOTICES ERROR:", error.response?.data);
            setError("Failed to load notices.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadNotices();
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">
                    Notices
                </h1>

                <p className="text-gray-500 mt-1">
                    View school notices and announcements
                </p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            <div className="bg-white rounded-xl shadow p-6">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        School Notices
                    </h2>

                    <p className="text-gray-500 mt-1">
                        {notices.length} notices
                    </p>
                </div>

                {loading ? (
                    <div className="py-12 text-center text-gray-500">
                        Loading notices...
                    </div>
                ) : notices.length === 0 ? (
                    <div className="py-16 text-center text-gray-500">
                        No notices found.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {notices.map((notice) => (
                            <div
                                key={notice.id}
                                className="border rounded-lg p-5 hover:bg-gray-50"
                            >
                                <div className="flex justify-between gap-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800">
                                            {notice.title}
                                        </h3>

                                        <p className="text-sm text-gray-500 mt-1">
                                            {notice.created_at
                                                ? new Date(
                                                    notice.created_at
                                                ).toLocaleDateString()
                                                : "-"}
                                        </p>
                                    </div>
                                </div>

                                <p className="text-gray-600 mt-4 whitespace-pre-line">
                                    {notice.description ||
                                        notice.content ||
                                        "-"}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default TeacherNotices;