import { useEffect, useState } from "react";
import api from "../../services/api";

function StudentProfile() {
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadProfile = async () => {
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
                "STUDENT PROFILE ERROR:",
                error.response?.data
            );

            setError(
                error.response?.data?.detail ||
                "Failed to load profile."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProfile();
    }, []);

    if (loading) {
        return (
            <div className="py-12 text-center text-gray-500">
                Loading profile...
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
                Student profile not found.
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
                    My Profile
                </h1>

                <p className="text-gray-500 mt-1">
                    View your personal and academic information
                </p>
            </div>

            <div className="bg-white rounded-xl shadow">
                <div className="p-6 border-b">
                    <h2 className="text-xl font-bold text-gray-800">
                        Personal Information
                    </h2>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="font-semibold text-gray-800 mt-1">
                            {studentName}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Student ID</p>
                        <p className="font-semibold text-gray-800 mt-1">
                            {student.student_id || "-"}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Username</p>
                        <p className="font-semibold text-gray-800 mt-1">
                            {student.user?.username || "-"}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-semibold text-gray-800 mt-1">
                            {student.user?.email || "-"}
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow">
                <div className="p-6 border-b">
                    <h2 className="text-xl font-bold text-gray-800">
                        Academic Information
                    </h2>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <p className="text-sm text-gray-500">Class</p>
                        <p className="font-semibold text-gray-800 mt-1">
                            {student.school_class_detail?.name || "-"}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Section</p>
                        <p className="font-semibold text-gray-800 mt-1">
                            {student.section_detail?.name || "-"}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Roll Number</p>
                        <p className="font-semibold text-gray-800 mt-1">
                            {student.roll_number || "-"}
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

export default StudentProfile;