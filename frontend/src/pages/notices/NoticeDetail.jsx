import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

function NoticeDetail () {
    const { id } = useParams();
    const navigate = useNavigate();

    const [notice, setNotice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadNotice = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                `notices/${id}/`
            );

            setNotice(response.data);

        } catch (error) {
            console.log(
                "NOTICE DETAIL ERROR:",
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
            <div className="py-16 text-center text-gray-500">
                Loading notice...
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-4">

                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                    {error}
                </div>

                <button
                    type="button"
                    onClick={() => navigate("/admin/notices")}
                    className="px-5 py-3 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                    Back to Notices
                </button>

            </div>
        );
    }

    if (!notice) {
        return null;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">

            {/* Header */}

            <div className="flex items-center justify-between gap-4">

                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        Notice Details
                    </h1>

                    <p className="text-gray-500 mt-1">
                        View notice information
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => navigate("/admin/notices")}
                    className="px-5 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200"
                >
                    Back
                </button>

            </div>

            {/* Notice */}

            <div className="bg-white rounded-xl shadow overflow-hidden">

                {/* Title */}

                <div className="p-6 border-b">

                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">
                                {notice.title}
                            </h2>

                            <p className="text-sm text-gray-500 mt-2">
                                Created{" "}
                                {notice.created_at
                                    ? new Date(
                                        notice.created_at
                                    ).toLocaleDateString()
                                    : "-"}
                            </p>
                        </div>

                        <span className="self-start px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-700">
                            {notice.audience}
                        </span>

                    </div>

                </div>

                {/* Information */}

                <div className="p-6 space-y-6">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <Info
                            label="Audience"
                            value={notice.audience}
                        />

                        <Info
                            label="School Class"
                            value={
                                notice.school_class || "-"
                            }
                        />

                        <Info
                            label="Expiry Date"
                            value={
                                notice.expiry_date ||
                                "No expiry"
                            }
                        />

                        <Info
                            label="Created At"
                            value={
                                notice.created_at
                                    ? new Date(
                                        notice.created_at
                                    ).toLocaleString()
                                    : "-"
                            }
                        />

                    </div>

                    {/* Description */}

                    <div className="border-t pt-6">

                        <h3 className="text-lg font-semibold text-gray-800 mb-3">
                            Description
                        </h3>

                        <div className="text-gray-600 whitespace-pre-wrap leading-7">
                            {notice.description}
                        </div>

                    </div>

                    {/* Actions */}

                    <div className="border-t pt-6 flex justify-end gap-3">

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    `/admin/notices/${notice.id}/edit`
                                )
                            }
                            className="px-5 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                        >
                            Edit Notice
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}


function Info ({ label, value }) {
    return (
        <div className="bg-gray-50 rounded-lg p-4">

            <p className="text-sm text-gray-500">
                {label}
            </p>

            <p className="text-base font-semibold text-gray-800 mt-1">
                {value}
            </p>

        </div>
    );
}


export default NoticeDetail;