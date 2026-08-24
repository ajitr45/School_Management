import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function StudentDetail() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const getStudent = async () => {

            try {

                const response = await api.get(`students/${id}/`);

                setStudent(response.data);

            } catch (error) {

                console.log(error.response?.data);

                setError("Failed to load student");

            } finally {

                setLoading(false);

            }
        };

        getStudent();

    }, [id]);


    if (loading) {
        return (
            <div className="p-6">
                <p className="text-gray-500">
                    Loading student...
                </p>
            </div>
        );
    }


    if (error) {
        return (
            <div className="p-6">
                <p className="text-red-600">
                    {error}
                </p>
            </div>
        );
    }


    return (
        <div className="space-y-6">

            {/* Header */}

            <div className="flex items-center justify-between">

                <div>

                    <h1 className="text-2xl font-bold text-gray-800">
                        Student Details
                    </h1>

                    <p className="text-gray-500 mt-1">
                        View student information
                    </p>

                </div>


                <button
                    onClick={() => navigate("/admin/students")}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                    Back
                </button>

            </div>


            {/* Basic Information */}

            <div className="bg-white rounded-xl shadow p-6">

                <h2 className="text-lg font-semibold text-gray-800 mb-5">
                    Basic Information
                </h2>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    <div>
                        <p className="text-sm text-gray-500">
                            Student ID
                        </p>

                        <p className="font-medium text-gray-800 mt-1">
                            {student.student_id}
                        </p>
                    </div>


                    <div>
                        <p className="text-sm text-gray-500">
                            Name
                        </p>

                        <p className="font-medium text-gray-800 mt-1">
                            {student.user?.first_name || "N/A"}{" "}
                            {student.user?.last_name || ""}
                        </p>
                    </div>


                    <div>
                        <p className="text-sm text-gray-500">
                            Email
                        </p>

                        <p className="font-medium text-gray-800 mt-1">
                            {student.user?.email || "N/A"}
                        </p>
                    </div>


                    <div>
                        <p className="text-sm text-gray-500">
                            Roll Number
                        </p>

                        <p className="font-medium text-gray-800 mt-1">
                            {student.roll_number}
                        </p>
                    </div>


                    <div>
                        <p className="text-sm text-gray-500">
                            Class
                        </p>

                        <p className="font-medium text-gray-800 mt-1">
                            {student.school_class?.name || "N/A"}
                        </p>
                    </div>


                    <div>
                        <p className="text-sm text-gray-500">
                            Section
                        </p>

                        <p className="font-medium text-gray-800 mt-1">
                            {student.section?.name || "N/A"}
                        </p>
                    </div>


                    <div>
                        <p className="text-sm text-gray-500">
                            Admission Date
                        </p>

                        <p className="font-medium text-gray-800 mt-1">
                            {student.admission_date}
                        </p>
                    </div>

                </div>

            </div>

        </div>
    );
}

export default StudentDetail;