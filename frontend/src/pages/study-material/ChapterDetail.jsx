import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

function ChapterDetail () {
    const { id } = useParams();
    const navigate = useNavigate();

    const [chapter, setChapter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadChapter = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                `study-material/chapters/${id}/`
            );

            setChapter(response.data);
        } catch (error) {
            console.log(
                "CHAPTER DETAIL ERROR:",
                error.response?.data
            );

            setError(
                error.response?.data?.detail ||
                "Failed to load chapter."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadChapter();
    }, [id]);

    if (loading) {
        return (
            <div className="py-12 text-center text-gray-500">
                Loading chapter...
            </div>
        );
    }

    if (!chapter) {
        return (
            <div className="max-w-3xl mx-auto">
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                    {error || "Chapter not found."}
                </div>

                <button
                    type="button"
                    onClick={() =>
                        navigate("/admin/study-material")
                    }
                    className="mt-4 px-5 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200"
                >
                    Back
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">

            {/* HEADER */}

            <div className="flex items-center justify-between">

                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        Chapter Details
                    </h1>

                    <p className="text-gray-500 mt-1">
                        View chapter information
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            `/admin/study-material/chapters/${id}/edit`
                        )
                    }
                    className="px-5 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                >
                    Edit
                </button>

            </div>

            {/* ERROR */}

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {/* DETAILS */}

            <div className="bg-white rounded-xl shadow overflow-hidden">

                <div className="p-6 border-b">

                    <h2 className="text-xl font-bold text-gray-800">
                        {chapter.name}
                    </h2>

                </div>

                <div className="divide-y">

                    <DetailRow
                        label="Chapter ID"
                        value={chapter.id}
                    />

                    <DetailRow
                        label="Class"
                        value={chapter.school_class}
                    />

                    <DetailRow
                        label="Subject"
                        value={chapter.subject}
                    />

                    <DetailRow
                        label="Chapter Number"
                        value={chapter.chapter_number}
                    />

                    <DetailRow
                        label="Chapter Name"
                        value={chapter.name}
                    />

                    <DetailRow
                        label="Created At"
                        value={
                            chapter.created_at
                                ? new Date(
                                    chapter.created_at
                                ).toLocaleString()
                                : "-"
                        }
                    />

                </div>

            </div>

            {/* BACK */}

            <div>

                <button
                    type="button"
                    onClick={() =>
                        navigate("/admin/study-material")
                    }
                    className="px-5 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200"
                >
                    ← Back to Study Material
                </button>

            </div>

        </div>
    );
}


// =====================================================
// DETAIL ROW
// =====================================================

function DetailRow ({ label, value }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 px-6 py-4">

            <div className="font-semibold text-gray-700">
                {label}
            </div>

            <div className="md:col-span-2 text-gray-600">
                {value ?? "-"}
            </div>

        </div>
    );
}

export default ChapterDetail;