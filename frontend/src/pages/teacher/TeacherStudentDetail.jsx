import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

function TeacherStudentDetail () {

    const { id } = useParams();
    const navigate = useNavigate();

    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadStudent = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await api.get(
                `students/${id}/`
            );

            setStudent(response.data);

        } catch (error) {

            console.log(
                "STUDENT DETAIL ERROR:",
                error.response?.data
            );

            setError(
                error.response?.data?.detail ||
                "Failed to load student."
            );

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        loadStudent();
    }, [id]);

    if (loading) {
        return (
            <div className="py-12 text-center text-gray-500">
                Loading student...
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-4">

                <button
                    type="button"
                    onClick={() => navigate("/teacher/students")}
                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                    ← Back
                </button>

                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                    {error}
                </div>

            </div>
        );
    }

    if (!student) {
        return null;
    }

    return (
        <div className="space-y-6">

            {/* Header */}

            <div className="flex items-center justify-between">

                <div>

                    <h1 className="text-3xl font-bold text-gray-800">
                        Student Details
                    </h1>

                    <p className="text-gray-500 mt-1">
                        View student information
                    </p>

                </div>

                <button
                    type="button"
                    onClick={() => navigate("/teacher/students")}
                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                    ← Back
                </button>

            </div>


            {/* Student Information */}

            <div className="bg-white rounded-xl shadow p-6">

                <h2 className="text-xl font-bold text-gray-800 mb-6">
                    Basic Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div>
                        <p className="text-sm text-gray-500">
                            Student ID
                        </p>

                        <p className="mt-1 font-semibold text-gray-800">
                            {student.student_id || "-"}
                        </p>
                    </div>


                    <div>
                        <p className="text-sm text-gray-500">
                            Name
                        </p>

                        <p className="mt-1 font-semibold text-gray-800">
                            {student.student_name ||
                                student.full_name ||
                                student.name ||
                                "-"}
                        </p>
                    </div>


                    <div>
                        <p className="text-sm text-gray-500">
                            Roll Number
                        </p>

                        <p className="mt-1 font-semibold text-gray-800">
                            {student.roll_number || "-"}
                        </p>
                    </div>


                    <div>
                        <p className="text-sm text-gray-500">
                            Class
                        </p>

                        <p className="mt-1 font-semibold text-gray-800">
                            {student.school_class || "-"}
                        </p>
                    </div>


                    <div>
                        <p className="text-sm text-gray-500">
                            Section
                        </p>

                        <p className="mt-1 font-semibold text-gray-800">
                            {student.section || "-"}
                        </p>
                    </div>


                    <div>
                        <p className="text-sm text-gray-500">
                            Admission Date
                        </p>

                        <p className="mt-1 font-semibold text-gray-800">
                            {student.admission_date || "-"}
                        </p>
                    </div>

                </div>

            </div>

        </div>
    );
}

export default TeacherStudentDetail;