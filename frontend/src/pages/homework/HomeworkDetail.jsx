import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

function HomeworkDetail () {
    const { id } = useParams();
    const navigate = useNavigate();

    const [homework, setHomework] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadHomework = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get(
                    `homework/${id}/`
                );

                setHomework(response.data);
            } catch (error) {
                console.log(error.response?.data);

                setError(
                    error.response?.data?.detail ||
                    "Failed to load homework."
                );
            } finally {
                setLoading(false);
            }
        };

        loadHomework();
    }, [id]);

    if (loading) {
        return (
            <div className="py-12 text-center text-gray-500">
                Loading homework...
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
                    onClick={() => navigate("/admin/homework")}
                    className="px-5 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
                >
                    Back to Homework
                </button>

            </div>
        );
    }

    if (!homework) {
        return null;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">

            {/* HEADER */}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                <div>

                    <h1 className="text-3xl font-bold text-gray-800">
                        Homework Details
                    </h1>

                    <p className="text-gray-500 mt-1">
                        View homework information
                    </p>

                </div>

                <div className="flex gap-3">

                    <button
                        type="button"
                        onClick={() =>
                            navigate(`/admin/homework/${id}/edit`)
                        }
                        className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/admin/homework")
                        }
                        className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                        Back
                    </button>

                </div>

            </div>

            {/* HOMEWORK CARD */}

            <div className="bg-white rounded-xl shadow overflow-hidden">

                {/* TITLE */}

                <div className="p-6 border-b">

                    <h2 className="text-2xl font-bold text-gray-800">
                        {homework.title}
                    </h2>

                    <p className="text-gray-500 mt-2">
                        Due Date:{" "}
                        <span className="font-medium text-gray-700">
                            {homework.due_date || "-"}
                        </span>
                    </p>

                </div>

                {/* DETAILS */}

                <div className="p-6">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <InfoBox
                            label="Class"
                            value={
                                homework.class_name ||
                                homework.school_class
                            }
                        />

                        <InfoBox
                            label="Section"
                            value={
                                homework.section_name ||
                                homework.section
                            }
                        />

                        <InfoBox
                            label="Subject"
                            value={
                                homework.subject_name ||
                                homework.subject
                            }
                        />

                        <InfoBox
                            label="Teacher"
                            value={
                                homework.teacher_name ||
                                homework.teacher
                            }
                        />

                        <InfoBox
                            label="Created At"
                            value={formatDateTime(homework.created_at)}
                        />

                        <InfoBox
                            label="Updated At"
                            value={formatDateTime(homework.updated_at)}
                        />

                    </div>

                </div>

                {/* DESCRIPTION */}

                <div className="p-6 border-t">

                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                        Description
                    </h3>

                    <div className="bg-gray-50 rounded-lg p-5 text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {homework.description || "No description available."}
                    </div>

                </div>

            </div>

        </div>
    );
}


// =====================================================
// INFO BOX
// =====================================================

function InfoBox ({ label, value }) {
    return (
        <div className="bg-gray-50 rounded-lg p-4">

            <p className="text-xs text-gray-500">
                {label}
            </p>

            <p className="font-semibold text-gray-800 mt-1">
                {value || "-"}
            </p>

        </div>
    );
}


// =====================================================
// DATE TIME
// =====================================================

function formatDateTime (value) {
    if (!value) return "-";

    return new Date(value).toLocaleString();
}


export default HomeworkDetail;