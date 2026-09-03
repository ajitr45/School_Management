import { useEffect, useState } from "react";
import api from "../../services/api";

function TeacherStudyMaterial () {

    const [assignments, setAssignments] = useState([]);
    const [chapters, setChapters] = useState([]);
    const [materials, setMaterials] = useState([]);

    const [selectedAssignment, setSelectedAssignment] = useState("");
    const [selectedChapter, setSelectedChapter] = useState("");

    const [description, setDescription] = useState("");
    const [file, setFile] = useState(null);

    const [editingId, setEditingId] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");


    // Load teacher assignments, chapters and study materials.
    useEffect(() => {

        const loadData = async () => {

            try {

                setLoading(true);
                setError("");

                const [
                    assignmentsResponse,
                    chaptersResponse,
                    materialsResponse
                ] = await Promise.all([
                    api.get("teachers/assign/"),
                    api.get("study-materials/chapters/"),
                    api.get("study-materials/")
                ]);

                setAssignments(
                    Array.isArray(assignmentsResponse.data)
                        ? assignmentsResponse.data
                        : assignmentsResponse.data.results || []
                );

                setChapters(
                    Array.isArray(chaptersResponse.data)
                        ? chaptersResponse.data
                        : chaptersResponse.data.results || []
                );

                setMaterials(
                    Array.isArray(materialsResponse.data)
                        ? materialsResponse.data
                        : materialsResponse.data.results || []
                );

            } catch (error) {

                console.log(
                    "TEACHER STUDY MATERIAL ERROR:",
                    error.response?.data
                );

                setError(
                    error.response?.data?.detail ||
                    "Failed to load study materials."
                );

            } finally {

                setLoading(false);

            }
        };

        loadData();

    }, []);


    const selected = assignments.find(
        (assignment) =>
            String(assignment.id) === String(selectedAssignment)
    );


    // Show only chapters belonging to selected class and subject.
    const assignedChapters = selected
        ? chapters.filter(
            (chapter) =>
                String(chapter.school_class) ===
                String(selected.school_class) &&
                String(chapter.subject) ===
                String(selected.subject)
        )
        : [];


    // Show only materials belonging to selected class and subject.
    const assignedMaterials = selected
        ? materials.filter(
            (material) => {

                const chapter = chapters.find(
                    (item) =>
                        String(item.id) ===
                        String(material.chapter)
                );

                return (
                    chapter &&
                    String(chapter.school_class) ===
                    String(selected.school_class) &&
                    String(chapter.subject) ===
                    String(selected.subject)
                );
            }
        )
        : [];


    const resetForm = () => {

        setSelectedChapter("");
        setDescription("");
        setFile(null);
        setEditingId(null);

        const fileInput = document.getElementById(
            "study-material-file"
        );

        if (fileInput) {
            fileInput.value = "";
        }
    };


    const handleAssignmentChange = (e) => {

        setSelectedAssignment(e.target.value);

        resetForm();

        setMessage("");
        setError("");
    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setMessage("");

        if (!selectedChapter) {
            setError("Please select a chapter.");
            return;
        }

        if (!editingId && !file) {
            setError("Please select a file.");
            return;
        }

        try {

            setSaving(true);

            const formData = new FormData();

            formData.append(
                "chapter",
                selectedChapter
            );

            formData.append(
                "description",
                description
            );

            if (file) {
                formData.append(
                    "file",
                    file
                );
            }


            if (editingId) {

                await api.patch(
                    `study-materials/${editingId}/`,
                    formData
                );

                setMessage(
                    "Study material updated successfully."
                );

            } else {

                await api.post(
                    "study-materials/",
                    formData
                );

                setMessage(
                    "Study material uploaded successfully."
                );
            }


            const response = await api.get(
                "study-materials/"
            );

            setMaterials(
                Array.isArray(response.data)
                    ? response.data
                    : response.data.results || []
            );

            resetForm();

        } catch (error) {

            console.log(
                "STUDY MATERIAL SAVE ERROR:",
                error.response?.data
            );

            setError(
                error.response?.data?.chapter?.[0] ||
                error.response?.data?.file?.[0] ||
                error.response?.data?.detail ||
                "Failed to save study material."
            );

        } finally {

            setSaving(false);

        }
    };


    const handleEdit = (material) => {

        setEditingId(material.id);
        setSelectedChapter(material.chapter);
        setDescription(material.description || "");
        setFile(null);

        setMessage("");
        setError("");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };


    const handleDelete = async (materialId) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this study material?"
        );

        if (!confirmed) {
            return;
        }

        try {

            setError("");
            setMessage("");

            await api.delete(
                `study-materials/${materialId}/`
            );

            setMaterials((previous) =>
                previous.filter(
                    (material) =>
                        material.id !== materialId
                )
            );

            setMessage(
                "Study material deleted successfully."
            );

        } catch (error) {

            console.log(
                "STUDY MATERIAL DELETE ERROR:",
                error.response?.data
            );

            setError(
                error.response?.data?.detail ||
                "Failed to delete study material."
            );
        }
    };


    const getChapterName = (chapterId) => {

        const chapter = chapters.find(
            (item) =>
                String(item.id) === String(chapterId)
        );

        if (!chapter) {
            return "Unknown Chapter";
        }

        return `Chapter ${chapter.chapter_number} - ${chapter.name}`;
    };


    if (loading) {

        return (
            <div className="py-12 text-center text-gray-500">
                Loading...
            </div>
        );
    }


    return (
        <div className="space-y-6">

            {/* Header */}

            <div>

                <h1 className="text-3xl font-bold text-gray-800">
                    Study Material
                </h1>

                <p className="text-gray-500 mt-1">
                    Upload and manage study materials for your assigned subjects.
                </p>

            </div>


            {/* Error */}

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}


            {/* Success */}

            {message && (
                <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
                    {message}
                </div>
            )}


            {/* Assignment */}

            <div className="bg-white rounded-xl shadow p-6">

                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Class / Section / Subject
                </label>

                <select
                    value={selectedAssignment}
                    onChange={handleAssignmentChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3"
                >

                    <option value="">
                        Select assignment
                    </option>

                    {assignments.map((assignment) => (

                        <option
                            key={assignment.id}
                            value={assignment.id}
                        >
                            Class {assignment.school_class} -
                            Section {assignment.section} -
                            Subject {assignment.subject}
                        </option>

                    ))}

                </select>

            </div>


            {/* Upload / Edit Form */}

            {selectedAssignment && (

                <form
                    onSubmit={handleSubmit}
                    className="bg-white rounded-xl shadow p-6"
                >

                    <h2 className="text-xl font-bold text-gray-800 mb-6">
                        {editingId
                            ? "Edit Study Material"
                            : "Upload Study Material"}
                    </h2>


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Chapter */}

                        <div>

                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Chapter
                            </label>

                            <select
                                value={selectedChapter}
                                onChange={(e) =>
                                    setSelectedChapter(e.target.value)
                                }
                                className="w-full border border-gray-300 rounded-lg px-4 py-3"
                            >

                                <option value="">
                                    Select chapter
                                </option>

                                {assignedChapters.map((chapter) => (

                                    <option
                                        key={chapter.id}
                                        value={chapter.id}
                                    >
                                        Chapter {chapter.chapter_number} -{" "}
                                        {chapter.name}
                                    </option>

                                ))}

                            </select>

                        </div>


                        {/* File */}

                        <div>

                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                File
                            </label>

                            <input
                                id="study-material-file"
                                type="file"
                                onChange={(e) =>
                                    setFile(e.target.files[0])
                                }
                                className="w-full border border-gray-300 rounded-lg px-4 py-3"
                            />

                            {editingId && (
                                <p className="text-sm text-gray-500 mt-2">
                                    Leave empty to keep the existing file.
                                </p>
                            )}

                        </div>

                    </div>


                    {/* Description */}

                    <div className="mt-6">

                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                        </label>

                        <textarea
                            value={description}
                            onChange={(e) =>
                                setDescription(e.target.value)
                            }
                            rows="4"
                            placeholder="Enter material description..."
                            className="w-full border border-gray-300 rounded-lg px-4 py-3"
                        />

                    </div>


                    {/* Buttons */}

                    <div className="flex justify-end gap-3 mt-6">

                        {editingId && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-5 py-3 rounded-lg border border-gray-300 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                        )}

                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            {saving
                                ? "Saving..."
                                : editingId
                                    ? "Update Material"
                                    : "Upload Material"}
                        </button>

                    </div>

                </form>

            )}


            {/* Materials */}

            {selectedAssignment && (

                <div className="bg-white rounded-xl shadow overflow-hidden">

                    <div className="p-6 border-b">

                        <h2 className="text-xl font-bold text-gray-800">
                            Study Materials
                        </h2>

                        <p className="text-gray-500 mt-1">
                            {assignedMaterials.length} materials
                        </p>

                    </div>


                    {assignedMaterials.length === 0 ? (

                        <div className="px-6 py-12 text-center text-gray-500">
                            No study materials found.
                        </div>

                    ) : (

                        <div className="overflow-x-auto">

                            <table className="w-full">

                                <thead>

                                    <tr className="bg-gray-50">

                                        <th className="px-6 py-4 text-left">
                                            #
                                        </th>

                                        <th className="px-6 py-4 text-left">
                                            Chapter
                                        </th>

                                        <th className="px-6 py-4 text-left">
                                            Description
                                        </th>

                                        <th className="px-6 py-4 text-left">
                                            File
                                        </th>

                                        <th className="px-6 py-4 text-left">
                                            Action
                                        </th>

                                    </tr>

                                </thead>


                                <tbody className="divide-y">

                                    {assignedMaterials.map(
                                        (material, index) => (

                                            <tr
                                                key={material.id}
                                                className="hover:bg-gray-50"
                                            >

                                                <td className="px-6 py-4">
                                                    {index + 1}
                                                </td>

                                                <td className="px-6 py-4 font-medium">
                                                    {getChapterName(
                                                        material.chapter
                                                    )}
                                                </td>

                                                <td className="px-6 py-4">
                                                    {material.description ||
                                                        "-"}
                                                </td>

                                                <td className="px-6 py-4">

                                                    {material.file ? (
                                                        <a
                                                            href={material.file}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="text-blue-600 hover:underline"
                                                        >
                                                            View File
                                                        </a>
                                                    ) : (
                                                        "-"
                                                    )}

                                                </td>

                                                <td className="px-6 py-4">

                                                    <div className="flex gap-2">

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleEdit(
                                                                    material
                                                                )
                                                            }
                                                            className="px-3 py-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600"
                                                        >
                                                            Edit
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    material.id
                                                                )
                                                            }
                                                            className="px-3 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
                                                        >
                                                            Delete
                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            )}

        </div>
    );
}

export default TeacherStudyMaterial;