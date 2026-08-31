import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function StudyMaterialCreate () {
    const navigate = useNavigate();

    const [chapters, setChapters] = useState([]);

    const [formData, setFormData] = useState({
        chapter: "",
        description: "",
        file: null,
    });

    const [loading, setLoading] = useState(false);
    const [loadingChapters, setLoadingChapters] = useState(true);
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});

    // =====================================================
    // LOAD CHAPTERS
    // =====================================================

    useEffect(() => {
        const loadChapters = async () => {
            try {
                setLoadingChapters(true);
                setError("");

                const response = await api.get(
                    "study-material/chapters/"
                );

                const data = Array.isArray(response.data)
                    ? response.data
                    : response.data.results || [];

                setChapters(data);
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

        loadChapters();
    }, []);

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
            setLoading(true);
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

            if (formData.file) {
                data.append(
                    "file",
                    formData.file
                );
            }

            await api.post(
                "study-material/",
                data
            );

            navigate("/admin/study-material");
        } catch (error) {
            console.log(
                "CREATE STUDY MATERIAL ERROR:",
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
                    "Failed to upload study material."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // LOADING
    // =====================================================

    if (loadingChapters) {
        return (
            <div className="py-12 text-center text-gray-500">
                Loading chapters...
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">

            {/* HEADER */}

            <div className="mb-6">

                <h1 className="text-3xl font-bold text-gray-800">
                    Add Study Material
                </h1>

                <p className="text-gray-500 mt-1">
                    Upload study material for a chapter
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

                {/* FILE */}

                <div>

                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        File
                    </label>

                    <input
                        type="file"
                        name="file"
                        onChange={handleFileChange}
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white"
                    />

                    <p className="text-sm text-gray-500 mt-2">
                        Select the study material file to upload.
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
                            navigate("/admin/study-material")
                        }
                        className="px-5 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading
                            ? "Uploading..."
                            : "Upload Material"}
                    </button>

                </div>

            </form>

        </div>
    );
}

export default StudyMaterialCreate;