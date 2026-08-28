import { useEffect, useState } from "react";
import api from "../../services/api";
import ReportCard from "./ReportCard";

function Exams () {

    // =====================================================
    // ACTIVE TAB
    // =====================================================

    const [activeTab, setActiveTab] = useState("exams");


    // =====================================================
    // DATA
    // =====================================================

    const [exams, setExams] = useState([]);
    const [examSubjects, setExamSubjects] = useState([]);
    const [studentResults, setStudentResults] = useState([]);

    const [students, setStudents] = useState([]);
    const [classes, setClasses] = useState([]);
    const [subjects, setSubjects] = useState([]);


    // =====================================================
    // LOADING
    // =====================================================

    const [loadingExams, setLoadingExams] = useState(true);
    const [loadingExamSubjects, setLoadingExamSubjects] = useState(true);
    const [loadingStudentResults, setLoadingStudentResults] =
        useState(true);

    const [loadingStudents, setLoadingStudents] = useState(true);
    const [loadingClasses, setLoadingClasses] = useState(true);
    const [loadingSubjects, setLoadingSubjects] = useState(true);


    // =====================================================
    // MODAL
    // =====================================================

    const [showExamForm, setShowExamForm] = useState(false);
    const [showExamSubjectForm, setShowExamSubjectForm] = useState(false);
    const [showStudentResultForm, setShowStudentResultForm] = useState(false);


    // =====================================================
    // SUBMIT LOADING
    // =====================================================

    const [submitting, setSubmitting] = useState(false);


    // =====================================================
    // ERROR
    // =====================================================

    const [error, setError] = useState("");


    // =====================================================
    // SUCCESS
    // =====================================================

    const [success, setSuccess] = useState("");


    // =====================================================
    // EXAM FORM
    // =====================================================

    const [examForm, setExamForm] = useState({
        name: "",
        school_class: "",
        academic_year: "",
        start_date: "",
        end_date: "",
    });


    // =====================================================
    // EXAM SUBJECT FORM
    // =====================================================

    const [examSubjectForm, setExamSubjectForm] = useState({
        exam: "",
        subject: "",
        maximum_marks: "",
        pass_marks: "",
    });


    // =====================================================
    // STUDENT RESULT FORM
    // =====================================================

    const [studentResultForm, setStudentResultForm] = useState({
        student: "",
        exam_subject: "",
        marks_obtained: "",
        remarks: "",
    });


    // =====================================================
    // LOAD EXAMS
    // =====================================================

    const loadExams = async () => {

        try {

            setLoadingExams(true);

            const response = await api.get("exams/exams/");

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


    // =====================================================
    // LOAD EXAM SUBJECTS
    // =====================================================

    const loadExamSubjects = async () => {

        try {

            setLoadingExamSubjects(true);

            const response = await api.get(
                "exams/exam-subjects/"
            );

            setExamSubjects(
                Array.isArray(response.data)
                    ? response.data
                    : response.data.results || []
            );

        } catch (error) {

            console.log(
                "EXAM SUBJECT ERROR:",
                error.response?.data
            );

            setError("Failed to load exam subjects.");

        } finally {

            setLoadingExamSubjects(false);

        }
    };


    // =====================================================
    // LOAD STUDENT RESULTS
    // =====================================================

    const loadStudentResults = async () => {

        try {

            setLoadingStudentResults(true);

            const response = await api.get(
                "exams/student-results/"
            );

            setStudentResults(
                Array.isArray(response.data)
                    ? response.data
                    : response.data.results || []
            );

        } catch (error) {

            console.log(
                "STUDENT RESULT ERROR:",
                error.response?.data
            );

            setError("Failed to load student results.");

        } finally {

            setLoadingStudentResults(false);

        }
    };


    // =====================================================
    // LOAD STUDENTS
    // =====================================================

    const loadStudents = async () => {

        try {

            setLoadingStudents(true);

            const response = await api.get(
                "students/"
            );

            setStudents(
                Array.isArray(response.data)
                    ? response.data
                    : response.data.results || []
            );

        } catch (error) {

            console.log(
                "STUDENTS ERROR:",
                error.response?.data
            );

            setError("Failed to load students.");

        } finally {

            setLoadingStudents(false);

        }
    };


    // =====================================================
    // LOAD CLASSES
    // =====================================================

    const loadClasses = async () => {

        try {

            setLoadingClasses(true);

            const response = await api.get(
                "academics/classes/"
            );

            setClasses(
                Array.isArray(response.data)
                    ? response.data
                    : response.data.results || []
            );

        } catch (error) {

            console.log(
                "CLASSES ERROR:",
                error.response?.data
            );

            setError("Failed to load classes.");

        } finally {

            setLoadingClasses(false);

        }
    };


    // =====================================================
    // LOAD SUBJECTS
    // =====================================================

    const loadSubjects = async () => {

        try {

            setLoadingSubjects(true);

            const response = await api.get(
                "academics/subjects/"
            );

            setSubjects(
                Array.isArray(response.data)
                    ? response.data
                    : response.data.results || []
            );

        } catch (error) {

            console.log(
                "SUBJECTS ERROR:",
                error.response?.data
            );

            setError("Failed to load subjects.");

        } finally {

            setLoadingSubjects(false);

        }
    };


    // =====================================================
    // LOAD ALL DATA
    // =====================================================

    useEffect(() => {

        loadExams();
        loadExamSubjects();
        loadStudentResults();

        loadStudents();
        loadClasses();
        loadSubjects();

    }, []);


    // =====================================================
    // CLEAR MESSAGES
    // =====================================================

    const clearMessages = () => {

        setError("");
        setSuccess("");

    };


    // =====================================================
    // OPEN EXAM FORM
    // =====================================================

    const openExamForm = () => {

        clearMessages();

        setExamForm({
            name: "",
            school_class: "",
            academic_year: "",
            start_date: "",
            end_date: "",
        });

        setShowExamForm(true);

    };


    // =====================================================
    // OPEN EXAM SUBJECT FORM
    // =====================================================

    const openExamSubjectForm = () => {

        clearMessages();

        setExamSubjectForm({
            exam: "",
            subject: "",
            maximum_marks: "",
            pass_marks: "",
        });

        setShowExamSubjectForm(true);

    };


    // =====================================================
    // OPEN STUDENT RESULT FORM
    // =====================================================

    const openStudentResultForm = () => {

        clearMessages();

        setStudentResultForm({
            student: "",
            exam_subject: "",
            marks_obtained: "",
            remarks: "",
        });

        setShowStudentResultForm(true);

    };


    // =====================================================
    // CREATE EXAM
    // =====================================================

    const createExam = async (e) => {

        e.preventDefault();

        try {

            setSubmitting(true);
            clearMessages();

            await api.post(
                "exams/exams/",
                {
                    name: examForm.name,
                    school_class: Number(
                        examForm.school_class
                    ),
                    academic_year: examForm.academic_year,
                    start_date: examForm.start_date,
                    end_date: examForm.end_date,
                }
            );

            setShowExamForm(false);

            setSuccess(
                "Exam created successfully."
            );

            await loadExams();

        } catch (error) {

            console.log(
                "CREATE EXAM ERROR:",
                error.response?.data
            );

            setError(
                getApiError(error)
            );

        } finally {

            setSubmitting(false);

        }
    };


    // =====================================================
    // CREATE EXAM SUBJECT
    // =====================================================

    const createExamSubject = async (e) => {

        e.preventDefault();

        try {

            setSubmitting(true);
            clearMessages();

            await api.post(
                "exams/exam-subjects/",
                {
                    exam: Number(
                        examSubjectForm.exam
                    ),

                    subject: Number(
                        examSubjectForm.subject
                    ),

                    maximum_marks: Number(
                        examSubjectForm.maximum_marks
                    ),

                    pass_marks: Number(
                        examSubjectForm.pass_marks
                    ),
                }
            );

            setShowExamSubjectForm(false);

            setSuccess(
                "Exam subject created successfully."
            );

            await loadExamSubjects();

        } catch (error) {

            console.log(
                "CREATE EXAM SUBJECT ERROR:",
                error.response?.data
            );

            setError(
                getApiError(error)
            );

        } finally {

            setSubmitting(false);

        }
    };


    // =====================================================
    // CREATE STUDENT RESULT
    // =====================================================

    const createStudentResult = async (e) => {

        e.preventDefault();

        try {

            setSubmitting(true);
            clearMessages();

            await api.post(
                "exams/student-results/",
                {
                    student: Number(
                        studentResultForm.student
                    ),

                    exam_subject: Number(
                        studentResultForm.exam_subject
                    ),

                    marks_obtained: Number(
                        studentResultForm.marks_obtained
                    ),

                    remarks:
                        studentResultForm.remarks || "",
                }
            );

            setShowStudentResultForm(false);

            setSuccess(
                "Student result created successfully."
            );

            await loadStudentResults();

        } catch (error) {

            console.log(
                "CREATE STUDENT RESULT ERROR:",
                error.response?.data
            );

            setError(
                getApiError(error)
            );

        } finally {

            setSubmitting(false);

        }
    };


    // =====================================================
    // TAB CHANGE
    // =====================================================

    const changeTab = (tab) => {

        setActiveTab(tab);

        clearMessages();

    };


    return (

        <div className="space-y-6">


            {/* =====================================================
                HEADER
            ===================================================== */}

            <div>

                <h1 className="text-3xl font-bold text-gray-800">
                    Exams
                </h1>

                <p className="text-gray-500 mt-1">
                    Manage exams, subjects and student results
                </p>

            </div>


            {/* =====================================================
                SUCCESS
            ===================================================== */}

            {success && (

                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                    {success}
                </div>

            )}


            {/* =====================================================
                ERROR
            ===================================================== */}

            {error && (

                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                    {error}
                </div>

            )}


            {/* =====================================================
                MAIN CARD
            ===================================================== */}

            <div className="bg-white rounded-xl shadow overflow-hidden">


                {/* =================================================
                    TABS
                ================================================= */}

                <div className="flex overflow-x-auto border-b">


                    <TabButton
                        active={activeTab === "exams"}
                        onClick={() => changeTab("exams")}
                    >
                        Exams
                    </TabButton>


                    <TabButton
                        active={activeTab === "subjects"}
                        onClick={() => changeTab("subjects")}
                    >
                        Exam Subjects
                    </TabButton>


                    <TabButton
                        active={activeTab === "results"}
                        onClick={() => changeTab("results")}
                    >
                        Student Results
                    </TabButton>


                    <TabButton
                        active={activeTab === "report"}
                        onClick={() => changeTab("report")}
                    >
                        Report Card
                    </TabButton>

                </div>


                {/* =================================================
                    TAB CONTENT
                ================================================= */}

                <div className="p-6">


                    {/* =================================================
                        EXAMS
                    ================================================= */}

                    {activeTab === "exams" && (

                        <div>

                            <SectionHeader
                                title="Exams"
                                count={exams.length}
                                buttonText="+ Add Exam"
                                onClick={openExamForm}
                            />

                            <ExamList
                                exams={exams}
                                loading={loadingExams}
                            />

                        </div>

                    )}


                    {/* =================================================
                        EXAM SUBJECTS
                    ================================================= */}

                    {activeTab === "subjects" && (

                        <div>

                            <SectionHeader
                                title="Exam Subjects"
                                count={examSubjects.length}
                                buttonText="+ Add Exam Subject"
                                onClick={openExamSubjectForm}
                            />

                            <ExamSubjectList
                                examSubjects={examSubjects}
                                loading={loadingExamSubjects}
                            />

                        </div>

                    )}


                    {/* =================================================
                        STUDENT RESULTS
                    ================================================= */}

                    {activeTab === "results" && (

                        <div>

                            <SectionHeader
                                title="Student Results"
                                count={studentResults.length}
                                buttonText="+ Add Result"
                                onClick={openStudentResultForm}
                            />

                            <StudentResultList
                                studentResults={studentResults}
                                loading={loadingStudentResults}
                            />

                        </div>

                    )}


                    {/* =================================================
                        REPORT CARD
                    ================================================= */}

                    {activeTab === "report" && (

                        <ReportCard />

                    )}

                </div>

            </div>


            {/* =====================================================
                EXAM MODAL
            ===================================================== */}

            {showExamForm && (

                <Modal
                    title="Add Exam"
                    onClose={() => setShowExamForm(false)}
                >

                    <form
                        onSubmit={createExam}
                        className="space-y-4"
                    >

                        <Input
                            label="Exam Name"
                            value={examForm.name}
                            onChange={(e) =>
                                setExamForm({
                                    ...examForm,
                                    name: e.target.value,
                                })
                            }
                            placeholder="e.g. Half Yearly Examination"
                            required
                        />


                        <Select
                            label="Class"
                            value={examForm.school_class}
                            onChange={(e) =>
                                setExamForm({
                                    ...examForm,
                                    school_class: e.target.value,
                                })
                            }
                            required
                        >

                            <option value="">
                                Select Class
                            </option>

                            {classes.map((item) => (

                                <option
                                    key={item.id}
                                    value={item.id}
                                >
                                    {item.name}
                                </option>

                            ))}

                        </Select>


                        <Input
                            label="Academic Year"
                            value={examForm.academic_year}
                            onChange={(e) =>
                                setExamForm({
                                    ...examForm,
                                    academic_year:
                                        e.target.value,
                                })
                            }
                            placeholder="e.g. 2026-27"
                            required
                        />


                        <Input
                            type="date"
                            label="Start Date"
                            value={examForm.start_date}
                            onChange={(e) =>
                                setExamForm({
                                    ...examForm,
                                    start_date:
                                        e.target.value,
                                })
                            }
                            required
                        />


                        <Input
                            type="date"
                            label="End Date"
                            value={examForm.end_date}
                            onChange={(e) =>
                                setExamForm({
                                    ...examForm,
                                    end_date:
                                        e.target.value,
                                })
                            }
                            required
                        />


                        <ModalButtons
                            submitting={submitting}
                            onCancel={() =>
                                setShowExamForm(false)
                            }
                        />

                    </form>

                </Modal>

            )}


            {/* =====================================================
                EXAM SUBJECT MODAL
            ===================================================== */}

            {showExamSubjectForm && (

                <Modal
                    title="Add Exam Subject"
                    onClose={() =>
                        setShowExamSubjectForm(false)
                    }
                >

                    <form
                        onSubmit={createExamSubject}
                        className="space-y-4"
                    >

                        <Select
                            label="Exam"
                            value={examSubjectForm.exam}
                            onChange={(e) =>
                                setExamSubjectForm({
                                    ...examSubjectForm,
                                    exam: e.target.value,
                                })
                            }
                            required
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

                        </Select>


                        <Select
                            label="Subject"
                            value={examSubjectForm.subject}
                            onChange={(e) =>
                                setExamSubjectForm({
                                    ...examSubjectForm,
                                    subject: e.target.value,
                                })
                            }
                            required
                        >

                            <option value="">
                                Select Subject
                            </option>

                            {subjects.map((subject) => (

                                <option
                                    key={subject.id}
                                    value={subject.id}
                                >

                                    {subject.name}

                                </option>

                            ))}

                        </Select>


                        <Input
                            type="number"
                            label="Maximum Marks"
                            value={
                                examSubjectForm.maximum_marks
                            }
                            onChange={(e) =>
                                setExamSubjectForm({
                                    ...examSubjectForm,
                                    maximum_marks:
                                        e.target.value,
                                })
                            }
                            min="1"
                            required
                        />


                        <Input
                            type="number"
                            label="Pass Marks"
                            value={
                                examSubjectForm.pass_marks
                            }
                            onChange={(e) =>
                                setExamSubjectForm({
                                    ...examSubjectForm,
                                    pass_marks:
                                        e.target.value,
                                })
                            }
                            min="0"
                            required
                        />


                        <ModalButtons
                            submitting={submitting}
                            onCancel={() =>
                                setShowExamSubjectForm(false)
                            }
                        />

                    </form>

                </Modal>

            )}


            {/* =====================================================
                STUDENT RESULT MODAL
            ===================================================== */}

            {showStudentResultForm && (

                <Modal
                    title="Add Student Result"
                    onClose={() =>
                        setShowStudentResultForm(false)
                    }
                >

                    <form
                        onSubmit={createStudentResult}
                        className="space-y-4"
                    >

                        {/* STUDENT */}

                        <Select
                            label="Student"
                            value={
                                studentResultForm.student
                            }
                            onChange={(e) =>
                                setStudentResultForm({
                                    ...studentResultForm,
                                    student: e.target.value,
                                })
                            }
                            required
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

                                    {
                                        student.admission
                                            ?.student_name ||
                                        student.student_name ||
                                        student.name ||
                                        "Student"
                                    }

                                </option>

                            ))}

                        </Select>


                        {/* EXAM SUBJECT */}

                        <Select
                            label="Exam Subject"
                            value={
                                studentResultForm.exam_subject
                            }
                            onChange={(e) =>
                                setStudentResultForm({
                                    ...studentResultForm,
                                    exam_subject:
                                        e.target.value,
                                })
                            }
                            required
                        >

                            <option value="">
                                Select Exam Subject
                            </option>

                            {examSubjects.map(
                                (examSubject) => (

                                    <option
                                        key={examSubject.id}
                                        value={examSubject.id}
                                    >

                                        {
                                            examSubject.exam_name ||
                                            examSubject.exam
                                        }

                                        {" - "}

                                        {
                                            examSubject.subject_name ||
                                            examSubject.subject
                                        }

                                    </option>

                                )
                            )}

                        </Select>


                        <Input
                            type="number"
                            label="Marks Obtained"
                            value={
                                studentResultForm.marks_obtained
                            }
                            onChange={(e) =>
                                setStudentResultForm({
                                    ...studentResultForm,
                                    marks_obtained:
                                        e.target.value,
                                })
                            }
                            min="0"
                            required
                        />


                        <div>

                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Remarks
                            </label>

                            <textarea
                                value={
                                    studentResultForm.remarks
                                }
                                onChange={(e) =>
                                    setStudentResultForm({
                                        ...studentResultForm,
                                        remarks:
                                            e.target.value,
                                    })
                                }
                                rows="3"
                                placeholder="Optional remarks"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                        </div>


                        <ModalButtons
                            submitting={submitting}
                            onCancel={() =>
                                setShowStudentResultForm(false)
                            }
                        />

                    </form>

                </Modal>

            )}

        </div>

    );

}


