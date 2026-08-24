import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Students from "./pages/Students";
import StudentDetail from "./pages/StudentDetail";
import EditStudent from "./pages/EditStudent";
import Admissions from "./pages/Admissions";
import AdmissionDetail from "./pages/AdmissionDetail";



function App() {
    return (
        <BrowserRouter>

            <Routes>

                {/* Login */}
                <Route
                    path="/"
                    element={<Login />}
                />


                {/* Admin Routes */}
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute allowedRole="ADMIN">
                            <AdminLayout />
                        </ProtectedRoute>
                    }
                >

                    {/* /admin */}
                    <Route
                        index
                        element={<AdminDashboard />}
                    />

                    {/* /admin/students */}
                    <Route
                        path="students"
                        element={<Students />}
                    />

                    <Route 
                        path="students/:id"
                        element={<StudentDetail/>}
                    />

                    <Route
                        path="students/:id/edit"
                        element={<EditStudent/>}
                    />

                    <Route  
                        path="admissions"
                        element={<Admissions/>}
                    />

                    <Route 
                        path="admissions/:id"
                        element={<AdmissionDetail/>}
                    />

                </Route>

            </Routes>

        </BrowserRouter>
    );
}

export default App;