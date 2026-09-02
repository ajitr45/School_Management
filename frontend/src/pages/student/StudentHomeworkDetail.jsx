import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

function StudentHomeworkDetail () {
    const { id } = useParams();
    const navigate = useNavigate();

    const [homework, setHomework] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadHomework = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(`homework/${id}/`);
            setHomework(response.data);
        } catch (error) {
            console.log(
                "STUDENT HOMEWORK DETAIL ERROR:",
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

    if (loading) {
        return (
            <div className="py-12 text-center text-gray-500">
                Loading homework...
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-4">
                <button
                    onClick={() => navigate("/student/homework")}
                    className="text-blue-600 hover:underline"
                >
                    ← Back to Homework
                </button>

                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                    {error}
                </div>
            </div>
        );
    }

    if (!homework) {
        return (
            <div className="py-12 text-center text-gray-500">
                Homework not found.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <button
                onClick={() => navigate("/student/homework")}
                className="text-blue-600 hover:underline"
            >
                ← Back to Homework
            </button>

            <div>
                <h1 className="text-3xl font-bold text-gray-800">
                    Homework Details
                </h1>
                <p className="text-gray-500 mt-1">
                    View your assigned homework
                </p>
            </div>

            <div className="bg-white rounded-xl shadow">
                <div className="p-6 border-b">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {homework.title}
                    </h2>
                </div>

                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-sm text-gray-500">Subject</p>
                            <p className="font-semibold text-gray-800 mt-1">
                                {homework.subject_name || "-"}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Teacher</p>
                            <p className="font-semibold text-gray-800 mt-1">
                                {homework.teacher_name || "-"}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Class</p>
                            <p className="font-semibold text-gray-800 mt-1">
                                {homework.class_name || "-"}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Section</p>
                            <p className="font-semibold text-gray-800 mt-1">
                                {homework.section_name || "-"}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Due Date</p>
                            <p className="font-semibold text-red-600 mt-1">
                                {homework.due_date || "-"}
                            </p>
                        </div>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500 mb-2">
                            Description
                        </p>

                        <div className="bg-gray-50 rounded-lg p-4 text-gray-700 whitespace-pre-wrap">
                            {homework.description || "No description provided."}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StudentHomeworkDetail;