// =============================================================
// SECTION HEADER
// =============================================================

function SectionHeader ({
    title,
    count,
    buttonText,
    onClick,
}) {

    return (

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

            <div>

                <h2 className="text-2xl font-bold text-gray-800">
                    {title}
                </h2>

                <p className="text-gray-500 mt-1">
                    {count} records
                </p>

            </div>

            <button
                type="button"
                onClick={onClick}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
            >
                {buttonText}
            </button>

        </div>

    );

}


// =============================================================
// EXAM LIST
// =============================================================

function ExamList ({
    exams,
    loading,
}) {

    if (loading) {

        return (
            <Loading text="Loading exams..." />
        );

    }

    return (

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

                        <EmptyRow
                            colSpan="6"
                            text="No exams found."
                        />

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

    );

}


// =============================================================
// EXAM SUBJECT LIST
// =============================================================

function ExamSubjectList ({
    examSubjects,
    loading,
}) {

    if (loading) {

        return (
            <Loading text="Loading exam subjects..." />
        );

    }

    return (

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

                        <EmptyRow
                            colSpan="5"
                            text="No exam subjects found."
                        />

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
                                        {
                                            examSubject.maximum_marks
                                        }
                                    </Td>

                                    <Td>
                                        {
                                            examSubject.pass_marks
                                        }
                                    </Td>

                                </tr>

                            )
                        )

                    )}

                </tbody>

            </table>

        </div>

    );

}


