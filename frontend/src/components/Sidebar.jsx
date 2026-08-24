import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("user");

        navigate("/");
    };

    const menuItems = [
        { name: "Dashboard", path: "/admin" },
        { name: "Students", path: "/admin/students" },
        { name: "Teachers", path: "/admin/teachers" },
        { name: "Admissions", path: "/admin/admissions" },
        { name: "Classes", path: "/admin/classes" },
        { name: "Sections", path: "/admin/sections" },
        { name: "Subjects", path: "/admin/subjects" },
        { name: "Attendance", path: "/admin/attendance" },
        { name: "Fees", path: "/admin/fees" },
        { name: "Exams", path: "/admin/exams" },
        { name: "Results", path: "/admin/results" },
        { name: "Notices", path: "/admin/notices" },
        { name: "Settings", path: "/admin/settings" },
    ];

    return (
        <aside className="w-64 min-h-screen bg-blue-700 text-white p-5">

            <h1 className="text-2xl font-bold mb-8">
                School Management
            </h1>

            <nav className="space-y-2">

                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `block px-4 py-3 rounded-lg transition ${
                                isActive
                                    ? "bg-blue-900"
                                    : "hover:bg-blue-600"
                            }`
                        }
                    >
                        {item.name}
                    </NavLink>
                ))}

            </nav>

            <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 mt-8 rounded-lg bg-red-500 hover:bg-red-600"
            >
                Logout
            </button>

        </aside>
    );
}

export default Sidebar;