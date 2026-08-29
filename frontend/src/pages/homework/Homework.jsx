import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function Homework () {
    const navigate = useNavigate();

    const [homeworks, setHomeworks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadHomeworks = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("homework/");

            setHomeworks(
                Array.isArray(response.data)
                    ? response.data
                    : response.data.results || []
            );
        } catch (error) {
            console.log(error.response?.data);

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
    // DELETE
    // =====================================================

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this homework?"
        );

        if (!confirmed) return;

        try {
            await api.delete(`homework/${id}/`);

            setHomeworks((previous) =>
                previous.filter((homework) => homework.id !== id)
            );
        } catch (error) {
            console.log(error.response?.data);

            setError(
                error.response?.data?.detail ||
                "Failed to delete homework."
            );
        }
    };

    if (loading) {
        return (
            <div className="py-12 text-center text-gray-500">
                Loading homework...
            </div>
        );
    }

    return (
        <div className="space-y-6">

            {/* HEADER */}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        Homework
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Manage student homework
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() =>
                        navigate("/admin/homework/create")
                    }
                    className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    + Add Homework
                </button>

            </div>

            {/* ERROR */}

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {/* TABLE */}

            <div className="bg-white rounded-xl shadow overflow-hidden">

                <div className="p-6 border-b">

                    <h2 className="text-xl font-semibold text-gray-800">
                        Homework List
                    </h2>

                    <p className="text-gray-500 mt-1">
                        {homeworks.length} homework entries
                    </p>

                </div>

                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead className="bg-gray-50">

                            <tr>

                                <Th>#</Th>
                                <Th>Title</Th>
                                <Th>Class</Th>
                                <Th>Section</Th>
                                <Th>Subject</Th>
                                <Th>Teacher</Th>
                                <Th>Due Date</Th>
                                <Th>Actions</Th>

                            </tr>

                        </thead>

                        <tbody className="divide-y">

                            {homeworks.length === 0 ? (

                                <tr>
                                    <td
                                        colSpan="8"
                                        className="px-6 py-16 text-center text-gray-500"
                                    >
                                        No homework found.
                                    </td>
                                </tr>

                            ) : (

                                homeworks.map((homework, index) => (

                                    <tr
                                        key={homework.id}
                                        className="hover:bg-gray-50"
                                    >

                                        <Td>
                                            {index + 1}
                                        </Td>

                                        <Td>
                                            <span className="font-semibold text-gray-800">
                                                {homework.title}
                                            </span>
                                        </Td>

                                        <Td>
                                            {homework.class_name ||
                                                homework.school_class ||
                                                "-"}
                                        </Td>

                                        <Td>
                                            {homework.section_name ||
                                                homework.section ||
                                                "-"}
                                        </Td>

                                        <Td>
                                            {homework.subject_name ||
                                                homework.subject ||
                                                "-"}
                                        </Td>

                                        <Td>
                                            {homework.teacher_name ||
                                                homework.teacher ||
                                                "-"}
                                        </Td>

                                        <Td>
                                            {homework.due_date || "-"}
                                        </Td>

                                        <Td>

                                            <div className="flex items-center gap-2">

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        navigate(
                                                            `/admin/homework/${homework.id}`
                                                        )
                                                    }
                                                    className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                                                >
                                                    View
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        navigate(
                                                            `/admin/homework/${homework.id}/edit`
                                                        )
                                                    }
                                                    className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
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
                                                    className="px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                                                >
                                                    Delete
                                                </button>

                                            </div>

                                        </Td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
}


// =====================================================
// TABLE HEADER
// =====================================================

function Th ({ children }) {
    return (
        <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700 whitespace-nowrap">
            {children}
        </th>
    );
}


// =====================================================
// TABLE DATA
// =====================================================

function Td ({ children }) {
    return (
        <td className="px-4 py-4 text-sm text-gray-600 whitespace-nowrap">
            {children}
        </td>
    );
}


export default Homework;