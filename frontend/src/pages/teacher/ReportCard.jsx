import { useState } from "react";
import api from "../../services/api";

function ReportCard () {
    const [studentId, setStudentId] = useState("");
    const [examId, setExamId] = useState("");

    const [reportCard, setReportCard] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchReportCard = async () => {
        if (!studentId || !examId) {
            setError("Student ID and Exam ID are required.");
            return;
        }

        try {
            setLoading(true);
            setError("");
            setReportCard(null);

            const response = await api.get(
                `exams/report-card/${studentId}/${examId}/`
            );

            setReportCard(response.data);
        } catch (error) {
            console.log(
                "REPORT CARD ERROR:",
                error.response?.data
            );

            setError(
                error.response?.data?.detail ||
                "Failed to load report card."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                    Report Card
                </h2>

                <p className="text-gray-500 mt-1">
                    Search student report card
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Student ID
                    </label>

                    <input
                        type="number"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        placeholder="Enter student ID"
                        className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Exam ID
                    </label>

                    <input
                        type="number"
                        value={examId}
                        onChange={(e) => setExamId(e.target.value)}
                        placeholder="Enter exam ID"
                        className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex items-end">
                    <button
                        type="button"
                        onClick={fetchReportCard}
                        disabled={loading}
                        className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? "Loading..." : "View Report Card"}
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
                    {error}
                </div>
            )}

            {reportCard && (
                <div className="border rounded-xl overflow-hidden">
                    <div className="bg-gray-50 px-6 py-5">
                        <h3 className="text-xl font-bold text-gray-800">
                            {reportCard.student_name || "Student Report Card"}
                        </h3>

                        <div className="flex flex-wrap gap-6 mt-2 text-sm text-gray-600">
                            <span>
                                Student ID: {reportCard.student_id || studentId}
                            </span>

                            <span>
                                Exam: {reportCard.exam_name || examId}
                            </span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-white border-b">
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                        #
                                    </th>

                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                        Subject
                                    </th>

                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                        Maximum Marks
                                    </th>

                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                        Marks Obtained
                                    </th>

                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                        Remarks
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y">
                                {(
                                    reportCard.results ||
                                    reportCard.subjects ||
                                    []
                                ).map((result, index) => (
                                    <tr
                                        key={result.id || index}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {index + 1}
                                        </td>

                                        <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                                            {result.subject_name ||
                                                result.subject ||
                                                "-"}
                                        </td>

                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {result.maximum_marks || "-"}
                                        </td>

                                        <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                                            {result.marks_obtained ?? "-"}
                                        </td>

                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {result.remarks || "-"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="bg-gray-50 px-6 py-5 flex flex-wrap gap-8">
                        <div>
                            <p className="text-sm text-gray-500">
                                Total Marks
                            </p>

                            <p className="text-lg font-bold text-gray-800">
                                {reportCard.total_marks ?? "-"}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Marks Obtained
                            </p>

                            <p className="text-lg font-bold text-gray-800">
                                {reportCard.marks_obtained ?? "-"}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Percentage
                            </p>

                            <p className="text-lg font-bold text-gray-800">
                                {reportCard.percentage ?? "-"}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Result
                            </p>

                            <p className="text-lg font-bold text-gray-800">
                                {reportCard.result ?? "-"}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ReportCard;