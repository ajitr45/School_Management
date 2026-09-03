import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Students from "./pages/Students";
import StudentDetail from "./pages/StudentDetail";
import StudentEdit from "./pages/StudentEdit";
import Admissions from "./pages/Admissions";
import AdmissionDetail from "./pages/AdmissionDetail";
import Classes from "./pages/Classes";
import Sections from "./pages/Sections";
import Subjects from "./pages/Subjects";
import AdmissionForm from "./pages/AdmissionForm";
import TeacherCreate from "./pages/teachers/TeacherCreate";
import TeacherDetail from "./pages/teachers/TeacherDetail";
import TeacherEdit from "./pages/teachers/TeacherEdit";
import Teachers from "./pages/teachers/Teachers";
import TeacherAssignment from "./pages/teachers/TeacherAssignment";
import TeacherAssignments from "./pages/teachers/TeacherAssignments";
import Attendance from "./pages/attendance/Attendance";
import AttendanceCreate from "./pages/attendance/AttendanceCreate";
import AttendanceDetail from "./pages/attendance/AttendanceDetail";
import AttendanceEdit from "./pages/attendance/AttendanceEdit";
import Fees from "./pages/fees/Fees";
import Exams from "./pages/Exams/Exams";
import ReportCard from "./pages/Exams/ReportCard";
import Timetable from "./pages/timetable/Timetables";
import TimetableCreate from "./pages/timetable/TimetableCreate";
import TimetableDetail from "./pages/timetable/TimetableDetail";
import TimetableEdit from "./pages/timetable/TimetableEdit";
import Homework from "./pages/homework/Homework";
import HomeworkCreate from "./pages/homework/HomeworkCreate";
import HomeworkDetail from "./pages/homework/HomeworkDetail";
import HomeworkEdit from "./pages/homework/HomeworkEdit";
import StudyMaterial from "./pages/study-material/StudyMaterial";
import ChapterCreate from "./pages/study-material/ChapterCreate";
import ChapterDetail from "./pages/study-material/ChapterDetail";
import ChapterEdit from "./pages/study-material/ChapterEdit";
import StudyMaterialCreate from "./pages/study-material/StudyMaterialCreate";
import StudyMaterialDetail from "./pages/study-material/StudyMaterialDetail";
import StudyMaterialEdit from "./pages/study-material/StudyMaterialEdit";
import Notices from "./pages/notices/Notices";
import NoticeCreate from "./pages/notices/NoticeCreate";
import NoticeDetail from "./pages/notices/NoticeDetail";
import NoticeEdit from "./pages/notices/NoticeEdit";
import TeacherDashboard from "./pages/TeacherDashboard";
import TeacherLayout from "./layouts/TeacherLayout";
import TeacherClasses from "./pages/teacher/TeacherClasses";
import TeacherStudents from "./pages/teacher/TeacherStudents";
import TeacherAttendance from "./pages/teacher/TeacherAttendance";
import TeacherStudentDetail from "./pages/teacher/TeacherStudentDetail";
import TeacherHomework from "./pages/teacher/TeacherHomework";
import TeacherHomeworkCreate from "./pages/teacher/TeacherHomeworkCreate";
import TeacherHomeworkDetail from "./pages/teacher/TeacherHomeworkDetail";
import TeacherHomeworkEdit from "./pages/teacher/TeacherHomeworkEdit";
import TeacherStudyMaterial from "./pages/teacher/TeacherStudyMaterial";
import TeacherTimetable from "./pages/teacher/TeacherTimetable";
import TeacherExams from "./pages/teacher/TeacherExams";
import TeacherNotices from "./pages/teacher/TeacherNotices";
import StudentLayout from "./layouts/StudentLayout";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentProfile from "./pages/student/StudentProfile";
import StudentAttendance from "./pages/student/StudentAttendance";
import StudentHomework from "./pages/student/StudentHomework";
import StudentHomeworkDetail from "./pages/student/StudentHomeworkDetail";
import StudentStudyMaterial from "./pages/student/StudentStudyMaterial";
import StudentStudyMaterialDetail from "./pages/student/StudentStudyMaterialDetail";
import StudentTimetable from "./pages/student/StudentTimetable";
import StudentExams from "./pages/student/StudentExams";
import StudentNotices from "./pages/student/StudentNotices";
import StudentNoticeDetail from "./pages/student/StudentNoticeDetail";
import PublicLayout from "./layouts/PublicLayout";
import Home from "./pages/Home";
import AdmissionSuccess from "./pages/AdmissionSuccess";


