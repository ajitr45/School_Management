import { useEffect, useState } from "react";
import api from "../../services/api";

function ReportCard () {

    const [students, setStudents] = useState([]);
    const [exams, setExams] = useState([]);

    const [studentId, setStudentId] = useState("");
    const [examId, setExamId] = useState("");

    const [report, setReport] = useState(null);

    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState("");


    // =====================================================
    // LOAD STUDENTS + EXAMS
    // =====================================================

    useEffect(() => {

        const loadData = async () => {

            try {

                setLoading(true);
                setError("");

                const [
                    studentResponse,
                    examResponse,
                ] = await Promise.all([

                    api.get("students/"),

                    api.get("exams/exams/"),

                ]);

                setStudents(studentResponse.data);
                setExams(examResponse.data);

            } catch (error) {

                console.log(error.response?.data);

                setError(
                    "Failed to load students and exams."
                );

            } finally {

                setLoading(false);

            }

        };

        loadData();

    }, []);


    // =====================================================
    // GENERATE REPORT CARD
    // =====================================================

    const generateReport = async () => {

        if (!studentId || !examId) {

            setError(
                "Please select student and exam."
            );

            return;

        }

        try {

            setGenerating(true);
            setError("");
            setReport(null);

            const response = await api.get(
                `exams/report-card/${studentId}/${examId}/`
            );

            setReport(response.data);

        } catch (error) {

            console.log(error.response?.data);

            setError(
                error.response?.data?.detail ||
                error.response?.data?.exam ||
                "Failed to generate report card."
            );

        } finally {

            setGenerating(false);

        }

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="p-6">

                <p className="text-gray-500">
                    Loading report card...
                </p>

            </div>

        );

    }


    return (

        <div className="space-y-6">


            {/* =====================================================
                HEADER
            ===================================================== */}

            <div>

                <h1 className="text-2xl font-bold text-gray-800">
                    Report Card
                </h1>

                <p className="text-gray-500 mt-1">
                    Generate student report card
                </p>

            </div>


            {/* =====================================================
                ERROR
            ===================================================== */}

            {error && (

                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg">
                    {error}
                </div>

            )}


            {/* =====================================================
                SELECT STUDENT + EXAM
            ===================================================== */}

            <div className="bg-white rounded-xl shadow p-6">

                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Generate Report Card
                </h2>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


                    {/* =================================================
                        STUDENT
                    ================================================= */}

                    <div>

                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Student
                        </label>

                        <select
                            value={studentId}
                            onChange={(e) => {

                                setStudentId(e.target.value);
                                setReport(null);
                                setError("");

                            }}
                            className="w-full border rounded-lg px-4 py-2.5"
                        >

                            <option value="">
                                Select Student
                            </option>

                            {students.map((student) => (

                                <option
                                    key={student.id}
                                    value={student.id}
                                >

                                    {student.student_id}
                                    {" - "}

                                    {student.admission?.student_name ||
                                        student.student_name ||
                                        student.name ||
                                        "Student"}

                                </option>

                            ))}

                        </select>

                    </div>


                    {/* =================================================
                        EXAM
                    ================================================= */}

                    <div>

                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Exam
                        </label>

                        <select
                            value={examId}
                            onChange={(e) => {

                                setExamId(e.target.value);
                                setReport(null);
                                setError("");

                            }}
                            className="w-full border rounded-lg px-4 py-2.5"
                        >

                            <option value="">
                                Select Exam
                            </option>

                            {exams.map((exam) => (

                                <option
                                    key={exam.id}
                                    value={exam.id}
                                >

                                    {exam.name}
                                    {" - "}
                                    {exam.academic_year}

                                </option>

                            ))}

                        </select>

                    </div>

                </div>


                {/* =================================================
                    GENERATE BUTTON
                ================================================= */}

                <button
                    onClick={generateReport}
                    disabled={
                        generating ||
                        !studentId ||
                        !examId
                    }
                    className="mt-5 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >

                    {generating
                        ? "Generating..."
                        : "Generate Report Card"}

                </button>

            </div>


            {/* =====================================================
                REPORT CARD
            ===================================================== */}

            {report && (

                <div className="bg-white rounded-xl shadow">


                    {/* =================================================
                        REPORT HEADER
                    ================================================= */}

                    <div className="p-6 border-b">

                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                            <div>

                                <h2 className="text-2xl font-bold text-gray-800">
                                    {report.exam.exam_name}
                                </h2>

                                <p className="text-gray-500 mt-1">
                                    Academic Year:{" "}
                                    {report.exam.academic_year}
                                </p>

                            </div>


                            <div className="text-left md:text-right">

                                <p className="font-semibold text-gray-800">
                                    {report.student.student_name}
                                </p>

                                <p className="text-sm text-gray-500">
                                    Student ID:{" "}
                                    {report.student.student_id}
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        STUDENT DETAILS
                    ================================================= */}

                    <div className="p-6 border-b">

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">


                            <InfoBox
                                label="Student ID"
                                value={
                                    report.student.student_id
                                }
                            />


                            <InfoBox
                                label="Student Name"
                                value={
                                    report.student.student_name
                                }
                            />


                            <InfoBox
                                label="Class"
                                value={
                                    report.student.school_class
                                }
                            />


                            <InfoBox
                                label="Section"
                                value={
                                    report.student.section
                                }
                            />


                            <InfoBox
                                label="Start Date"
                                value={
                                    report.exam.start_date
                                }
                            />


                            <InfoBox
                                label="End Date"
                                value={
                                    report.exam.end_date
                                }
                            />

                        </div>

                    </div>


                    {/* =================================================
                        SUBJECT RESULTS
                    ================================================= */}

                    <div className="p-6">

                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Subject Results
                        </h3>


                        <div className="overflow-x-auto">

                            <table className="w-full">

                                <thead className="bg-gray-50">

                                    <tr>

                                        <Th>#</Th>
                                        <Th>Subject</Th>
                                        <Th>Max Marks</Th>
                                        <Th>Pass Marks</Th>
                                        <Th>Obtained</Th>
                                        <Th>Percentage</Th>
                                        <Th>Grade</Th>
                                        <Th>Status</Th>
                                        <Th>Remarks</Th>

                                    </tr>

                                </thead>


                                <tbody className="divide-y">

                                    {report.subjects.length === 0 ? (

                                        <tr>

                                            <td
                                                colSpan="9"
                                                className="px-6 py-10 text-center text-gray-500"
                                            >
                                                No subject results found.
                                            </td>

                                        </tr>

                                    ) : (

                                        report.subjects.map(
                                            (subject, index) => (

                                                <tr
                                                    key={index}
                                                    className="hover:bg-gray-50"
                                                >

                                                    <Td>
                                                        {index + 1}
                                                    </Td>

                                                    <Td>
                                                        <span className="font-medium text-gray-800">
                                                            {subject.subject}
                                                        </span>
                                                    </Td>

                                                    <Td>
                                                        {subject.maximum_marks}
                                                    </Td>

                                                    <Td>
                                                        {subject.pass_marks}
                                                    </Td>

                                                    <Td>
                                                        <span className="font-semibold">
                                                            {subject.marks_obtained}
                                                        </span>
                                                    </Td>

                                                    <Td>
                                                        {subject.percentage}%
                                                    </Td>

                                                    <Td>
                                                        <span className="font-semibold">
                                                            {subject.grade}
                                                        </span>
                                                    </Td>

                                                    <Td>

                                                        <ResultStatus
                                                            status={
                                                                subject.status
                                                            }
                                                        />

                                                    </Td>

                                                    <Td>
                                                        {subject.remarks ||
                                                            "-"}
                                                    </Td>

                                                </tr>

                                            )
                                        )

                                    )}

                                </tbody>

                            </table>

                        </div>

                    </div>


                    {/* =================================================
                        SUMMARY
                    ================================================= */}

                    <div className="p-6 border-t">

                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Result Summary
                        </h3>


                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">


                            <SummaryBox
                                label="Total Marks"
                                value={
                                    report.summary.total_marks
                                }
                            />


                            <SummaryBox
                                label="Obtained Marks"
                                value={
                                    report.summary.obtained_marks
                                }
                            />


                            <SummaryBox
                                label="Percentage"
                                value={`${report.summary.percentage}%`}
                            />


                            <SummaryBox
                                label="Grade"
                                value={
                                    report.summary.grade
                                }
                            />


                            <SummaryBox
                                label="Division"
                                value={
                                    report.summary.division
                                }
                            />

                        </div>


                        {/* RESULT */}

                        <div className="mt-5">

                            <span className="text-sm text-gray-500">
                                Final Result
                            </span>

                            <div className="mt-2">

                                <ResultStatus
                                    status={
                                        report.summary.result
                                    }
                                />

                            </div>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );

}


