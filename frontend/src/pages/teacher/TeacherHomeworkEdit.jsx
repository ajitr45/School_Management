import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

function TeacherHomeworkEdit () {

    const { id } = useParams();
    const navigate = useNavigate();

    const [assignments, setAssignments] = useState([]);
    const [homework, setHomework] = useState(null);

    const [selectedAssignment, setSelectedAssignment] = useState("");

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        due_date: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");


    // =====================================================
    // LOAD DATA
    // =====================================================

    const loadData = async () => {

        try {

            setLoading(true);
            setError("");

            const [homeworkResponse, assignmentsResponse] =
                await Promise.all([
                    api.get(`homework/${id}/`),
                    api.get("teachers/assign/"),
                ]);

            const homeworkData = homeworkResponse.data;

            const assignmentsData = Array.isArray(
                assignmentsResponse.data
            )
                ? assignmentsResponse.data
                : assignmentsResponse.data.results || [];

            setHomework(homeworkData);
            setAssignments(assignmentsData);

            setFormData({
                title: homeworkData.title || "",
                description: homeworkData.description || "",
                due_date: homeworkData.due_date || "",
            });


            // Find current assignment
            const currentAssignment = assignmentsData.find(
                (assignment) =>
                    String(assignment.school_class) ===
                    String(homeworkData.school_class) &&
                    String(assignment.section) ===
                    String(homeworkData.section) &&
                    String(assignment.subject) ===
                    String(homeworkData.subject)
            );

            if (currentAssignment) {

                setSelectedAssignment(
                    String(currentAssignment.id)
                );

            }

        } catch (error) {

            console.log(
                "HOMEWORK EDIT LOAD ERROR:",
                error.response?.data
            );

            setError(
                error.response?.data?.detail ||
                "Failed to load homework."
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {
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

    };


    // =====================================================
    // UPDATE HOMEWORK
    // =====================================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");

        if (!selectedAssignment) {

            setError(
                "Please select class, section and subject."
            );

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

            await api.patch(
                `homework/${id}/`,
                {
                    school_class: selected.school_class,
                    section: selected.section,
                    subject: selected.subject,
                    title: formData.title,
                    description: formData.description,
                    due_date: formData.due_date,
                }
            );

            navigate(`/teacher/homework/${id}`);

        } catch (error) {

            console.log(
                "UPDATE HOMEWORK ERROR:",
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
                "Failed to update homework."
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
                Loading homework...
            </div>
        );

    }


    // =====================================================
    // ERROR / NOT FOUND
    // =====================================================

    if (!homework) {

        return (
            <div className="space-y-6">

                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                    {error || "Homework not found."}
                </div>

                <button
                    type="button"
                    onClick={() =>
                        navigate("/teacher/homework")
                    }
                    className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Back to Homework
                </button>

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
                    Edit Homework
                </h1>

                <p className="text-gray-500 mt-1">
                    Update your homework
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
                FORM
            ================================================= */}

            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-xl shadow p-6 space-y-6"
            >

                {/* Assignment */}

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
                                Class {assignment.school_class}
                                {" - "}
                                Section {assignment.section}
                                {" - "}
                                Subject {assignment.subject}
                            </option>

                        ))}

                    </select>

                </div>


                {/* Title */}

                <div>

                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Homework Title
                    </label>

                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-3"
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
                        rows="6"
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 resize-none"
                    />

                </div>


                {/* Due Date */}

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
                        className="w-full border border-gray-300 rounded-lg px-4 py-3"
                    />

                </div>


                {/* Buttons */}

                <div className="flex justify-end gap-3 pt-4 border-t">

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                `/teacher/homework/${id}`
                            )
                        }
                        disabled={saving}
                        className="px-5 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
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
                            : "Update Homework"}
                    </button>

                </div>

            </form>

        </div>
    );
}

export default TeacherHomeworkEdit;