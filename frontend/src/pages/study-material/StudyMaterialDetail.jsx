import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

function StudyMaterialDetail () {
    const { id } = useParams();
    const navigate = useNavigate();

    const [material, setMaterial] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =====================================================
    // LOAD STUDY MATERIAL
    // =====================================================

    useEffect(() => {
        const loadMaterial = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get(
                    `study-materials/${id}/`
                );

                setMaterial(response.data);

            } catch (error) {
                console.log(
                    "STUDY MATERIAL DETAIL ERROR:",
                    error.response?.data
                );

                setError(
                    error.response?.data?.detail ||
                    "Failed to load study material."
                );

            } finally {
                setLoading(false);
            }
        };

        loadMaterial();
    }, [id]);

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <div className="py-12 text-center text-gray-500">
                Loading study material...
            </div>
        );
    }

    // =====================================================
    // NOT FOUND
    // =====================================================

    if (!material) {
        return (
            <div className="max-w-3xl mx-auto">

                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                    {error || "Study material not found."}
                </div>

                <button
                    type="button"
                    onClick={() =>
                        navigate("/admin/study-materials")
                    }
                    className="mt-4 px-5 py-3 bg-gray-100 rounded-lg font-semibold"
                >
                    Back
                </button>

            </div>
        );
    }

    // =====================================================
    // DETAILS
    // =====================================================

    return (
        <div className="max-w-3xl mx-auto space-y-6">

            {/* HEADER */}

            <div className="flex items-center justify-between">

                <div>

                    <h1 className="text-3xl font-bold text-gray-800">
                        Study Material Details
                    </h1>

                    <p className="text-gray-500 mt-1">
                        View uploaded study material
                    </p>

                </div>

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            `/admin/study-materials/${id}/edit`
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

            {/* DETAILS CARD */}

            <div className="bg-white rounded-xl shadow overflow-hidden">

                <div className="p-6 border-b">

                    <h2 className="text-xl font-bold text-gray-800">
                        Study Material
                    </h2>

                </div>

                <div className="divide-y">

                    <DetailRow
                        label="Material ID"
                        value={material.id}
                    />

                    <DetailRow
                        label="Chapter ID"
                        value={material.chapter}
                    />

                    <DetailRow
                        label="Description"
                        value={
                            material.description || "-"
                        }
                    />

                    {/* FILE */}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 px-6 py-4">

                        <div className="font-semibold text-gray-700">
                            File
                        </div>

                        <div className="md:col-span-2">

                            {material.file ? (

                                <a
                                    href={material.file}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 font-semibold hover:underline"
                                >
                                    View / Open File
                                </a>

                            ) : (

                                <span className="text-gray-500">
                                    No file available
                                </span>

                            )}

                        </div>

                    </div>

                    <DetailRow
                        label="Created At"
                        value={
                            material.created_at
                                ? new Date(
                                    material.created_at
                                ).toLocaleString()
                                : "-"
                        }
                    />

                </div>

            </div>

            {/* BACK */}

            <button
                type="button"
                onClick={() =>
                    navigate("/admin/study-materials")
                }
                className="px-5 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200"
            >
                ← Back to Study Material
            </button>

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

            <div className="md:col-span-2 text-gray-600 whitespace-pre-wrap">
                {value ?? "-"}
            </div>

        </div>
    );
}

export default StudyMaterialDetail;