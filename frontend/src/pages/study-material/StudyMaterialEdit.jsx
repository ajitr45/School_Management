import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

function StudyMaterialEdit () {
    const { id } = useParams();
    const navigate = useNavigate();

    const [chapters, setChapters] = useState([]);

    const [formData, setFormData] = useState({
        chapter: "",
        description: "",
        file: null,
    });

    const [existingFile, setExistingFile] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});

    // =====================================================
    // LOAD MATERIAL + CHAPTERS
    // =====================================================

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError("");

                const [materialResponse, chaptersResponse] =
                    await Promise.all([
                        api.get(`study-material/${id}/`),
                        api.get("study-material/chapters/"),
                    ]);

                const material = materialResponse.data;

                setFormData({
                    chapter: material.chapter || "",
                    description: material.description || "",
                    file: null,
                });

                setExistingFile(material.file || "");

                const chapterData = Array.isArray(
                    chaptersResponse.data
                )
                    ? chaptersResponse.data
                    : chaptersResponse.data.results || [];

                setChapters(chapterData);
            } catch (error) {
                console.log(
                    "STUDY MATERIAL EDIT ERROR:",
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

        loadData();
    }, [id]);

    // =====================================================
    // INPUT CHANGE
    // =====================================================

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        setFieldErrors((previous) => ({
            ...previous,
            [name]: "",
        }));
    };

    // =====================================================
    // FILE CHANGE
    // =====================================================

    const handleFileChange = (event) => {
        const file = event.target.files[0] || null;

        setFormData((previous) => ({
            ...previous,
            file,
        }));

        setFieldErrors((previous) => ({
            ...previous,
            file: "",
        }));
    };

    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setSaving(true);
            setError("");
            setFieldErrors({});

            const data = new FormData();

            data.append(
                "chapter",
                formData.chapter
            );

            data.append(
                "description",
                formData.description.trim()
            );

            // File is optional during edit.
            if (formData.file) {
                data.append(
                    "file",
                    formData.file
                );
            }

            await api.patch(
                `study-material/${id}/`,
                data
            );

            navigate(
                `/admin/study-material/${id}`
            );
        } catch (error) {
            console.log(
                "UPDATE STUDY MATERIAL ERROR:",
                error.response?.data
            );

            const responseErrors =
                error.response?.data;

            if (
                responseErrors &&
                typeof responseErrors === "object"
            ) {
                setFieldErrors(responseErrors);
            } else {
                setError(
                    "Failed to update study material."
                );
            }
        } finally {
            setSaving(false);
        }
    };

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

    return (
        <div className="max-w-3xl mx-auto">

            {/* HEADER */}

            <div className="mb-6">

                <h1 className="text-3xl font-bold text-gray-800">
                    Edit Study Material
                </h1>

                <p className="text-gray-500 mt-1">
                    Update study material information
                </p>

            </div>

            {/* ERROR */}

            {error && (
                <div className="mb-5 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {/* FORM */}

            <form
                onSubmit={handleSubmit}
                encType="multipart/form-data"
                className="bg-white rounded-xl shadow p-6 space-y-6"
            >

                {/* CHAPTER */}

                <div>

                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Chapter
                    </label>

                    <select
                        name="chapter"
                        value={formData.chapter}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >

                        <option value="">
                            Select Chapter
                        </option>

                        {chapters.map((chapter) => (
                            <option
                                key={chapter.id}
                                value={chapter.id}
                            >
                                Chapter {chapter.chapter_number} -{" "}
                                {chapter.name}
                            </option>
                        ))}

                    </select>

                    {fieldErrors.chapter && (
                        <p className="text-red-500 text-sm mt-1">
                            {Array.isArray(
                                fieldErrors.chapter
                            )
                                ? fieldErrors.chapter[0]
                                : fieldErrors.chapter}
                        </p>
                    )}

                </div>

                {/* DESCRIPTION */}

                <div>

                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Description
                    </label>

                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="5"
                        placeholder="Enter study material description"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    {fieldErrors.description && (
                        <p className="text-red-500 text-sm mt-1">
                            {Array.isArray(
                                fieldErrors.description
                            )
                                ? fieldErrors.description[0]
                                : fieldErrors.description}
                        </p>
                    )}

                </div>

                {/* EXISTING FILE */}

                {existingFile && (
                    <div className="bg-gray-50 border rounded-lg p-4">

                        <p className="text-sm font-semibold text-gray-700 mb-2">
                            Current File
                        </p>

                        <a
                            href={existingFile}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                        >
                            View Current File
                        </a>

                    </div>
                )}

                {/* NEW FILE */}

                <div>

                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Replace File
                    </label>

                    <input
                        type="file"
                        name="file"
                        onChange={handleFileChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white"
                    />

                    <p className="text-sm text-gray-500 mt-2">
                        Leave empty if you don't want to replace
                        the current file.
                    </p>

                    {fieldErrors.file && (
                        <p className="text-red-500 text-sm mt-1">
                            {Array.isArray(fieldErrors.file)
                                ? fieldErrors.file[0]
                                : fieldErrors.file}
                        </p>
                    )}

                </div>

                {/* BUTTONS */}

                <div className="flex justify-end gap-3 pt-4 border-t">

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                `/admin/study-material/${id}`
                            )
                        }
                        className="px-5 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
                    >
                        {saving
                            ? "Updating..."
                            : "Update Material"}
                    </button>

                </div>

            </form>

        </div>
    );
}

export default StudyMaterialEdit;