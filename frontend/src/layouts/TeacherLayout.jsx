import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

function TeacherLayout () {
    return (
        <div className="flex min-h-screen bg-gray-100">

            <Sidebar />

            <main className="flex-1 p-6">
                <Outlet />
            </main>

        </div>
    );
}

export default TeacherLayout;