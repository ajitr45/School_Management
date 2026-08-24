import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Admissions() {

    const navigate = useNavigate();

    const [admissions, setAdmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [academicYearFilter, setAcademicYearFilter] = useState("all");


    // Fetch admissions
    useEffect(() => {

        const getAdmissions = async () => {

            try {

                const response = await api.get("admissions/");

                setAdmissions(response.data);

            } catch (error) {

                console.log(error.response?.data);

                setError("Failed to load admissions");

            } finally {

                setLoading(false);

            }
        };

        getAdmissions();

    }, []);


    // Filter admissions
    const filteredAdmissions = admissions.filter((admission) => {

        const searchText = search.toLowerCase();

        const matchesSearch =
            admission.application_no
                ?.toLowerCase()
                .includes(searchText) ||

            admission.student_name
                ?.toLowerCase()
                .includes(searchText);


        const matchesStatus =
            statusFilter === "all" ||
            admission.status === statusFilter;


        const matchesAcademicYear =
            academicYearFilter === "all" ||
            admission.academic_year === academicYearFilter;


        return (
            matchesSearch &&
            matchesStatus &&
            matchesAcademicYear
        );

    });


    // Get unique academic years
    const academicYears = [
        ...new Set(
            admissions.map(
                (admission) => admission.academic_year
            )
        )
    ];


    // Loading
    if (loading) {

        return (
            <div className="p-6">

                <p className="text-gray-500">
                    Loading admissions...
                </p>

            </div>
        );

    }


    // Error
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

            <div>

                <h1 className="text-2xl font-bold text-gray-800">
                    Admissions
                </h1>

                <p className="text-gray-500 mt-1">
                    Manage all admission applications
                </p>

            </div>


            {/* Filters */}

            <div className="bg-white rounded-xl shadow p-5">

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">


                    {/* Search */}

                    <div>

                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Search
                        </label>

                        <input
                            type="text"
                            placeholder="Application No. or student name"
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>


                    {/* Status */}

                    <div>

                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Status
                        </label>

                        <select
                            value={statusFilter}
                            onChange={(e) =>
                                setStatusFilter(e.target.value)
                            }
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                        >

                            <option value="all">
                                All Status
                            </option>

                            <option value="PENDING">
                                Pending
                            </option>

                            <option value="APPROVED">
                                Approved
                            </option>

                            <option value="REJECTED">
                                Rejected
                            </option>

                        </select>

                    </div>


                    {/* Academic Year */}

                    <div>

                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Academic Year
                        </label>

                        <div className="relative">

                            {/* Calendar Icon */}

                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                📅
                            </span>

                            <select value={academicYearFilter}
                                onChange={(e) =>
                                    setAcademicYearFilter(e.target.value)
                                }
                                className="w-full appearance-none border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
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

                            {/* Dropdown Arrow */}

                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                                ▼
                            </span>

                        </div>

                    </div>

                </div>

            </div>


            {/* Admission Table */}

            <div className="bg-white rounded-xl shadow overflow-hidden">


                {/* Table Header */}

                <div className="px-6 py-4 border-b">

                    <h2 className="font-semibold text-gray-800">
                        Admission Applications
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                        {filteredAdmissions.length} applications found
                    </p>

                </div>


                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead className="bg-gray-50">

                            <tr>

                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                    Application No.
                                </th>

                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                    Student Name
                                </th>

                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                    Class
                                </th>

                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                    Academic Year
                                </th>

                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                    Applied Date
                                </th>

                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                    Status
                                </th>

                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                    Action
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {filteredAdmissions.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="7"
                                        className="text-center py-10 text-gray-500"
                                    >
                                        No admissions found
                                    </td>

                                </tr>

                            ) : (

                                filteredAdmissions.map((admission) => (

                                    <tr
                                        key={admission.id}
                                        className="border-t hover:bg-gray-50"
                                    >

                                        {/* Application No. */}

                                        <td className="px-6 py-4 font-medium text-gray-800">
                                            {admission.application_no}
                                        </td>


                                        {/* Student Name */}

                                        <td className="px-6 py-4 text-gray-700">
                                            {admission.student_name}
                                        </td>


                                        {/* Class */}

                                        <td className="px-6 py-4 text-gray-600">
                                            {admission.applying_class}
                                        </td>


                                        {/* Academic Year */}

                                        <td className="px-6 py-4 text-gray-600">
                                            {admission.academic_year}
                                        </td>


                                        {/* Applied Date */}

                                        <td className="px-6 py-4 text-gray-600">
                                            {new Date(
                                                admission.applied_date
                                            ).toLocaleDateString()}
                                        </td>


                                        {/* Status */}

                                        <td className="px-6 py-4">

                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                    admission.status === "PENDING"
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : admission.status === "APPROVED"
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-red-100 text-red-700"
                                                }`}
                                            >
                                                {admission.status}
                                            </span>

                                        </td>


                                        {/* Action */}

                                        <td className="px-6 py-4">

                                            <button
                                                onClick={() =>
                                                    navigate(`/admin/admissions/${admission.id}`)
                                                }
                                                className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                                            >
                                                View
                                            </button>

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

export default Admissions;