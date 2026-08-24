import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Students () {

    const navigate = useNavigate();

    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [classFilter, setClassFilter] = useState("all");
    const [sectionFilter, setSectionFilter] = useState("all");


    useEffect(() => {

        const getStudents = async () => {

            try {

                const response = await api.get("students/");

                setStudents(response.data);

            } catch (error) {

                console.log(error.response?.data);

                setError("Failed to load students");

            } finally {

                setLoading(false);

            }
        };

        getStudents();

    }, []);


    // Search + Filter
    const filteredStudents = students.filter((student) => {

        const fullName =
            `${student.user?.first_name || ""} ${student.user?.last_name || ""}`;

        const searchText = search.toLowerCase();


        const matchesSearch =
            student.student_id?.toLowerCase().includes(searchText) ||
            fullName.toLowerCase().includes(searchText) ||
            student.roll_number?.toString().includes(searchText);


        const matchesClass =
            classFilter === "all" ||
            student.school_class?.id?.toString() === classFilter;


        const matchesSection =
            sectionFilter === "all" ||
            student.section?.id?.toString() === sectionFilter;


        return matchesSearch && matchesClass && matchesSection;

    });


    if (loading) {

        return (
            <div className="p-6">

                <p className="text-gray-500">
                    Loading students...
                </p>

            </div>
        );

    }


    if (error) {

        return (
            <div className="p-6">

                <p className="text-red-600">
                    {error}
                </p>

            </div>
        );

    }


    return (
        <div className="space-y-6">


            {/* Header */}

            <div className="flex items-center justify-between">

                <div>

                    <h1 className="text-2xl font-bold text-gray-800">
                        Students
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Manage all students
                    </p>

                </div>

            </div>


            {/* Search & Filters */}

            <div className="bg-white rounded-xl shadow p-5">

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">


                    {/* Search */}

                    <div>

                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Search
                        </label>

                        <input
                            type="text"
                            placeholder="Search by ID, name or roll number"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>


                    {/* Class */}

                    <div>

                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Class
                        </label>

                        <select
                            value={classFilter}
                            onChange={(e) => setClassFilter(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                        >

                            <option value="all">
                                All Classes
                            </option>

                            <option value="1">
                                Class 1
                            </option>

                            <option value="2">
                                Class 2
                            </option>

                            <option value="3">
                                Class 3
                            </option>

                            <option value="4">
                                Class 4
                            </option>

                            <option value="5">
                                Class 5
                            </option>

                            <option value="6">
                                Class 6
                            </option>

                            <option value="7">
                                Class 7
                            </option>

                            <option value="8">
                                Class 8
                            </option>

                            <option value="9">
                                Class 9
                            </option>

                            <option value="10">
                                Class 10
                            </option>

                            <option value="11">
                                Class 11
                            </option>

                            <option value="12">
                                Class 12
                            </option>

                        </select>

                    </div>


                    {/* Section */}

                    <div>

                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Section
                        </label>

                        <select
                            value={sectionFilter}
                            onChange={(e) => setSectionFilter(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                        >

                            <option value="all">
                                All Sections
                            </option>

                            <option value="1">
                                Section A
                            </option>

                            <option value="2">
                                Section B
                            </option>

                            <option value="3">
                                Section C
                            </option>

                            <option value="4">
                                Section D
                            </option>

                        </select>

                    </div>

                </div>

            </div>


            {/* Students Table */}

            <div className="bg-white rounded-xl shadow overflow-hidden">

                <div className="px-6 py-4 border-b">

                    <h2 className="font-semibold text-gray-800">
                        Student List
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                        {filteredStudents.length} students found
                    </p>

                </div>


                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead className="bg-gray-50">

                            <tr>

                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                    Student ID
                                </th>

                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                    Name
                                </th>

                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                    Roll No.
                                </th>

                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                    Class
                                </th>

                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                    Section
                                </th>

                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                    Admission Date
                                </th>

                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                    Actions
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {filteredStudents.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="7"
                                        className="text-center py-10 text-gray-500"
                                    >
                                        No students found
                                    </td>

                                </tr>

                            ) : (

                                filteredStudents.map((student) => (

                                    <tr
                                        key={student.id}
                                        className="border-t hover:bg-gray-50"
                                    >

                                        {/* Student ID */}

                                        <td className="px-6 py-4 font-medium text-gray-800">
                                            {student.student_id}
                                        </td>


                                        {/* Name */}

                                        <td className="px-6 py-4">

                                            <div className="font-medium text-gray-800">

                                                {student.user?.first_name || "N/A"}{" "}
                                                {student.user?.last_name || ""}

                                            </div>

                                            <div className="text-sm text-gray-500">

                                                {student.user?.email || "No email"}

                                            </div>

                                        </td>


                                        {/* Roll Number */}

                                        <td className="px-6 py-4 text-gray-600">
                                            {student.roll_number}
                                        </td>


                                        {/* Class */}

                                        <td className="px-6 py-4 text-gray-600">
                                            {student.school_class?.name || "N/A"}
                                        </td>


                                        {/* Section */}

                                        <td className="px-6 py-4 text-gray-600">
                                            {student.section?.name || "N/A"}
                                        </td>


                                        {/* Admission Date */}

                                        <td className="px-6 py-4 text-gray-600">
                                            {student.admission_date}
                                        </td>


                                        {/* Actions */}

                                        <td className="px-6 py-4">

                                            <div className="flex gap-2">


                                                {/* View */}

                                                <button
                                                    onClick={() =>
                                                        navigate(
                                                            `/admin/students/${student.id}`
                                                        )
                                                    }
                                                    className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                                                >
                                                    View
                                                </button>


                                                {/* Edit */}

                                                <button
                                                    onClick={() =>
                                                        navigate(
                                                            `/admin/students/${student.id}/edit`
                                                        )
                                                    }
                                                    className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                                                >
                                                    Edit
                                                </button>


                                            </div>

                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
}

export default Students;