// =============================================================
// STUDENT RESULT LIST
// =============================================================

function StudentResultList ({
    studentResults,
    loading,
}) {

    if (loading) {

        return (
            <Loading text="Loading student results..." />
        );

    }

    return (

        <div className="overflow-x-auto">

            <table className="w-full">

                <thead>

                    <tr className="bg-gray-50">

                        <Th>#</Th>
                        <Th>Student ID</Th>
                        <Th>Student</Th>
                        <Th>Exam</Th>
                        <Th>Subject</Th>
                        <Th>Marks Obtained</Th>
                        <Th>Remarks</Th>

                    </tr>

                </thead>

                <tbody className="divide-y">

                    {studentResults.length === 0 ? (

                        <EmptyRow
                            colSpan="7"
                            text="No student results found."
                        />

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

                                        <span className="font-semibold text-blue-600">
                                            {
                                                result.student_id ||
                                                result.student
                                            }
                                        </span>

                                    </Td>

                                    <Td>

                                        <span className="font-semibold text-gray-800">
                                            {
                                                result.student_name ||
                                                "Student"
                                            }
                                        </span>

                                    </Td>

                                    <Td>
                                        {
                                            result.exam_name ||
                                            "-"
                                        }
                                    </Td>

                                    <Td>
                                        {
                                            result.subject_name ||
                                            "-"
                                        }
                                    </Td>

                                    <Td>

                                        <span className="font-semibold">
                                            {
                                                result.marks_obtained
                                            }
                                        </span>

                                    </Td>

                                    <Td>
                                        {
                                            result.remarks ||
                                            "-"
                                        }
                                    </Td>

                                </tr>

                            )
                        )

                    )}

                </tbody>

            </table>

        </div>

    );

}


