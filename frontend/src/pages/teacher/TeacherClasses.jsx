import { useEffect, useState } from "react";
import api from "../../services/api";

function TeacherClasses () {

    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadAssignments = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("teachers/assign/");

            setAssignments(
                Array.isArray(response.data)
                    ? response.data
                    : response.data.results || []
            );

        } catch (error) {

            console.log(
                "TEACHER ASSIGNMENTS ERROR:",
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

    if (loading) {
        return (
            <div className="py-12 text-center text-gray-500">
                Loading classes...
            </div>
        );
    }

    return (
        <div className="space-y-6">

            {/* Header */}

            <div>
                <h1 className="text-3xl font-bold text-gray-800">
                    My Classes
                </h1>

                <p className="text-gray-500 mt-1">
                    Classes, sections and subjects assigned to you
                </p>
            </div>


            {/* Error */}

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}


            {/* Main Card */}

            <div className="bg-white rounded-xl shadow overflow-hidden">

                {/* Card Header */}

                <div className="p-6">

                    <h2 className="text-xl font-bold text-gray-800">
                        My Assignments
                    </h2>

                    <p className="text-gray-500 mt-1">
                        {assignments.length} assignments
                    </p>

                </div>


                {/* Table */}

                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead>

                            <tr className="bg-gray-50">

                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                    #
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

                            </tr>

                        </thead>


                        <tbody className="divide-y">

                            {assignments.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="4"
                                        className="px-6 py-16 text-center text-gray-500"
                                    >
                                        No classes assigned.
                                    </td>

                                </tr>

                            ) : (

                                assignments.map((assignment, index) => (

                                    <tr
                                        key={assignment.id}
                                        className="hover:bg-gray-50"
                                    >

                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {index + 1}
                                        </td>

                                        <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                                            {assignment.class_name}
                                        </td>

                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {assignment.section_name}
                                        </td>

                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {assignment.subject_name}
                                        </td>

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

export default TeacherClasses;