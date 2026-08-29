import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function StudyMaterial () {
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState("materials");

    const [chapters, setChapters] = useState([]);
    const [materials, setMaterials] = useState([]);

    const [loadingChapters, setLoadingChapters] = useState(true);
    const [loadingMaterials, setLoadingMaterials] = useState(true);

    const [error, setError] = useState("");

    // =====================================================
    // LOAD CHAPTERS
    // =====================================================

    const loadChapters = async () => {
        try {
            setLoadingChapters(true);
            setError("");

            const response = await api.get(
                "study-material/chapters/"
            );

            setChapters(
                Array.isArray(response.data)
                    ? response.data
                    : response.data.results || []
            );
        } catch (error) {
            console.log(
                "CHAPTERS ERROR:",
                error.response?.data
            );

            setError(
                error.response?.data?.detail ||
                "Failed to load chapters."
            );
        } finally {
            setLoadingChapters(false);
        }
    };

    // =====================================================
    // LOAD STUDY MATERIALS
    // =====================================================

    const loadMaterials = async () => {
        try {
            setLoadingMaterials(true);
            setError("");

            const response = await api.get(
                "study-material/"
            );

            setMaterials(
                Array.isArray(response.data)
                    ? response.data
                    : response.data.results || []
            );
        } catch (error) {
            console.log(
                "STUDY MATERIAL ERROR:",
                error.response?.data
            );

            setError(
                error.response?.data?.detail ||
                "Failed to load study materials."
            );
        } finally {
            setLoadingMaterials(false);
        }
    };

    // =====================================================
    // LOAD DATA
    // =====================================================

    useEffect(() => {
        loadChapters();
        loadMaterials();
    }, []);

    // =====================================================
    // DELETE CHAPTER
    // =====================================================

    const handleDeleteChapter = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this chapter?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");

            await api.delete(
                `study-material/chapters/${id}/`
            );

            setChapters((previous) =>
                previous.filter(
                    (chapter) => chapter.id !== id
                )
            );

            // Refresh materials because deleting a chapter
            // also deletes its related materials.
            loadMaterials();

        } catch (error) {
            console.log(
                "DELETE CHAPTER ERROR:",
                error.response?.data
            );

            setError(
                error.response?.data?.detail ||
                "Failed to delete chapter."
            );
        }
    };

    // =====================================================
    // DELETE MATERIAL
    // =====================================================

    const handleDeleteMaterial = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this study material?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");

            await api.delete(
                `study-material/${id}/`
            );

            setMaterials((previous) =>
                previous.filter(
                    (material) => material.id !== id
                )
            );

        } catch (error) {
            console.log(
                "DELETE MATERIAL ERROR:",
                error.response?.data
            );

            setError(
                error.response?.data?.detail ||
                "Failed to delete study material."
            );
        }
    };

    return (
        <div className="space-y-6">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                <div>

                    <h1 className="text-3xl font-bold text-gray-800">
                        Study Material
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Manage chapters and study materials
                    </p>

                </div>

                <button
                    type="button"
                    onClick={() => {
                        if (activeTab === "chapters") {
                            navigate(
                                "/admin/study-material/chapters/create"
                            );
                        } else {
                            navigate(
                                "/admin/study-material/create"
                            );
                        }
                    }}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                >
                    + Add {activeTab === "chapters" ? "Chapter" : "Material"}
                </button>

            </div>

            {/* =================================================
                ERROR
            ================================================= */}

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {/* =================================================
                MAIN CARD
            ================================================= */}

            <div className="bg-white rounded-xl shadow overflow-hidden">

                {/* =================================================
                    TABS
                ================================================= */}

                <div className="flex border-b">

                    <button
                        type="button"
                        onClick={() => setActiveTab("materials")}
                        className={`px-8 py-5 text-lg font-semibold ${activeTab === "materials"
                            ? "text-blue-600 border-b-2 border-blue-600"
                            : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        Study Materials
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab("chapters")}
                        className={`px-8 py-5 text-lg font-semibold ${activeTab === "chapters"
                            ? "text-blue-600 border-b-2 border-blue-600"
                            : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        Chapters
                    </button>

                </div>

                <div className="p-6">

                    {/* =================================================
                        MATERIALS
                    ================================================= */}

                    {activeTab === "materials" && (

                        <MaterialList
                            materials={materials}
                            chapters={chapters}
                            loading={loadingMaterials}
                            onDelete={handleDeleteMaterial}
                            navigate={navigate}
                        />

                    )}

                    {/* =================================================
                        CHAPTERS
                    ================================================= */}

                    {activeTab === "chapters" && (

                        <ChapterList
                            chapters={chapters}
                            loading={loadingChapters}
                            onDelete={handleDeleteChapter}
                            navigate={navigate}
                        />

                    )}

                </div>

            </div>

        </div>
    );
}


// =============================================================
// CHAPTER LIST
// =============================================================

function ChapterList ({
    chapters,
    loading,
    onDelete,
    navigate,
}) {
    if (loading) {
        return (
            <div className="py-12 text-center text-gray-500">
                Loading chapters...
            </div>
        );
    }

    return (
        <div>

            <div className="mb-6">

                <h2 className="text-2xl font-bold text-gray-800">
                    Chapters
                </h2>

                <p className="text-gray-500 mt-1">
                    {chapters.length} chapters
                </p>

            </div>

            <div className="overflow-x-auto">

                <table className="w-full">

                    <thead>

                        <tr className="bg-gray-50">

                            <Th>#</Th>
                            <Th>Class</Th>
                            <Th>Subject</Th>
                            <Th>Chapter No.</Th>
                            <Th>Chapter Name</Th>
                            <Th>Actions</Th>

                        </tr>

                    </thead>

                    <tbody className="divide-y">

                        {chapters.length === 0 ? (

                            <tr>
                                <td
                                    colSpan="6"
                                    className="px-6 py-16 text-center text-gray-500"
                                >
                                    No chapters found.
                                </td>
                            </tr>

                        ) : (

                            chapters.map((chapter, index) => (

                                <tr
                                    key={chapter.id}
                                    className="hover:bg-gray-50"
                                >

                                    <Td>
                                        {index + 1}
                                    </Td>

                                    <Td>
                                        {chapter.school_class}
                                    </Td>

                                    <Td>
                                        {chapter.subject}
                                    </Td>

                                    <Td>
                                        {chapter.chapter_number}
                                    </Td>

                                    <Td>
                                        <span className="font-semibold text-gray-800">
                                            {chapter.name}
                                        </span>
                                    </Td>

                                    <Td>

                                        <div className="flex gap-2">

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    navigate(
                                                        `/admin/study-material/chapters/${chapter.id}`
                                                    )
                                                }
                                                className="px-3 py-1.5 text-sm bg-gray-100 rounded-md hover:bg-gray-200"
                                            >
                                                View
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    navigate(
                                                        `/admin/study-material/chapters/${chapter.id}/edit`
                                                    )
                                                }
                                                className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onDelete(chapter.id)
                                                }
                                                className="px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                                            >
                                                Delete
                                            </button>

                                        </div>

                                    </Td>

                                </tr>

                            ))

                        )}

                    </tbody>

                </table>

            </div>

        </div>
    );
}


