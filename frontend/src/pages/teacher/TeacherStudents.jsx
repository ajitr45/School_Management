import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function TeacherStudents () {

    const navigate = useNavigate();

    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadStudents = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await api.get("students/");

            const data = Array.isArray(response.data)
                ? response.data
                : response.data.results || [];

            setStudents(data);

        } catch (error) {

            console.log(
                "TEACHER STUDENTS ERROR:",
                error.response?.data
            );

            setError(
                error.response?.data?.detail ||
                "Failed to load students."
            );

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        loadStudents();
    }, []);

    if (loading) {
        return (
            <div className="py-12 text-center text-gray-500">
                Loading students...
            </div>
        );
    }

    return (
        <div className="space-y-6">

            {/* Header */}

            <div>
                <h1 className="text-3xl font-bold text-gray-800">
                    Students
                </h1>

                <p className="text-gray-500 mt-1">
                    Students from your assigned classes
                </p>
            </div>

            {/* Error */}

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {/* Students */}

            <div className="bg-white rounded-xl shadow overflow-hidden">

                <div className="p-6 border-b">

                    <h2 className="text-xl font-bold text-gray-800">
                        My Students
                    </h2>

                    <p className="text-gray-500 mt-1">
                        {students.length} students
                    </p>

                </div>

                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead>

                            <tr className="bg-gray-50">

                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                    #
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                    Student ID
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                    Name
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                    Roll No.
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                    Class
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                    Section
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                    Action
                                </th>

                            </tr>

                        </thead>

                        <tbody className="divide-y">

                            {students.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="7"
                                        className="px-6 py-12 text-center text-gray-500"
                                    >
                                        No students found.
                                    </td>

                                </tr>

                            ) : (

                                students.map((student, index) => (

                                    <tr
                                        key={student.id}
                                        className="hover:bg-gray-50"
                                    >

                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {index + 1}
                                        </td>

                                        <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                                            {student.student_id}
                                        </td>

                                        <td className="px-6 py-4 text-sm text-gray-800">
                                            {student.student_name ||
                                                student.full_name ||
                                                student.name ||
                                                "-"}
                                        </td>

                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {student.roll_number}
                                        </td>

                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {student.school_class}
                                        </td>

                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {student.section}
                                        </td>

                                        <td className="px-6 py-4">

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    navigate(
                                                        `/teacher/students/${student.id}`
                                                    )
                                                }
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                            >
                                                View
                                            </button>

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

export default TeacherStudents;