// =============================================================
// TAB BUTTON
// =============================================================

function TabButton ({
    active,
    onClick,
    children,
}) {

    return (

        <button
            type="button"
            onClick={onClick}
            className={`px-8 py-5 text-lg font-semibold whitespace-nowrap ${active
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
        >

            {children}

        </button>

    );

}


// =============================================================
// INPUT
// =============================================================

function Input ({
    label,
    type = "text",
    value,
    onChange,
    placeholder,
    required = false,
    min,
}) {

    return (

        <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>

            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                min={min}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

        </div>

    );

}


// =============================================================
// SELECT
// =============================================================

function Select ({
    label,
    value,
    onChange,
    children,
    required = false,
}) {

    return (

        <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>

            <select
                value={value}
                onChange={onChange}
                required={required}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >

                {children}

            </select>

        </div>

    );

}


// =============================================================
// MODAL
// =============================================================

function Modal ({
    title,
    onClose,
    children,
}) {

    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

                <div className="flex items-center justify-between px-6 py-4 border-b">

                    <h2 className="text-xl font-bold text-gray-800">
                        {title}
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-800 text-2xl"
                    >
                        ×
                    </button>

                </div>

                <div className="p-6">

                    {children}

                </div>

            </div>

        </div>

    );

}


// =============================================================
// MODAL BUTTONS
// =============================================================

function ModalButtons ({
    submitting,
    onCancel,
}) {

    return (

        <div className="flex justify-end gap-3 pt-4 border-t">

            <button
                type="button"
                onClick={onCancel}
                disabled={submitting}
                className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
                Cancel
            </button>

            <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >

                {submitting
                    ? "Saving..."
                    : "Save"}

            </button>

        </div>

    );

}


// =============================================================
// LOADING
// =============================================================

function Loading ({
    text,
}) {

    return (

        <div className="py-12 text-center text-gray-500">
            {text}
        </div>

    );

}


// =============================================================
// EMPTY ROW
// =============================================================

function EmptyRow ({
    colSpan,
    text,
}) {

    return (

        <tr>

            <td
                colSpan={colSpan}
                className="px-6 py-16 text-center text-gray-500"
            >
                {text}
            </td>

        </tr>

    );

}


// =============================================================
// TABLE HEADER
// =============================================================

function Th ({
    children,
}) {

    return (

        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 whitespace-nowrap">
            {children}
        </th>

    );

}


// =============================================================
// TABLE DATA
// =============================================================

function Td ({
    children,
}) {

    return (

        <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
            {children}
        </td>

    );

}


// =============================================================
// API ERROR
// =============================================================

function getApiError (error) {

    const data = error.response?.data;

    if (!data) {
        return "Something went wrong.";
    }

    if (typeof data === "string") {
        return data;
    }

    if (data.detail) {
        return data.detail;
    }

    const firstKey = Object.keys(data)[0];

    if (firstKey) {

        const value = data[firstKey];

        if (Array.isArray(value)) {
            return value[0];
        }

        return String(value);

    }

    return "Something went wrong.";

}


export default Exams;