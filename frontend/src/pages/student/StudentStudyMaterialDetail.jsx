import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

function StudentStudyMaterialDetail () {
    const { id } = useParams();
    const navigate = useNavigate();

    const [material, setMaterial] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadMaterial = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(`study-materials/${id}/`);
            setMaterial(response.data);
        } catch (error) {
            console.log(
                "STUDENT STUDY MATERIAL DETAIL ERROR:",
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

    useEffect(() => {
        loadMaterial();
    }, [id]);

    if (loading) {
        return (
            <div className="py-12 text-center text-gray-500">
                Loading study material...
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-4">
                <button
                    onClick={() => navigate("/student/study-materials")}
                    className="text-blue-600 hover:underline"
                >
                    ← Back to Study Material
                </button>

                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                    {error}
                </div>
            </div>
        );
    }

    if (!material) {
        return (
            <div className="py-12 text-center text-gray-500">
                Study material not found.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <button
                onClick={() => navigate("/student/study-materials")}
                className="text-blue-600 hover:underline"
            >
                ← Back to Study Material
            </button>

            <div>
                <h1 className="text-3xl font-bold text-gray-800">
                    Study Material
                </h1>

                <p className="text-gray-500 mt-1">
                    View and access your study material
                </p>
            </div>

            <div className="bg-white rounded-xl shadow">
                <div className="p-6 border-b">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Chapter {material.chapter_number}:{" "}
                        {material.chapter_name}
                    </h2>
                </div>

                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <p className="text-sm text-gray-500">
                                Class
                            </p>

                            <p className="font-semibold text-gray-800 mt-1">
                                {material.class_name || "-"}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Subject
                            </p>

                            <p className="font-semibold text-gray-800 mt-1">
                                {material.subject_name || "-"}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Chapter
                            </p>

                            <p className="font-semibold text-gray-800 mt-1">
                                {material.chapter_name || "-"}
                            </p>
                        </div>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500 mb-2">
                            Description
                        </p>

                        <div className="bg-gray-50 rounded-lg p-4 text-gray-700 whitespace-pre-wrap">
                            {material.description ||
                                "No description provided."}
                        </div>
                    </div>

                    {material.file && (
                        <div>
                            <p className="text-sm text-gray-500 mb-2">
                                Study Material File
                            </p>

                            <a
                                href={material.file}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Open File
                            </a>
                        </div>
                    )}

                    <div>
                        <p className="text-sm text-gray-500">
                            Uploaded On
                        </p>

                        <p className="font-semibold text-gray-800 mt-1">
                            {material.created_at
                                ? new Date(
                                    material.created_at
                                ).toLocaleDateString()
                                : "-"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StudentStudyMaterialDetail;