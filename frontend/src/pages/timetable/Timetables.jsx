import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function Timetable () {
    const navigate = useNavigate();

    const [timetables, setTimetables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadTimetables = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("timetable/");

            setTimetables(
                Array.isArray(response.data)
                    ? response.data
                    : response.data.results || []
            );
        } catch (error) {
            console.log(error.response?.data);

            setError(
                error.response?.data?.detail ||
                "Failed to load timetable."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTimetables();
    }, []);

    // =====================================================
    // DELETE
    // =====================================================

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this timetable?"
        );

        if (!confirmed) return;

        try {
            await api.delete(`timetable/${id}/`);

            setTimetables((previous) =>
                previous.filter((item) => item.id !== id)
            );
        } catch (error) {
            console.log(error.response?.data);

            setError(
                error.response?.data?.detail ||
                "Failed to delete timetable."
            );
        }
    };

    if (loading) {
        return (
            <div className="py-12 text-center text-gray-500">
                Loading timetable...
            </div>
        );
    }

    return (
        <div className="space-y-6">

            {/* HEADER */}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        Timetable
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Manage school timetable
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => navigate("/admin/timetable/create")}
                    className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    + Add Timetable
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
                        Timetable List
                    </h2>

                    <p className="text-gray-500 mt-1">
                        {timetables.length} timetable entries
                    </p>

                </div>

                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead className="bg-gray-50">

                            <tr>

                                <Th>#</Th>
                                <Th>Class</Th>
                                <Th>Section</Th>
                                <Th>Subject</Th>
                                <Th>Teacher</Th>
                                <Th>Day</Th>
                                <Th>Period</Th>
                                <Th>Time</Th>
                                <Th>Actions</Th>

                            </tr>

                        </thead>

                        <tbody className="divide-y">

                            {timetables.length === 0 ? (

                                <tr>
                                    <td
                                        colSpan="9"
                                        className="px-6 py-16 text-center text-gray-500"
                                    >
                                        No timetable found.
                                    </td>
                                </tr>

                            ) : (

                                timetables.map((item, index) => (

                                    <tr
                                        key={item.id}
                                        className="hover:bg-gray-50"
                                    >

                                        <Td>
                                            {index + 1}
                                        </Td>

                                        <Td>
                                            {item.class_name ||
                                                item.school_class ||
                                                "-"}
                                        </Td>

                                        <Td>
                                            {item.section_name ||
                                                item.section ||
                                                "-"}
                                        </Td>

                                        <Td>
                                            <span className="font-medium text-gray-800">
                                                {item.subject_name ||
                                                    item.subject ||
                                                    "-"}
                                            </span>
                                        </Td>

                                        <Td>
                                            {item.teacher_name ||
                                                item.teacher ||
                                                "-"}
                                        </Td>

                                        <Td>
                                            {formatDay(item.day)}
                                        </Td>

                                        <Td>
                                            {item.period}
                                        </Td>

                                        <Td>
                                            {formatTime(item.start_time)}
                                            {" - "}
                                            {formatTime(item.end_time)}
                                        </Td>

                                        <Td>

                                            <div className="flex items-center gap-2">

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        navigate(
                                                            `/admin/timetable/${item.id}`
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
                                                            `/admin/timetable/${item.id}/edit`
                                                        )
                                                    }
                                                    className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDelete(item.id)
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


// =====================================================
// FORMAT DAY
// =====================================================

function formatDay (day) {
    if (!day) return "-";

    return day.charAt(0) + day.slice(1).toLowerCase();
}


// =====================================================
// FORMAT TIME
// =====================================================

function formatTime (time) {
    if (!time) return "-";

    return time.slice(0, 5);
}


export default Timetable;