import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

function NoticeEdit () {
    const { id } = useParams();
    const navigate = useNavigate();

    const [classes, setClasses] = useState([]);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        audience: "ALL",
        school_class: "",
        expiry_date: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError("");

                const [noticeResponse, classesResponse] =
                    await Promise.all([
                        api.get(`notices/${id}/`),
                        api.get("academics/classes/"),
                    ]);

                const notice = noticeResponse.data;

                setFormData({
                    title: notice.title || "",
                    description: notice.description || "",
                    audience: notice.audience || "ALL",
                    school_class: notice.school_class || "",
                    expiry_date: notice.expiry_date || "",
                });

                setClasses(
                    Array.isArray(classesResponse.data)
                        ? classesResponse.data
                        : classesResponse.data.results || []
                );

            } catch (error) {
                console.log(
                    "NOTICE EDIT LOAD ERROR:",
                    error.response?.data
                );

                setError(
                    error.response?.data?.detail ||
                    "Failed to load notice."
                );
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
            ...(name === "audience" && value !== "CLASS"
                ? { school_class: "" }
                : {}),
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setSaving(true);
            setError("");

            const data = {
                title: formData.title,
                description: formData.description,
                audience: formData.audience,
                school_class:
                    formData.audience === "CLASS"
                        ? formData.school_class
                        : null,
                expiry_date:
                    formData.expiry_date || null,
            };

            await api.patch(`notices/${id}/`, data);

            navigate(`/admin/notices/${id}`);

        } catch (error) {
            console.log(
                "UPDATE NOTICE ERROR:",
                error.response?.data
            );

            const responseData = error.response?.data;

            if (typeof responseData === "object") {
                setError(
                    Object.values(responseData)
                        .flat()
                        .join(" ")
                );
            } else {
                setError(
                    responseData?.detail ||
                    "Failed to update notice."
                );
            }
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="py-16 text-center text-gray-500">
                Loading notice...
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">

            <div>
                <h1 className="text-3xl font-bold text-gray-800">
                    Edit Notice
                </h1>

                <p className="text-gray-500 mt-1">
                    Update notice information
                </p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-xl shadow p-6 space-y-6"
            >

                {/* Title */}

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Title
                    </label>

                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        maxLength={200}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Description */}

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Description
                    </label>

                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows="6"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Audience */}

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Audience
                    </label>

                    <select
                        name="audience"
                        value={formData.audience}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="ALL">Everyone</option>
                        <option value="STUDENT">Students</option>
                        <option value="TEACHER">Teachers</option>
                        <option value="CLASS">Specific Class</option>
                    </select>
                </div>

                {/* Class */}

                {formData.audience === "CLASS" && (
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            School Class
                        </label>

                        <select
                            name="school_class"
                            value={formData.school_class}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">
                                Select class
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
                    </div>
                )}

                {/* Expiry Date */}

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Expiry Date
                    </label>

                    <input
                        type="date"
                        name="expiry_date"
                        value={formData.expiry_date}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Buttons */}

                <div className="flex justify-end gap-3 pt-4 border-t">

                    <button
                        type="button"
                        onClick={() =>
                            navigate(`/admin/notices/${id}`)
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
                        {saving ? "Saving..." : "Save Changes"}
                    </button>

                </div>

            </form>

        </div>
    );
}

export default NoticeEdit;