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



function App() {
    return (
        <BrowserRouter>

            <Routes>

                {/* Login */}

                <Route path="/" element={<Login />}/>

                {/* Admin Routes */}

                <Route
                    path="/admin"
                    element={<ProtectedRoute allowedRole="ADMIN"> <AdminLayout /> </ProtectedRoute>}>

                    {/* /admin */}
                    <Route index element={<AdminDashboard />}/>

                    {/* /admin/students */}

                    <Route path="students" element={<Students />}/>

                    <Route path="students/:id" element={<StudentDetail/>}/>

                    <Route path="students/:id/edit" element={<StudentEdit/>}/>

                    <Route  path="admissions" element={<Admissions/>}/>

                    <Route path="admissions/:id" element={<AdmissionDetail/>}/>

                    <Route path="Classes" element={<Classes />}/>

                    <Route path="sections" element={<Sections />} />

                    <Route path="subjects" element={<Subjects />} />

                    <Route path="admissions/apply/" element={<AdmissionForm />} />

                    <Route path="teachers" element={<Teachers/>} />

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
                    

                </Route>

            </Routes>

        </BrowserRouter>
    );
}

export default App;