import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function NoticeCreate () {
    const navigate = useNavigate();

    const [classes, setClasses] = useState([]);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        audience: "ALL",
        school_class: "",
        expiry_date: "",
    });

    const [loading, setLoading] = useState(false);
    const [loadingClasses, setLoadingClasses] = useState(true);
    const [error, setError] = useState("");

    // Load classes
    useEffect(() => {
        const loadClasses = async () => {
            try {
                setLoadingClasses(true);

                const response = await api.get(
                    "academics/classes/"
                );

                setClasses(
                    Array.isArray(response.data)
                        ? response.data
                        : response.data.results || []
                );
            } catch (error) {
                console.log(
                    "CLASSES ERROR:",
                    error.response?.data
                );

                setError(
                    error.response?.data?.detail ||
                    "Failed to load classes."
                );
            } finally {
                setLoadingClasses(false);
            }
        };

        loadClasses();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        // CLASS audience ke alawa school class nahi chahiye
        if (name === "audience" && value !== "CLASS") {
            setFormData((previous) => ({
                ...previous,
                audience: value,
                school_class: "",
            }));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setLoading(true);
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

            await api.post("notices/", data);

            navigate("/admin/notices");

        } catch (error) {
            console.log(
                "CREATE NOTICE ERROR:",
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
                    "Failed to create notice."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">

            {/* Header */}

            <div>
                <h1 className="text-3xl font-bold text-gray-800">
                    Create Notice
                </h1>

                <p className="text-gray-500 mt-1">
                    Create a new school notice
                </p>
            </div>

            {/* Error */}

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {/* Form */}

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
                        placeholder="Enter notice title"
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
                        placeholder="Enter notice description"
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
                        <option value="ALL">
                            Everyone
                        </option>

                        <option value="STUDENT">
                            Students
                        </option>

                        <option value="TEACHER">
                            Teachers
                        </option>

                        <option value="CLASS">
                            Specific Class
                        </option>
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
                            disabled={loadingClasses}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">
                                {loadingClasses
                                    ? "Loading classes..."
                                    : "Select class"}
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

                    <p className="text-sm text-gray-500 mt-1">
                        Optional. Leave empty if the notice has no expiry date.
                    </p>
                </div>

                {/* Buttons */}

                <div className="flex justify-end gap-3 pt-4 border-t">

                    <button
                        type="button"
                        onClick={() => navigate("/admin/notices")}
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
                            ? "Creating..."
                            : "Create Notice"}
                    </button>

                </div>

            </form>

        </div>
    );
}

export default NoticeCreate;