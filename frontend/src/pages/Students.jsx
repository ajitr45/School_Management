import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Students () {

    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [classes, setClasses] = useState([]);
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [classFilter, setClassFilter] = useState("all");
    const [sectionFilter, setSectionFilter] = useState("all");
    const [academicYearFilter, setAcademicYearFilter] = useState("all");


    // =========================
    // GET DATA
    // =========================

    useEffect(() => {

        const getData = async () => {

            try {

                const [
                    studentsResponse,
                    classesResponse,
                    sectionsResponse
                ] = await Promise.all([

                    api.get("students/"),
                    api.get("academics/classes/"),
                    api.get("academics/sections/")

                ]);

                setStudents(studentsResponse.data);
                setClasses(classesResponse.data);
                setSections(sectionsResponse.data);

            } catch (error) {

                console.log(error.response?.data);

                setError("Failed to load students");

            } finally {

                setLoading(false);

            }

        };

        getData();

    }, []);


    // =========================
    // ACADEMIC YEARS
    // =========================

    const academicYears = [
        ...new Set(
            students
                .map(
                    (student) =>
                        student.admission?.academic_year
                )
                .filter(Boolean)
        )
    ];


    // =========================
    // AVAILABLE SECTIONS
    // =========================

    const availableSections =
        classFilter === "all"
            ? sections
            : sections.filter(
                (section) =>
                    section.school_class ===
                    Number(classFilter)
            );


    // =========================
    // FILTER STUDENTS
    // =========================

    const filteredStudents = students.filter((student) => {

        const searchText = search.toLowerCase();


        const matchesSearch =
            student.student_id
                ?.toLowerCase()
                .includes(searchText) ||

            student.admission?.student_name
                ?.toLowerCase()
                .includes(searchText) ||

            student.admission?.mobile
                ?.toLowerCase()
                .includes(searchText);


        const matchesClass =
            classFilter === "all" ||
            student.school_class === Number(classFilter);


        const matchesSection =
            sectionFilter === "all" ||
            student.section === Number(sectionFilter);


        const matchesAcademicYear =
            academicYearFilter === "all" ||
            student.admission?.academic_year ===
            academicYearFilter;


        return (
            matchesSearch &&
            matchesClass &&
            matchesSection &&
            matchesAcademicYear
        );

    });


    // =========================
    // CLASS FILTER CHANGE
    // =========================

    const handleClassFilterChange = (value) => {

        setClassFilter(value);

        setSectionFilter("all");

    };


    // =========================
    // LOADING
    // =========================

    if (loading) {

        return (
            <div className="p-6">

                <p className="text-gray-500">
                    Loading students...
                </p>

            </div>
        );

    }


    // =========================
    // ERROR
    // =========================

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


            {/* HEADER */}

            <div>

                <h1 className="text-2xl font-bold text-gray-800">
                    Students
                </h1>

                <p className="text-gray-500 mt-1">
                    Manage all students
                </p>

            </div>



            {/* FILTERS */}

            <div className="bg-white rounded-xl shadow p-5">

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">


                    {/* SEARCH */}

                    <div>

                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Search
                        </label>

                        <input
                            type="text"
                            placeholder="Student ID, name or mobile"
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>



                    {/* CLASS */}

                    <div>

                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Class
                        </label>

                        <select
                            value={classFilter}
                            onChange={(e) =>
                                handleClassFilterChange(
                                    e.target.value
                                )
                            }
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                        >

                            <option value="all">
                                All Classes
                            </option>

                            {classes.map((schoolClass) => (

                                <option
                                    key={schoolClass.id}
                                    value={schoolClass.id}
                                >
                                    {schoolClass.name}
                                </option>

                            ))}

                        </select>

                    </div>



                    {/* SECTION */}

                    <div>

                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Section
                        </label>

                        <select
                            value={sectionFilter}
                            onChange={(e) =>
                                setSectionFilter(
                                    e.target.value
                                )
                            }
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                        >

                            <option value="all">
                                All Sections
                            </option>

                            {availableSections.map((section) => (

                                <option
                                    key={section.id}
                                    value={section.id}
                                >
                                    Section {section.name}
                                </option>

                            ))}

                        </select>

                    </div>



                    {/* ACADEMIC YEAR */}

                    <div>

                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Academic Year
                        </label>

                        <select
                            value={academicYearFilter}
                            onChange={(e) =>
                                setAcademicYearFilter(
                                    e.target.value
                                )
                            }
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                        >

                            <option value="all">
                                All Academic Years
                            </option>

                            {academicYears.map((year) => (

                                <option
                                    key={year}
                                    value={year}
                                >
                                    {year}
                                </option>

                            ))}

                        </select>

                    </div>

                </div>

            </div>



            {/* STUDENT TABLE */}

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
                                    Student Name
                                </th>

                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                    Class
                                </th>

                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                    Section
                                </th>

                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                    Academic Year
                                </th>

                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                    Gender
                                </th>

                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                    Mobile
                                </th>

                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                    Action
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {filteredStudents.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="8"
                                        className="text-center py-10 text-gray-500"
                                    >
                                        No students found
                                    </td>

                                </tr>

                            ) : (

                                filteredStudents.map((student) => {

                                    const schoolClass =
                                        classes.find(
                                            (item) =>
                                                item.id ===
                                                student.school_class
                                        );


                                    const section =
                                        sections.find(
                                            (item) =>
                                                item.id ===
                                                student.section
                                        );


                                    return (

                                        <tr
                                            key={student.id}
                                            className="border-t hover:bg-gray-50"
                                        >

                                            {/* STUDENT ID */}

                                            <td className="px-6 py-4 font-medium text-gray-800">
                                                {student.student_id || "N/A"}
                                            </td>


                                            {/* NAME */}

                                            <td className="px-6 py-4 text-gray-700">
                                                {student.admission?.student_name || "N/A"}
                                            </td>


                                            {/* CLASS */}

                                            <td className="px-6 py-4 text-gray-600">
                                                {schoolClass?.name || "N/A"}
                                            </td>


                                            {/* SECTION */}

                                            <td className="px-6 py-4 text-gray-600">
                                                {section
                                                    ? `Section ${section.name}`
                                                    : "N/A"}
                                            </td>


                                            {/* ACADEMIC YEAR */}

                                            <td className="px-6 py-4 text-gray-600">
                                                {student.admission?.academic_year || "N/A"}
                                            </td>


                                            {/* GENDER */}

                                            <td className="px-6 py-4 text-gray-600">
                                                {student.admission?.gender || "N/A"}
                                            </td>


                                            {/* MOBILE */}

                                            <td className="px-6 py-4 text-gray-600">
                                                {student.admission?.student_mobile || "N/A"}
                                            </td>


                                            {/* ACTION */}

                                            <td className="px-6 py-4">

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

                                            </td>

                                        </tr>

                                    );

                                })

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
}

export default Students;