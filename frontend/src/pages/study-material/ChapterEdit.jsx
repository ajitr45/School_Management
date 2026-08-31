import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

function ChapterEdit () {
    const { id } = useParams();
    const navigate = useNavigate();

    const [classes, setClasses] = useState([]);
    const [subjects, setSubjects] = useState([]);

    const [formData, setFormData] = useState({
        school_class: "",
        subject: "",
        chapter_number: "",
        name: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});

    // =====================================================
    // LOAD CHAPTER + CLASSES + SUBJECTS
    // =====================================================

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError("");

                const [
                    chapterResponse,
                    classesResponse,
                    subjectsResponse,
                ] = await Promise.all([
                    api.get(`study-material/chapters/${id}/`),
                    api.get("academics/classes/"),
                    api.get("academics/subjects/"),
                ]);

                const chapter = chapterResponse.data;

                setFormData({
                    school_class: chapter.school_class || "",
                    subject: chapter.subject || "",
                    chapter_number:
                        chapter.chapter_number || "",
                    name: chapter.name || "",
                });

                setClasses(
                    Array.isArray(classesResponse.data)
                        ? classesResponse.data
                        : classesResponse.data.results || []
                );

                setSubjects(
                    Array.isArray(subjectsResponse.data)
                        ? subjectsResponse.data
                        : subjectsResponse.data.results || []
                );
            } catch (error) {
                console.log(
                    "CHAPTER EDIT ERROR:",
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
    // SUBMIT
    // =====================================================

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setSaving(true);
            setError("");
            setFieldErrors({});

            await api.patch(
                `study-material/chapters/${id}/`,
                {
                    school_class: Number(
                        formData.school_class
                    ),
                    subject: Number(formData.subject),
                    chapter_number: Number(
                        formData.chapter_number
                    ),
                    name: formData.name.trim(),
                }
            );

            navigate(
                `/admin/study-material/chapters/${id}`
            );
        } catch (error) {
            console.log(
                "UPDATE CHAPTER ERROR:",
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
                setError("Failed to update chapter.");
            }
        } finally {
            setSaving(false);
        }
    };

    // =====================================================
    // FILTER SUBJECTS
    // =====================================================

    const filteredSubjects = subjects.filter(
        (subject) =>
            String(subject.school_class) ===
            String(formData.school_class)
    );

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <div className="py-12 text-center text-gray-500">
                Loading chapter...
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">

            {/* HEADER */}

            <div className="mb-6">

                <h1 className="text-3xl font-bold text-gray-800">
                    Edit Chapter
                </h1>

                <p className="text-gray-500 mt-1">
                    Update chapter information
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
                className="bg-white rounded-xl shadow p-6 space-y-6"
            >

                {/* CLASS */}

                <div>

                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Class
                    </label>

                    <select
                        name="school_class"
                        value={formData.school_class}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >

                        <option value="">
                            Select Class
                        </option>

                        {classes.map((schoolClass) => (
                            <option
                                key={schoolClass.id}
                                value={schoolClass.id}
                            >
                                {schoolClass.name}
                            </option>
                        ))}

                    </select>

                    {fieldErrors.school_class && (
                        <p className="text-red-500 text-sm mt-1">
                            {Array.isArray(
                                fieldErrors.school_class
                            )
                                ? fieldErrors.school_class[0]
                                : fieldErrors.school_class}
                        </p>
                    )}

                </div>

                {/* SUBJECT */}

                <div>

                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Subject
                    </label>

                    <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        disabled={!formData.school_class}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 disabled:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >

                        <option value="">
                            {formData.school_class
                                ? "Select Subject"
                                : "Select Class First"}
                        </option>

                        {filteredSubjects.map((subject) => (
                            <option
                                key={subject.id}
                                value={subject.id}
                            >
                                {subject.name}
                            </option>
                        ))}

                    </select>

                    {fieldErrors.subject && (
                        <p className="text-red-500 text-sm mt-1">
                            {Array.isArray(
                                fieldErrors.subject
                            )
                                ? fieldErrors.subject[0]
                                : fieldErrors.subject}
                        </p>
                    )}

                </div>

                {/* CHAPTER NUMBER */}

                <div>

                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Chapter Number
                    </label>

                    <input
                        type="number"
                        name="chapter_number"
                        value={formData.chapter_number}
                        onChange={handleChange}
                        min="1"
                        required
                        placeholder="Enter chapter number"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    {fieldErrors.chapter_number && (
                        <p className="text-red-500 text-sm mt-1">
                            {Array.isArray(
                                fieldErrors.chapter_number
                            )
                                ? fieldErrors.chapter_number[0]
                                : fieldErrors.chapter_number}
                        </p>
                    )}

                </div>

                {/* CHAPTER NAME */}

                <div>

                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Chapter Name
                    </label>

                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        maxLength="200"
                        required
                        placeholder="Enter chapter name"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    {fieldErrors.name && (
                        <p className="text-red-500 text-sm mt-1">
                            {Array.isArray(fieldErrors.name)
                                ? fieldErrors.name[0]
                                : fieldErrors.name}
                        </p>
                    )}

                </div>

                {/* BUTTONS */}

                <div className="flex justify-end gap-3 pt-4 border-t">

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                `/admin/study-material/chapters/${id}`
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
                            : "Update Chapter"}
                    </button>

                </div>

            </form>

        </div>
    );
}

export default ChapterEdit;