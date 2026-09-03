import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

function StudentLayout() {
    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />

            <main className="flex-1 p-6">
                <Outlet />
            </main>
        </div>
    );
}

export default StudentLayout;