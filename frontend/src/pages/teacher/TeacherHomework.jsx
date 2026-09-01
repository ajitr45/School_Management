import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function TeacherHomework () {

    const navigate = useNavigate();

    const [homeworks, setHomeworks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =====================================================
    // LOAD HOMEWORK
    // =====================================================

    const loadHomeworks = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await api.get("homework/");

            const data = Array.isArray(response.data)
                ? response.data
                : response.data.results || [];

            setHomeworks(data);

        } catch (error) {

            console.log(
                "TEACHER HOMEWORK ERROR:",
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
        loadHomeworks();
    }, []);


    // =====================================================
    // DELETE HOMEWORK
    // =====================================================

    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this homework?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            await api.delete(`homework/${id}/`);

            setHomeworks((previous) =>
                previous.filter(
                    (homework) => homework.id !== id
                )
            );

        } catch (error) {

            console.log(
                "DELETE HOMEWORK ERROR:",
                error.response?.data
            );

            setError(
                error.response?.data?.detail ||
                "Failed to delete homework."
            );

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


    return (
        <div className="space-y-6">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                <div>

                    <h1 className="text-3xl font-bold text-gray-800">
                        Homework
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Manage homework for your assigned classes
                    </p>

                </div>


                <button
                    type="button"
                    onClick={() =>
                        navigate("/teacher/homework/create")
                    }
                    className="px-5 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                >
                    + Create Homework
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
                HOMEWORK CARD
            ================================================= */}

            <div className="bg-white rounded-xl shadow overflow-hidden">

                <div className="p-6 border-b">

                    <h2 className="text-xl font-bold text-gray-800">
                        My Homework
                    </h2>

                    <p className="text-gray-500 mt-1">
                        {homeworks.length} homework
                        {homeworks.length !== 1 ? "s" : ""}
                    </p>

                </div>


                {/* =================================================
                    EMPTY
                ================================================= */}

                {homeworks.length === 0 ? (

                    <div className="py-16 text-center">

                        <p className="text-gray-500">
                            No homework created yet.
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/teacher/homework/create")
                            }
                            className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Create Homework
                        </button>

                    </div>

                ) : (

                    /* =================================================
                       TABLE
                    ================================================= */

                    <div className="overflow-x-auto">

                        <table className="w-full">

                            <thead>

                                <tr className="bg-gray-50">

                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                        #
                                    </th>

                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                        Title
                                    </th>

                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                        Class
                                    </th>

                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                        Section
                                    </th>

                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                        Subject
                                    </th>

                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                        Due Date
                                    </th>

                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                        Actions
                                    </th>

                                </tr>

                            </thead>


                            <tbody className="divide-y">

                                {homeworks.map(
                                    (homework, index) => (

                                        <tr
                                            key={homework.id}
                                            className="hover:bg-gray-50"
                                        >

                                            {/* Number */}

                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {index + 1}
                                            </td>


                                            {/* Title */}

                                            <td className="px-6 py-4">

                                                <div className="font-semibold text-gray-800">
                                                    {homework.title}
                                                </div>

                                                <div className="text-sm text-gray-500 mt-1 max-w-xs truncate">
                                                    {homework.description}
                                                </div>

                                            </td>


                                            {/* Class */}

                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                {homework.class_name ||
                                                    homework.school_class ||
                                                    "-"}
                                            </td>


                                            {/* Section */}

                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                {homework.section_name ||
                                                    homework.section ||
                                                    "-"}
                                            </td>


                                            {/* Subject */}

                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                {homework.subject_name ||
                                                    homework.subject ||
                                                    "-"}
                                            </td>


                                            {/* Due Date */}

                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                {homework.due_date}
                                            </td>


                                            {/* Actions */}

                                            <td className="px-6 py-4">

                                                <div className="flex gap-2">

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            navigate(
                                                                `/teacher/homework/${homework.id}`
                                                            )
                                                        }
                                                        className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                                                    >
                                                        View
                                                    </button>


                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            navigate(
                                                                `/teacher/homework/${homework.id}/edit`
                                                            )
                                                        }
                                                        className="px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                                                    >
                                                        Edit
                                                    </button>


                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDelete(
                                                                homework.id
                                                            )
                                                        }
                                                        className="px-3 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
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

        </div>
    );
}

export default TeacherHomework;