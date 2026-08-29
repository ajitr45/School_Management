import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function HomeworkCreate () {
    const navigate = useNavigate();

    const [classes, setClasses] = useState([]);
    const [sections, setSections] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [teachers, setTeachers] = useState([]);

    const [formData, setFormData] = useState({
        school_class: "",
        section: "",
        subject: "",
        teacher: "",
        title: "",
        description: "",
        due_date: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});

    // =====================================================
    // LOAD DATA
    // =====================================================

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError("");

                const [
                    classResponse,
                    sectionResponse,
                    subjectResponse,
                    teacherResponse,
                ] = await Promise.all([
                    api.get("academics/classes/"),
                    api.get("academics/sections/"),
                    api.get("academics/subjects/"),
                    api.get("teachers/list/"),
                ]);

                setClasses(
                    Array.isArray(classResponse.data)
                        ? classResponse.data
                        : classResponse.data.results || []
                );

                setSections(
                    Array.isArray(sectionResponse.data)
                        ? sectionResponse.data
                        : sectionResponse.data.results || []
                );

                setSubjects(
                    Array.isArray(subjectResponse.data)
                        ? subjectResponse.data
                        : subjectResponse.data.results || []
                );

                setTeachers(
                    Array.isArray(teacherResponse.data)
                        ? teacherResponse.data
                        : teacherResponse.data.results || []
                );
            } catch (error) {
                console.log(error.response?.data);

                setError(
                    error.response?.data?.detail ||
                    "Failed to load required data."
                );
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    // =====================================================
    // INPUT CHANGE
    // =====================================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        setFieldErrors((previous) => ({
            ...previous,
            [name]: "",
        }));

        setError("");
    };

    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);
            setError("");
            setFieldErrors({});

            await api.post("homework/", formData);

            navigate("/admin/homework");
        } catch (error) {
            console.log(error.response?.data);

            const responseData = error.response?.data;

            if (responseData && typeof responseData === "object") {
                setFieldErrors(responseData);
            }

            setError(
                responseData?.detail ||
                "Failed to create homework."
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="py-12 text-center text-gray-500">
                Loading form...
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">

            {/* HEADER */}

            <div>
                <h1 className="text-3xl font-bold text-gray-800">
                    Add Homework
                </h1>

                <p className="text-gray-500 mt-1">
                    Create new homework for students
                </p>
            </div>

            {/* ERROR */}

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {/* FORM */}

            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-xl shadow p-6 space-y-6"
            >

                {/* CLASS + SECTION */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    <FormSelect
                        label="Class"
                        name="school_class"
                        value={formData.school_class}
                        onChange={handleChange}
                        options={classes}
                        error={fieldErrors.school_class}
                        placeholder="Select Class"
                        getLabel={(item) => item.name}
                    />

                    <FormSelect
                        label="Section"
                        name="section"
                        value={formData.section}
                        onChange={handleChange}
                        options={sections}
                        error={fieldErrors.section}
                        placeholder="Select Section"
                        getLabel={(item) => item.name}
                    />

                </div>

                {/* SUBJECT + TEACHER */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    <FormSelect
                        label="Subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        options={subjects}
                        error={fieldErrors.subject}
                        placeholder="Select Subject"
                        getLabel={(item) => item.name}
                    />

                    <FormSelect
                        label="Teacher"
                        name="teacher"
                        value={formData.teacher}
                        onChange={handleChange}
                        options={teachers}
                        error={fieldErrors.teacher}
                        placeholder="Select Teacher"
                        getLabel={(item) =>
                            item.full_name ||
                            item.name ||
                            `${item.first_name || ""} ${item.last_name || ""}`.trim()
                        }
                    />

                </div>

                {/* TITLE */}

                <FormInput
                    label="Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    error={fieldErrors.title}
                    placeholder="Enter homework title"
                />

                {/* DESCRIPTION */}

                <div>

                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                    </label>

                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="5"
                        placeholder="Enter homework description"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    {fieldErrors.description && (
                        <p className="text-sm text-red-600 mt-1">
                            {Array.isArray(fieldErrors.description)
                                ? fieldErrors.description[0]
                                : fieldErrors.description}
                        </p>
                    )}

                </div>

                {/* DUE DATE */}

                <FormInput
                    label="Due Date"
                    name="due_date"
                    type="date"
                    value={formData.due_date}
                    onChange={handleChange}
                    error={fieldErrors.due_date}
                />

                {/* BUTTONS */}

                <div className="flex justify-end gap-3 pt-4 border-t">

                    <button
                        type="button"
                        onClick={() => navigate("/admin/homework")}
                        className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={saving}
                        className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        {saving ? "Creating..." : "Create Homework"}
                    </button>

                </div>

            </form>

        </div>
    );
}


// =====================================================
// INPUT
// =====================================================

function FormInput ({
    label,
    name,
    type = "text",
    value,
    onChange,
    error,
    placeholder,
}) {
    return (
        <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>

            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {error && (
                <p className="text-sm text-red-600 mt-1">
                    {Array.isArray(error) ? error[0] : error}
                </p>
            )}

        </div>
    );
}


// =====================================================
// SELECT
// =====================================================

function FormSelect ({
    label,
    name,
    value,
    onChange,
    options,
    error,
    placeholder,
    getLabel,
}) {
    return (
        <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>

            <select
                name={name}
                value={value}
                onChange={onChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >

                <option value="">
                    {placeholder}
                </option>

                {options.map((item) => (
                    <option
                        key={item.id}
                        value={item.id}
                    >
                        {getLabel(item)}
                    </option>
                ))}

            </select>

            {error && (
                <p className="text-sm text-red-600 mt-1">
                    {Array.isArray(error) ? error[0] : error}
                </p>
            )}

        </div>
    );
}


export default HomeworkCreate;