function App () {
    return (
        <BrowserRouter>

            <Routes>

                {/* Public Routes */}

                <Route path="/" element={<PublicLayout />}>

                    <Route index element={<Home />} />

                    <Route path="admission" element={<AdmissionForm />} />

                    <Route path="admission/success" element={<AdmissionSuccess />} />

                <Route path="about" element={<div>About Us</div>} />

                <Route path="contact" element={<div>Contact Us</div>} />        

                </Route>



                {/* Login */}

                <Route path="/login" element={<Login />} />

                {/* Admin Routes */}

                <Route
                    path="/admin"
                    element={<ProtectedRoute allowedRole="ADMIN"> <AdminLayout /> </ProtectedRoute>}>

                    {/* /admin */}
                    <Route index element={<AdminDashboard />} />

                    {/* /admin/students */}

                    <Route path="students" element={<Students />} />

                    <Route path="students/:id" element={<StudentDetail />} />

                    <Route path="students/:id/edit" element={<StudentEdit />} />

                    <Route path="admissions" element={<Admissions />} />

                    <Route path="admissions/:id" element={<AdmissionDetail />} />

                    <Route path="classes" element={<Classes />} />

                    <Route path="sections" element={<Sections />} />

                    <Route path="subjects" element={<Subjects />} />

                    <Route path="admissions/apply/" element={<AdmissionForm />} />

                    <Route path="teachers" element={<Teachers />} />

                    <Route path="teachers/create/" element={<TeacherCreate />} />

                    <Route path="teachers/:id" element={<TeacherDetail />} />

                    <Route path="teachers/:id/edit" element={<TeacherEdit />} />

                    <Route path="teachers/:id/assign" element={<TeacherAssignment />} />

                    <Route path="teachers/assignments" element={<TeacherAssignments />} />

                    <Route path="attendance" element={<Attendance />} />

                    <Route path="attendance/create" element={<AttendanceCreate />} />

                    <Route path="attendance/:id" element={<AttendanceDetail />} />

                    <Route path="attendance/:id/edit" element={<AttendanceEdit />} />

                    <Route path="fees" element={<Fees />} />

                    <Route path="exams" element={<Exams />} />

                    <Route path="exams/report-card/:studentId/:examId" element={<ReportCard />} />

                    <Route path="timetable" element={<Timetable />} />

                    <Route path="timetable/create" element={<TimetableCreate />} />

                    <Route path="timetable/:id" element={<TimetableDetail />} />

                    <Route path="timetable/:id/edit" element={<TimetableEdit />} />

                    <Route path="homework" element={<Homework />} />

                    <Route path="homework/create" element={<HomeworkCreate />} />

                    <Route path="homework/:id" element={<HomeworkDetail />} />

                    <Route path="homework/:id/edit" element={<HomeworkEdit />} />

                    <Route path="study-materials" element={<StudyMaterial />} />

                    <Route path="study-materials/chapters/create" element={<ChapterCreate />} />

                    <Route path="study-materials/chapters/:id" element={<ChapterDetail />} />

                    <Route path="study-materials/chapters/:id/edit" element={<ChapterEdit />} />

                    <Route path="study-materials/create" element={<StudyMaterialCreate />} />

                    <Route path="study-materials/:id" element={<StudyMaterialDetail />} />

                    <Route path="study-materials/:id/edit" element={<StudyMaterialEdit />} />

                    <Route path="notices" element={<Notices />} />

                    <Route path="notices/create" element={<NoticeCreate />} />

                    <Route path="notices/:id" element={<NoticeDetail />} />

                    <Route path="notices/:id/edit" element={<NoticeEdit />} />

                </Route>

                {/*  Teacher route */}

                <Route path="/teacher" element={<ProtectedRoute allowedRole="TEACHER"> <TeacherLayout /></ProtectedRoute>}>

                    <Route index element={<TeacherDashboard />} />

                    <Route path="classes" element={<TeacherClasses />} />

                    <Route path="students" element={<TeacherStudents />} />

                    <Route path="attendance" element={<TeacherAttendance />} />

                    <Route path="students/:id" element={<TeacherStudentDetail />} />

                    <Route path="homework" element={<TeacherHomework />} />

                    <Route path="homework/create" element={<TeacherHomeworkCreate />} />

                    <Route path="homework/:id" element={<TeacherHomeworkDetail />} />

                    <Route path="homework/:id/edit" element={<TeacherHomeworkEdit />} />

                    <Route path="study-materials" element={<TeacherStudyMaterial />} />

                    <Route path="timetable" element={<TeacherTimetable />} />

                    <Route path="exams" element={<TeacherExams />} />

                    <Route path="notices" element={<TeacherNotices />} />

                </Route>


                {/*  Student route */}

                <Route path="/student" element={<ProtectedRoute allowedRole="STUDENT"> < StudentLayout /> </ProtectedRoute>}>

                    <Route index element={<StudentDashboard />} />

                    <Route path="profile" element={<StudentProfile />} />

                    <Route path="attendance" element={<StudentAttendance />} />

                    <Route path="homework" element={<StudentHomework />} />

                    <Route path="homework/:id" element={<StudentHomeworkDetail />} />

                    <Route path="study-materials" element={<StudentStudyMaterial />} />

                    <Route path="study-materials/:id" element={<StudentStudyMaterialDetail />} />

                    <Route path="timetable" element={<StudentTimetable />} />

                    <Route path="exams" element={<StudentExams />} />

                    <Route path="notices" element={<StudentNotices />} />

                    <Route path="notices/:id" element={<StudentNoticeDetail />} />




                </Route>

            </Routes>

        </BrowserRouter>
    );
}

export default App;