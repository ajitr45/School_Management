import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function TeacherHomeworkCreate () {

    const navigate = useNavigate();

    const [assignments, setAssignments] = useState([]);

    const [selectedAssignment, setSelectedAssignment] = useState("");

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        due_date: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    // =====================================================
    // LOAD TEACHER ASSIGNMENTS
    // =====================================================

    const loadAssignments = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await api.get("teachers/assign/");

            const data = Array.isArray(response.data)
                ? response.data
                : response.data.results || [];

            setAssignments(data);

        } catch (error) {

            console.log(
                "ASSIGNMENTS ERROR:",
                error.response?.data
            );

            setError(
                error.response?.data?.detail ||
                "Failed to load assignments."
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {
        loadAssignments();
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

    };


    // =====================================================
    // CREATE HOMEWORK
    // =====================================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");

        if (!selectedAssignment) {

            setError("Please select class, section and subject.");

            return;
        }


        const selected = assignments.find(
            (assignment) =>
                String(assignment.id) ===
                String(selectedAssignment)
        );


        if (!selected) {

            setError("Invalid assignment selected.");

            return;
        }


        try {

            setSaving(true);

            await api.post("homework/", {

                school_class: selected.school_class,

                section: selected.section,

                subject: selected.subject,

                title: formData.title,

                description: formData.description,

                due_date: formData.due_date,

            });


            setSuccess(
                "Homework created successfully."
            );


            setTimeout(() => {

                navigate("/teacher/homework");

            }, 800);

        } catch (error) {

            console.log(
                "CREATE HOMEWORK ERROR:",
                error.response?.data
            );

            const data = error.response?.data;

            setError(
                data?.detail ||
                data?.school_class?.[0] ||
                data?.section?.[0] ||
                data?.subject?.[0] ||
                data?.title?.[0] ||
                data?.description?.[0] ||
                data?.due_date?.[0] ||
                "Failed to create homework."
            );

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
                Loading assignments...
            </div>
        );

    }


    return (
        <div className="max-w-4xl mx-auto space-y-6">

            {/* =================================================
                HEADER
            ================================================= */}

            <div>

                <h1 className="text-3xl font-bold text-gray-800">
                    Create Homework
                </h1>

                <p className="text-gray-500 mt-1">
                    Create homework for your assigned class
                </p>

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
                SUCCESS
            ================================================= */}

            {success && (

                <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
                    {success}
                </div>

            )}


            {/* =================================================
                FORM
            ================================================= */}

            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-xl shadow p-6 space-y-6"
            >

                {/* =================================================
                    ASSIGNMENT
                ================================================= */}

                <div>

                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Class / Section / Subject
                    </label>

                    <select
                        value={selectedAssignment}
                        onChange={(event) =>
                            setSelectedAssignment(
                                event.target.value
                            )
                        }
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >

                        <option value="">
                            Select assignment
                        </option>

                        {assignments.map((assignment) => (

                            <option
                                key={assignment.id}
                                value={assignment.id}
                            >
                                Class {assignment.school_class}
                                {" - "}
                                Section {assignment.section}
                                {" - "}
                                Subject {assignment.subject}
                            </option>

                        ))}

                    </select>

                </div>


                {/* =================================================
                    TITLE
                ================================================= */}

                <div>

                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Homework Title
                    </label>

                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Enter homework title"
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                </div>


                {/* =================================================
                    DESCRIPTION
                ================================================= */}

                <div>

                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Description
                    </label>

                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Enter homework details..."
                        rows="6"
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                </div>


                {/* =================================================
                    DUE DATE
                ================================================= */}

                <div>

                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Due Date
                    </label>

                    <input
                        type="date"
                        name="due_date"
                        value={formData.due_date}
                        onChange={handleChange}
                        min={
                            new Date()
                                .toISOString()
                                .split("T")[0]
                        }
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                </div>


                {/* =================================================
                    BUTTONS
                ================================================= */}

                <div className="flex justify-end gap-3 pt-4 border-t">

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/teacher/homework")
                        }
                        disabled={saving}
                        className="px-5 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                    >
                        Cancel
                    </button>


                    <button
                        type="submit"
                        disabled={saving || assignments.length === 0}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
                    >
                        {saving
                            ? "Creating..."
                            : "Create Homework"}
                    </button>

                </div>

            </form>

        </div>
    );
}

export default TeacherHomeworkCreate;