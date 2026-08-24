import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function AdminLayout() {
    return (
        <div className="min-h-screen bg-gray-100 flex">

            <Sidebar />

            <div className="flex-1">

                {/* Top Navbar */}
                <header className="bg-white shadow px-6 py-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Admin Panel
                    </h2>
                </header>

                {/* Page Content */}
                <main className="p-6">
                    <Outlet />
                </main>

            </div>

        </div>
    );
}

export default AdminLayout;