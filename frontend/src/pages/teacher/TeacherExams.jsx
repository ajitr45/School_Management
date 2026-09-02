import { useEffect, useState } from "react";
import api from "../../services/api";
import ReportCard from "./ReportCard";

function TeacherExams () {
    const [activeTab, setActiveTab] = useState("exams");

    const [exams, setExams] = useState([]);
    const [examSubjects, setExamSubjects] = useState([]);
    const [studentResults, setStudentResults] = useState([]);

    const [loadingExams, setLoadingExams] = useState(true);
    const [loadingExamSubjects, setLoadingExamSubjects] = useState(true);
    const [loadingStudentResults, setLoadingStudentResults] = useState(true);

    const [error, setError] = useState("");

    const loadExams = async () => {
        try {
            setLoadingExams(true);
            setError("");

            const response = await api.get("exams/");

            setExams(
                Array.isArray(response.data)
                    ? response.data
                    : response.data.results || []
            );
        } catch (error) {
            console.log("EXAMS ERROR:", error.response?.data);
            setError("Failed to load exams.");
        } finally {
            setLoadingExams(false);
        }
    };

    const loadExamSubjects = async () => {
        try {
            setLoadingExamSubjects(true);
            setError("");

            const response = await api.get("exams/subjects/");

            setExamSubjects(
                Array.isArray(response.data)
                    ? response.data
                    : response.data.results || []
            );
        } catch (error) {
            console.log(
                "EXAM SUBJECTS ERROR:",
                error.response?.data
            );
            setError("Failed to load exam subjects.");
        } finally {
            setLoadingExamSubjects(false);
        }
    };

    const loadStudentResults = async () => {
        try {
            setLoadingStudentResults(true);
            setError("");

            const response = await api.get("exams/results/");

            setStudentResults(
                Array.isArray(response.data)
                    ? response.data
                    : response.data.results || []
            );
        } catch (error) {
            console.log(
                "STUDENT RESULTS ERROR:",
                error.response?.data
            );
            setError("Failed to load student results.");
        } finally {
            setLoadingStudentResults(false);
        }
    };

    useEffect(() => {
        loadExams();
        loadExamSubjects();
        loadStudentResults();
    }, []);

    const changeTab = (tab) => {
        setActiveTab(tab);
        setError("");
    };

    return (
        <div className="space-y-6">

            <div>
                <h1 className="text-3xl font-bold text-gray-800">
                    Exams
                </h1>

                <p className="text-gray-500 mt-1">
                    View exams, subjects and student results
                </p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            <div className="bg-white rounded-xl shadow overflow-hidden">

                <div className="flex overflow-x-auto border-b">

                    <button
                        type="button"
                        onClick={() => changeTab("exams")}
                        className={`px-8 py-5 text-lg font-semibold whitespace-nowrap ${activeTab === "exams"
                                ? "text-blue-600 border-b-2 border-blue-600"
                                : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        Exams
                    </button>

                    <button
                        type="button"
                        onClick={() => changeTab("subjects")}
                        className={`px-8 py-5 text-lg font-semibold whitespace-nowrap ${activeTab === "subjects"
                                ? "text-blue-600 border-b-2 border-blue-600"
                                : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        Exam Subjects
                    </button>

                    <button
                        type="button"
                        onClick={() => changeTab("results")}
                        className={`px-8 py-5 text-lg font-semibold whitespace-nowrap ${activeTab === "results"
                                ? "text-blue-600 border-b-2 border-blue-600"
                                : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        Student Results
                    </button>

                    <button
                        type="button"
                        onClick={() => changeTab("report")}
                        className={`px-8 py-5 text-lg font-semibold whitespace-nowrap ${activeTab === "report"
                                ? "text-blue-600 border-b-2 border-blue-600"
                                : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        Report Card
                    </button>

                </div>

                <div className="p-6">

                    {activeTab === "exams" && (
                        <ExamList
                            exams={exams}
                            loading={loadingExams}
                        />
                    )}

                    {activeTab === "subjects" && (
                        <ExamSubjectList
                            examSubjects={examSubjects}
                            loading={loadingExamSubjects}
                        />
                    )}

                    {activeTab === "results" && (
                        <StudentResultList
                            studentResults={studentResults}
                            loading={loadingStudentResults}
                        />
                    )}

                    {activeTab === "report" && (
                        <ReportCard />
                    )}

                </div>

            </div>

        </div>
    );
}


function ExamList ({ exams, loading }) {

    if (loading) {
        return (
            <div className="py-12 text-center text-gray-500">
                Loading exams...
            </div>
        );
    }

    return (
        <div>

            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                    Exams
                </h2>

                <p className="text-gray-500 mt-1">
                    {exams.length} exams
                </p>
            </div>

            <div className="overflow-x-auto">

                <table className="w-full">

                    <thead>
                        <tr className="bg-gray-50">

                            <Th>#</Th>
                            <Th>Exam</Th>
                            <Th>Class</Th>
                            <Th>Academic Year</Th>
                            <Th>Start Date</Th>
                            <Th>End Date</Th>

                        </tr>
                    </thead>

                    <tbody className="divide-y">

                        {exams.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="6"
                                    className="px-6 py-16 text-center text-gray-500"
                                >
                                    No exams found.
                                </td>
                            </tr>
                        ) : (
                            exams.map((exam, index) => (
                                <tr
                                    key={exam.id}
                                    className="hover:bg-gray-50"
                                >

                                    <Td>
                                        {index + 1}
                                    </Td>

                                    <Td>
                                        <span className="font-semibold text-gray-800">
                                            {exam.name}
                                        </span>
                                    </Td>

                                    <Td>
                                        {exam.school_class}
                                    </Td>

                                    <Td>
                                        {exam.academic_year}
                                    </Td>

                                    <Td>
                                        {exam.start_date}
                                    </Td>

                                    <Td>
                                        {exam.end_date}
                                    </Td>

                                </tr>
                            ))
                        )}

                    </tbody>

                </table>

            </div>

        </div>
    );
}


function ExamSubjectList ({
    examSubjects,
    loading
}) {

    if (loading) {
        return (
            <div className="py-12 text-center text-gray-500">
                Loading exam subjects...
            </div>
        );
    }

    return (
        <div>

            <div className="mb-6">

                <h2 className="text-2xl font-bold text-gray-800">
                    Exam Subjects
                </h2>

                <p className="text-gray-500 mt-1">
                    {examSubjects.length} exam subjects
                </p>

            </div>

            <div className="overflow-x-auto">

                <table className="w-full">

                    <thead>
                        <tr className="bg-gray-50">

                            <Th>#</Th>
                            <Th>Exam</Th>
                            <Th>Subject</Th>
                            <Th>Maximum Marks</Th>
                            <Th>Pass Marks</Th>

                        </tr>
                    </thead>

                    <tbody className="divide-y">

                        {examSubjects.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="5"
                                    className="px-6 py-16 text-center text-gray-500"
                                >
                                    No exam subjects found.
                                </td>
                            </tr>
                        ) : (
                            examSubjects.map(
                                (examSubject, index) => (
                                    <tr
                                        key={examSubject.id}
                                        className="hover:bg-gray-50"
                                    >

                                        <Td>
                                            {index + 1}
                                        </Td>

                                        <Td>
                                            <span className="font-semibold text-gray-800">
                                                {
                                                    examSubject.exam_name ||
                                                    examSubject.exam
                                                }
                                            </span>
                                        </Td>

                                        <Td>
                                            {
                                                examSubject.subject_name ||
                                                examSubject.subject
                                            }
                                        </Td>

                                        <Td>
                                            {examSubject.maximum_marks}
                                        </Td>

                                        <Td>
                                            {examSubject.pass_marks}
                                        </Td>

                                    </tr>
                                )
                            )
                        )}

                    </tbody>

                </table>

            </div>

        </div>
    );
}


function StudentResultList ({
    studentResults,
    loading
}) {

    if (loading) {
        return (
            <div className="py-12 text-center text-gray-500">
                Loading student results...
            </div>
        );
    }

    return (
        <div>

            <div className="mb-6">

                <h2 className="text-2xl font-bold text-gray-800">
                    Student Results
                </h2>

                <p className="text-gray-500 mt-1">
                    {studentResults.length} student results
                </p>

            </div>

            <div className="overflow-x-auto">

                <table className="w-full">

                    <thead>
                        <tr className="bg-gray-50">

                            <Th>#</Th>
                            <Th>Student</Th>
                            <Th>Exam</Th>
                            <Th>Subject</Th>
                            <Th>Marks Obtained</Th>
                            <Th>Remarks</Th>

                        </tr>
                    </thead>

                    <tbody className="divide-y">

                        {studentResults.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="6"
                                    className="px-6 py-16 text-center text-gray-500"
                                >
                                    No student results found.
                                </td>
                            </tr>
                        ) : (
                            studentResults.map(
                                (result, index) => (
                                    <tr
                                        key={result.id}
                                        className="hover:bg-gray-50"
                                    >

                                        <Td>
                                            {index + 1}
                                        </Td>

                                        <Td>
                                            <span className="font-semibold text-gray-800">
                                                {
                                                    result.student_name ||
                                                    result.student
                                                }
                                            </span>
                                        </Td>

                                        <Td>
                                            {result.exam_name || "-"}
                                        </Td>

                                        <Td>
                                            {result.subject_name || "-"}
                                        </Td>

                                        <Td>
                                            <span className="font-semibold text-gray-800">
                                                {result.marks_obtained}
                                            </span>
                                        </Td>

                                        <Td>
                                            {result.remarks || "-"}
                                        </Td>

                                    </tr>
                                )
                            )
                        )}

                    </tbody>

                </table>

            </div>

        </div>
    );
}


function Th ({ children }) {
    return (
        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 whitespace-nowrap">
            {children}
        </th>
    );
}


function Td ({ children }) {
    return (
        <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
            {children}
        </td>
    );
}


export default TeacherExams;