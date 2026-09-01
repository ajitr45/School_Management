import { useEffect, useState } from "react";
import api from "../../services/api";

function TeacherExams () {

    const [exams, setExams] = useState([]);
    const [examSubjects, setExamSubjects] = useState([]);

    const [selectedExam, setSelectedExam] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadExams = async () => {

        try {

            setLoading(true);
            setError("");

            const [examResponse, subjectResponse] = await Promise.all([
                api.get("exams/"),
                api.get("exam-subjects/"),
            ]);

            const examData = Array.isArray(examResponse.data)
                ? examResponse.data
                : examResponse.data.results || [];

            const subjectData = Array.isArray(subjectResponse.data)
                ? subjectResponse.data
                : subjectResponse.data.results || [];

            setExams(examData);
            setExamSubjects(subjectData);

        } catch (error) {

            console.log(
                "TEACHER EXAMS ERROR:",
                error.response?.data
            );

            setError(
                error.response?.data?.detail ||
                "Failed to load exams."
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        loadExams();

    }, []);


    const getExamSubjects = (examId) => {

        return examSubjects.filter(
            (item) =>
                String(item.exam) === String(examId)
        );

    };


    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        return new Date(date).toLocaleDateString("en-IN");

    };


    if (loading) {

        return (
            <div className="py-12 text-center text-gray-500">
                Loading exams...
            </div>
        );

    }


    return (
        <div className="space-y-6">

            {/* Header */}

            <div>

                <h1 className="text-3xl font-bold text-gray-800">
                    Exams
                </h1>

                <p className="text-gray-500 mt-1">
                    View exams and assigned subjects
                </p>

            </div>


            {/* Error */}

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}


            {/* Exams */}

            {exams.length === 0 ? (

                <div className="bg-white rounded-xl shadow p-12 text-center text-gray-500">
                    No exams found.
                </div>

            ) : (

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {exams.map((exam) => {

                        const subjects = getExamSubjects(exam.id);

                        return (
                            <div
                                key={exam.id}
                                className="bg-white rounded-xl shadow p-6"
                            >

                                {/* Exam Header */}

                                <div className="flex justify-between items-start gap-4">

                                    <div>

                                        <h2 className="text-xl font-bold text-gray-800">
                                            {exam.name}
                                        </h2>

                                        <p className="text-gray-500 mt-1">
                                            Class {exam.school_class}
                                        </p>

                                    </div>

                                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
                                        {exam.academic_year}
                                    </span>

                                </div>


                                {/* Dates */}

                                <div className="grid grid-cols-2 gap-4 mt-5">

                                    <div>

                                        <p className="text-sm text-gray-500">
                                            Start Date
                                        </p>

                                        <p className="font-medium text-gray-800">
                                            {formatDate(exam.start_date)}
                                        </p>

                                    </div>

                                    <div>

                                        <p className="text-sm text-gray-500">
                                            End Date
                                        </p>

                                        <p className="font-medium text-gray-800">
                                            {formatDate(exam.end_date)}
                                        </p>

                                    </div>

                                </div>


                                {/* Subjects */}

                                <div className="mt-6">

                                    <h3 className="font-semibold text-gray-800 mb-3">
                                        Subjects
                                    </h3>

                                    {subjects.length === 0 ? (

                                        <p className="text-sm text-gray-500">
                                            No subjects added.
                                        </p>

                                    ) : (

                                        <div className="space-y-2">

                                            {subjects.map((item) => (

                                                <div
                                                    key={item.id}
                                                    className="flex items-center justify-between border rounded-lg px-4 py-3"
                                                >

                                                    <div>

                                                        <p className="font-medium text-gray-800">
                                                            {item.subject_name ||
                                                                `Subject ${item.subject}`}
                                                        </p>

                                                    </div>

                                                    <div className="text-sm text-gray-500">

                                                        <span>
                                                            Max: {item.maximum_marks}
                                                        </span>

                                                        <span className="ml-4">
                                                            Pass: {item.pass_marks}
                                                        </span>

                                                    </div>

                                                </div>

                                            ))}

                                        </div>

                                    )}

                                </div>


                                {/* Report Card */}

                                <button
                                    type="button"
                                    onClick={() => setSelectedExam(exam)}
                                    className="w-full mt-6 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition"
                                >
                                    View Exam Details
                                </button>

                            </div>
                        );

                    })}

                </div>

            )}


            {/* Exam Details Modal */}

            {selectedExam && (

                <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">

                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

                        <div className="p-6 border-b flex justify-between items-center">

                            <div>

                                <h2 className="text-2xl font-bold text-gray-800">
                                    {selectedExam.name}
                                </h2>

                                <p className="text-gray-500 mt-1">
                                    Class {selectedExam.school_class}
                                </p>

                            </div>

                            <button
                                type="button"
                                onClick={() => setSelectedExam(null)}
                                className="text-gray-500 hover:text-gray-800 text-2xl"
                            >
                                ×
                            </button>

                        </div>


                        <div className="p-6">

                            <h3 className="font-semibold text-gray-800 mb-4">
                                Exam Subjects
                            </h3>

                            <div className="space-y-3">

                                {getExamSubjects(selectedExam.id).map(
                                    (item) => (

                                        <div
                                            key={item.id}
                                            className="border rounded-lg p-4"
                                        >

                                            <p className="font-medium text-gray-800">
                                                {item.subject_name ||
                                                    `Subject ${item.subject}`}
                                            </p>

                                            <div className="flex gap-6 mt-2 text-sm text-gray-500">

                                                <span>
                                                    Maximum Marks:{" "}
                                                    {item.maximum_marks}
                                                </span>

                                                <span>
                                                    Pass Marks:{" "}
                                                    {item.pass_marks}
                                                </span>

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}

export default TeacherExams;