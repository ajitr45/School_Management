import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

function StudentNoticeDetail () {
    const { id } = useParams();
    const navigate = useNavigate();

    const [notice, setNotice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadNotice = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(`notices/${id}/`);
            setNotice(response.data);
        } catch (error) {
            console.log(
                "STUDENT NOTICE DETAIL ERROR:",
                error.response?.data
            );

            setError(
                error.response?.data?.detail ||
                "Failed to load notice."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadNotice();
    }, [id]);

    if (loading) {
        return (
            <div className="py-12 text-center text-gray-500">
                Loading notice...
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-4">
                <button
                    onClick={() => navigate("/student/notices")}
                    className="text-blue-600 hover:underline"
                >
                    ← Back to Notices
                </button>

                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                    {error}
                </div>
            </div>
        );
    }

    if (!notice) {
        return (
            <div className="py-12 text-center text-gray-500">
                Notice not found.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <button
                onClick={() => navigate("/student/notices")}
                className="text-blue-600 hover:underline"
            >
                ← Back to Notices
            </button>

            <div>
                <h1 className="text-3xl font-bold text-gray-800">
                    Notice
                </h1>

                <p className="text-gray-500 mt-1">
                    View school announcement
                </p>
            </div>

            <div className="bg-white rounded-xl shadow">
                <div className="p-6 border-b">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {notice.title || "Notice"}
                    </h2>

                    <p className="text-sm text-gray-500 mt-2">
                        {notice.created_at
                            ? new Date(
                                notice.created_at
                            ).toLocaleDateString()
                            : notice.date || "-"}
                    </p>
                </div>

                <div className="p-6">
                    <div className="bg-gray-50 rounded-lg p-5 text-gray-700 whitespace-pre-wrap leading-7">
                        {notice.description ||
                            notice.content ||
                            notice.message ||
                            "No notice content available."}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StudentNoticeDetail;