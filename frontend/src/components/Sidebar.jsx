import { NavLink, useNavigate } from "react-router-dom";

function Sidebar () {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("user");

        navigate("/");
    };

    const user = JSON.parse(localStorage.getItem("user"));
    const role = user?.role;

    const adminMenuItems = [
        {
            name: "Dashboard",
            path: "/admin",
        },
        {
            name: "Students",
            path: "/admin/students",
        },
        {
            name: "Teachers",
            path: "/admin/teachers",
        },
        {
            name: "Admissions",
            path: "/admin/admissions",
        },
        {
            name: "Classes",
            path: "/admin/classes",
        },
        {
            name: "Sections",
            path: "/admin/sections",
        },
        {
            name: "Subjects",
            path: "/admin/subjects",
        },
        {
            name: "Attendance",
            path: "/admin/attendance",
        },
        {
            name: "Fees",
            path: "/admin/fees",
        },
        {
            name: "Exams",
            path: "/admin/exams",
        },
        {
            name: "Timetable",
            path: "/admin/timetable",
        },
        {
            name: "Homework",
            path: "/admin/homework",
        },
        {
            name: "Study Material",
            path: "/admin/study-material",
        },
        {
            name: "Notices",
            path: "/admin/notices",
        },
    ];

    const teacherMenuItems = [
        {
            name: "Dashboard",
            path: "/teacher",
        },
        {
            name: "My Classes",
            path: "/teacher/classes",
        },
        {
            name: "Students",
            path: "/teacher/students",
        },
        {
            name: "Attendance",
            path: "/teacher/attendance",
        },
        {
            name: "Homework",
            path: "/teacher/homework",
        },
        {
            name: "Study Material",
            path: "/teacher/study-material",
        },
        {
            name: "Timetable",
            path: "/teacher/timetable",
        },
        {
            name: "Exams",
            path: "/teacher/exams",
        },
        {
            name: "Notices",
            path: "/teacher/notices",
        },
    ];

    const studentMenuItems = [
        {
            name: "Dashboard",
            path: "/student",
        },
        {
            name: "Profile",
            path: "/student/profile",
        },
        {
            name: "Attendance",
            path: "/student/attendance",
        },
        {
            name: "Homework",
            path: "/student/homework",
        },
        {
            name: "Study Material",
            path: "/student/study-material",
        },
        {
            name: "Timetable",
            path: "/student/timetable",
        },
        {
            name: "Exams",
            path: "/student/exams",
        },
        {
            name: "Notices",
            path: "/student/notices",
        },
    ];

    const menuItems =
        role === "ADMIN"
            ? adminMenuItems
            : role === "TEACHER"
                ? teacherMenuItems
                : role === "STUDENT"
                    ? studentMenuItems
                    : [];

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
                            `block px-4 py-3 rounded-lg transition ${isActive
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
                type="button"
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 mt-8 rounded-lg bg-red-500 hover:bg-red-600 transition"
            >
                Logout
            </button>

        </aside>
    );
}

export default Sidebar;