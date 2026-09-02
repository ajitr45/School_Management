import { useEffect, useState } from "react";
import api from "../../services/api";

function StudentDashboard () {
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadStudent = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("students/");
            const data = Array.isArray(response.data)
                ? response.data
                : response.data.results || [];

            setStudent(data[0] || null);
        } catch (error) {
            console.log(
                "STUDENT DASHBOARD ERROR:",
                error.response?.data
            );

            setError(
                error.response?.data?.detail ||
                "Failed to load student data."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStudent();
    }, []);

    if (loading) {
        return (
            <div className="py-12 text-center text-gray-500">
                Loading dashboard...
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {error}
            </div>
        );
    }

    if (!student) {
        return (
            <div className="py-12 text-center text-gray-500">
                Student information not found.
            </div>
        );
    }

    const studentName =
        student.admission?.student_name ||
        student.user?.first_name ||
        student.user?.username ||
        "-";

    return (
        <div className="space-y-6">

            <div>
                <h1 className="text-3xl font-bold text-gray-800">
                    Student Dashboard
                </h1>

                <p className="text-gray-500 mt-1">
                    Welcome, {studentName}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                <div className="bg-white rounded-xl shadow p-6">
                    <p className="text-sm text-gray-500">
                        Student ID
                    </p>

                    <h2 className="text-xl font-bold text-gray-800 mt-2">
                        {student.student_id}
                    </h2>
                </div>

                <div className="bg-white rounded-xl shadow p-6">
                    <p className="text-sm text-gray-500">
                        Class
                    </p>

                    <h2 className="text-xl font-bold text-gray-800 mt-2">
                        {student.school_class_detail?.name || "-"}
                    </h2>
                </div>

                <div className="bg-white rounded-xl shadow p-6">
                    <p className="text-sm text-gray-500">
                        Section
                    </p>

                    <h2 className="text-xl font-bold text-gray-800 mt-2">
                        {student.section_detail?.name || "-"}
                    </h2>
                </div>

                <div className="bg-white rounded-xl shadow p-6">
                    <p className="text-sm text-gray-500">
                        Roll Number
                    </p>

                    <h2 className="text-xl font-bold text-gray-800 mt-2">
                        {student.roll_number}
                    </h2>
                </div>

            </div>

            <div className="bg-white rounded-xl shadow">

                <div className="p-6 border-b">
                    <h2 className="text-xl font-bold text-gray-800">
                        My Information
                    </h2>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div>
                        <p className="text-sm text-gray-500">
                            Name
                        </p>

                        <p className="font-semibold text-gray-800 mt-1">
                            {studentName}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Username
                        </p>

                        <p className="font-semibold text-gray-800 mt-1">
                            {student.user?.username || "-"}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Email
                        </p>

                        <p className="font-semibold text-gray-800 mt-1">
                            {student.user?.email || "-"}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Admission Date
                        </p>

                        <p className="font-semibold text-gray-800 mt-1">
                            {student.admission_date || "-"}
                        </p>
                    </div>

                </div>

            </div>

        </div>
    );
}

export default StudentDashboard;