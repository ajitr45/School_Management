import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function StudentStudyMaterial () {
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const loadMaterials = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("study-materials/");

            const data = Array.isArray(response.data)
                ? response.data
                : response.data.results || [];

            setMaterials(data);
        } catch (error) {
            console.log(
                "STUDENT STUDY MATERIAL ERROR:",
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
        loadMaterials();
    }, []);

    if (loading) {
        return (
            <div className="py-12 text-center text-gray-500">
                Loading study material...
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">
                    Study Material
                </h1>
                <p className="text-gray-500 mt-1">
                    Study material shared by your teachers
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
                        Available Materials
                    </h2>

                    <p className="text-gray-500 mt-1">
                        {materials.length} materials
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
                                    Chapter
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                    Subject
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                    Description
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y">
                            {materials.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="px-6 py-12 text-center text-gray-500"
                                    >
                                        No study material found.
                                    </td>
                                </tr>
                            ) : (
                                materials.map((material, index) => (
                                    <tr
                                        key={material.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {index + 1}
                                        </td>

                                        <td className="px-6 py-4">
                                            <p className="font-semibold text-gray-800">
                                                Chapter {material.chapter_number}
                                            </p>

                                            <p className="text-sm text-gray-500">
                                                {material.chapter_name}
                                            </p>
                                        </td>

                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {material.subject_name || "-"}
                                        </td>

                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {material.description
                                                ? material.description.length > 60
                                                    ? `${material.description.slice(0, 60)}...`
                                                    : material.description
                                                : "-"}
                                        </td>

                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() =>
                                                    navigate(
                                                        `/student/study-materials/${material.id}`
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

export default StudentStudyMaterial;