// =============================================================
// MATERIAL LIST
// =============================================================

function MaterialList ({
    materials,
    chapters,
    loading,
    onDelete,
    navigate,
}) {
    if (loading) {
        return (
            <div className="py-12 text-center text-gray-500">
                Loading study materials...
            </div>
        );
    }

    return (
        <div>

            <div className="mb-6">

                <h2 className="text-2xl font-bold text-gray-800">
                    Study Materials
                </h2>

                <p className="text-gray-500 mt-1">
                    {materials.length} materials
                </p>

            </div>

            <div className="overflow-x-auto">

                <table className="w-full">

                    <thead>

                        <tr className="bg-gray-50">

                            <Th>#</Th>
                            <Th>Chapter</Th>
                            <Th>Description</Th>
                            <Th>File</Th>
                            <Th>Created At</Th>
                            <Th>Actions</Th>

                        </tr>

                    </thead>

                    <tbody className="divide-y">

                        {materials.length === 0 ? (

                            <tr>
                                <td
                                    colSpan="6"
                                    className="px-6 py-16 text-center text-gray-500"
                                >
                                    No study materials found.
                                </td>
                            </tr>

                        ) : (

                            materials.map((material, index) => {

                                const chapter = chapters.find(
                                    (item) =>
                                        item.id === material.chapter
                                );

                                return (
                                    <tr
                                        key={material.id}
                                        className="hover:bg-gray-50"
                                    >

                                        <Td>
                                            {index + 1}
                                        </Td>

                                        <Td>
                                            <span className="font-semibold text-gray-800">
                                                {chapter
                                                    ? chapter.name
                                                    : `Chapter ${material.chapter}`}
                                            </span>
                                        </Td>

                                        <Td>
                                            <span className="max-w-xs block truncate">
                                                {material.description || "-"}
                                            </span>
                                        </Td>

                                        <Td>

                                            {material.file ? (

                                                <a
                                                    href={material.file}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    Open File
                                                </a>

                                            ) : (
                                                "-"
                                            )}

                                        </Td>

                                        <Td>
                                            {material.created_at
                                                ? new Date(
                                                    material.created_at
                                                ).toLocaleDateString()
                                                : "-"}
                                        </Td>

                                        <Td>

                                            <div className="flex gap-2">

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        navigate(
                                                            `/admin/study-material/${material.id}`
                                                        )
                                                    }
                                                    className="px-3 py-1.5 text-sm bg-gray-100 rounded-md hover:bg-gray-200"
                                                >
                                                    View
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        navigate(
                                                            `/admin/study-material/${material.id}/edit`
                                                        )
                                                    }
                                                    className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        onDelete(material.id)
                                                    }
                                                    className="px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                                                >
                                                    Delete
                                                </button>

                                            </div>

                                        </Td>

                                    </tr>
                                );
                            })

                        )}

                    </tbody>

                </table>

            </div>

        </div>
    );
}


// =============================================================
// TABLE HEADER
// =============================================================

function Th ({ children }) {
    return (
        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 whitespace-nowrap">
            {children}
        </th>
    );
}


// =============================================================
// TABLE DATA
// =============================================================

function Td ({ children }) {
    return (
        <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
            {children}
        </td>
    );
}


export default StudyMaterial;