// =====================================================
// INFO BOX
// =====================================================

function InfoBox ({
    label,
    value,
}) {

    return (

        <div className="bg-gray-50 rounded-lg p-4">

            <p className="text-xs text-gray-500">
                {label}
            </p>

            <p className="font-semibold text-gray-800 mt-1">
                {value || "-"}
            </p>

        </div>

    );

}


// =====================================================
// SUMMARY BOX
// =====================================================

function SummaryBox ({
    label,
    value,
}) {

    return (

        <div className="border rounded-lg p-4">

            <p className="text-sm text-gray-500">
                {label}
            </p>

            <p className="text-xl font-bold text-gray-800 mt-1">
                {value}
            </p>

        </div>

    );

}


// =====================================================
// TABLE HEADER
// =====================================================

function Th ({ children }) {

    return (

        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 whitespace-nowrap">
            {children}
        </th>

    );

}


// =====================================================
// TABLE DATA
// =====================================================

function Td ({ children }) {

    return (

        <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
            {children}
        </td>

    );

}


// =====================================================
// RESULT STATUS
// =====================================================

function ResultStatus ({ status }) {

    const statusClasses = {

        PASS:
            "bg-green-100 text-green-700",

        FAIL:
            "bg-red-100 text-red-700",

    };


    return (

        <span
            className={`px-3 py-1 text-xs font-semibold rounded-full ${statusClasses[status] ||
                "bg-gray-100 text-gray-600"
                }`}
        >

            {status}

        </span>

    );

}


export default ReportCard;