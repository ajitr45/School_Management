import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

function TeacherHomeworkDetail () {

    const { id } = useParams();
    const navigate = useNavigate();

    const [homework, setHomework] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deleting, setDeleting] = useState(false);


    // =====================================================
    // LOAD HOMEWORK
    // =====================================================

    const loadHomework = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await api.get(
                `homework/${id}/`
            );

            setHomework(response.data);

        } catch (error) {

            console.log(
                "HOMEWORK DETAIL ERROR:",
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
        loadHomework();
    }, [id]);


    // =====================================================
    // DELETE
    // =====================================================

    const handleDelete = async () => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this homework?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            setDeleting(true);
            setError("");

            await api.delete(
                `homework/${id}/`
            );

            navigate("/teacher/homework");

        } catch (error) {

            console.log(
                "DELETE HOMEWORK ERROR:",
                error.response?.data
            );

            setError(
                error.response?.data?.detail ||
                "Failed to delete homework."
            );

            setDeleting(false);
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

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                <div>

                    <h1 className="text-3xl font-bold text-gray-800">
                        Homework Details
                    </h1>

                    <p className="text-gray-500 mt-1">
                        View homework information
                    </p>

                </div>


                <button
                    type="button"
                    onClick={() =>
                        navigate("/teacher/homework")
                    }
                    className="px-5 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                    Back
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
                HOMEWORK
            ================================================= */}

            <div className="bg-white rounded-xl shadow overflow-hidden">

                {/* Title */}

                <div className="p-6 border-b">

                    <h2 className="text-2xl font-bold text-gray-800">
                        {homework.title}
                    </h2>

                </div>


                <div className="p-6 space-y-6">

                    {/* =================================================
                        CLASS INFORMATION
                    ================================================= */}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                        <div className="bg-gray-50 rounded-lg p-4">

                            <p className="text-sm text-gray-500">
                                Class
                            </p>

                            <p className="font-semibold text-gray-800 mt-1">
                                {homework.class_name ||
                                    homework.school_class ||
                                    "-"}
                            </p>

                        </div>


                        <div className="bg-gray-50 rounded-lg p-4">

                            <p className="text-sm text-gray-500">
                                Section
                            </p>

                            <p className="font-semibold text-gray-800 mt-1">
                                {homework.section_name ||
                                    homework.section ||
                                    "-"}
                            </p>

                        </div>


                        <div className="bg-gray-50 rounded-lg p-4">

                            <p className="text-sm text-gray-500">
                                Subject
                            </p>

                            <p className="font-semibold text-gray-800 mt-1">
                                {homework.subject_name ||
                                    homework.subject ||
                                    "-"}
                            </p>

                        </div>

                    </div>


                    {/* =================================================
                        DUE DATE
                    ================================================= */}

                    <div>

                        <p className="text-sm font-semibold text-gray-500">
                            Due Date
                        </p>

                        <p className="text-lg font-semibold text-gray-800 mt-1">
                            {homework.due_date}
                        </p>

                    </div>


                    {/* =================================================
                        DESCRIPTION
                    ================================================= */}

                    <div>

                        <p className="text-sm font-semibold text-gray-500 mb-2">
                            Description
                        </p>

                        <div className="bg-gray-50 rounded-lg p-5">

                            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                                {homework.description}
                            </p>

                        </div>

                    </div>


                    {/* =================================================
                        CREATED / UPDATED
                    ================================================= */}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">

                        <div>

                            <p className="text-gray-500">
                                Created
                            </p>

                            <p className="text-gray-700 mt-1">
                                {homework.created_at
                                    ? new Date(
                                        homework.created_at
                                    ).toLocaleString()
                                    : "-"}
                            </p>

                        </div>


                        <div>

                            <p className="text-gray-500">
                                Last Updated
                            </p>

                            <p className="text-gray-700 mt-1">
                                {homework.updated_at
                                    ? new Date(
                                        homework.updated_at
                                    ).toLocaleString()
                                    : "-"}
                            </p>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    ACTIONS
                ================================================= */}

                <div className="p-6 border-t flex justify-end gap-3">

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                `/teacher/homework/${id}/edit`
                            )
                        }
                        className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Edit
                    </button>


                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={deleting}
                        className="px-5 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                    >
                        {deleting
                            ? "Deleting..."
                            : "Delete"}
                    </button>

                </div>

            </div>

        </div>
    );
}

export default TeacherHomeworkDetail;