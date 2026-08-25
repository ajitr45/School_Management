import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Admissions () {

    const navigate = useNavigate();

    const [admissions, setAdmissions] = useState([]);
    const [classes, setClasses] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [academicYearFilter, setAcademicYearFilter] = useState("all");


    // =========================
    // GET ADMISSIONS + CLASSES
    // =========================

    useEffect(() => {

        const getData = async () => {

            try {

                const [
                    admissionsResponse,
                    classesResponse
                ] = await Promise.all([

                    api.get("admissions/"),
                    api.get("academics/classes/")

                ]);


                setAdmissions(admissionsResponse.data);
                setClasses(classesResponse.data);


            } catch (error) {

                console.log(error.response?.data);

                setError("Failed to load admissions");

            } finally {

                setLoading(false);

            }

        };

        getData();

    }, []);


    // =========================
    // GET CLASS NAME
    // =========================

    const getClassName = (classId) => {

        const schoolClass = classes.find(
            (item) =>
                item.id === Number(classId)
        );

        return schoolClass?.name || "N/A";

    };


    // =========================
    // ACADEMIC YEARS
    // =========================

    const academicYears = [
        ...new Set(
            admissions
                .map(
                    (admission) =>
                        admission.academic_year
                )
                .filter(Boolean)
        )
    ];


    // =========================
    // FILTER ADMISSIONS
    // =========================

    const filteredAdmissions = admissions.filter(
        (admission) => {

            const searchText =
                search.trim().toLowerCase();


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
                admission.academic_year ===
                academicYearFilter;


            return (
                matchesSearch &&
                matchesStatus &&
                matchesAcademicYear
            );

        }
    );


    // =========================
    // LOADING
    // =========================

    if (loading) {

        return (
            <div className="p-6">

                <p className="text-gray-500">
                    Loading admissions...
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


            {/* =========================
                HEADER
            ========================= */}

            <div>

                <h1 className="text-2xl font-bold text-gray-800">
                    Admissions
                </h1>

                <p className="text-gray-500 mt-1">
                    Manage all admission applications
                </p>

            </div>



            {/* =========================
                FILTERS
            ========================= */}

            <div className="bg-white rounded-xl shadow p-5">

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">


                    {/* =========================
                        SEARCH
                    ========================= */}

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



                    {/* =========================
                        STATUS
                    ========================= */}

                    <div>

                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Status
                        </label>

                        <select
                            value={statusFilter}
                            onChange={(e) =>
                                setStatusFilter(
                                    e.target.value
                                )
                            }
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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



                    {/* =========================
                        ACADEMIC YEAR
                    ========================= */}

                    <div>

                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Academic Year
                        </label>

                        <div className="relative">

                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                                📅
                            </span>


                            <select
                                value={academicYearFilter}
                                onChange={(e) =>
                                    setAcademicYearFilter(
                                        e.target.value
                                    )
                                }
                                className="w-full appearance-none border border-gray-300 rounded-lg pl-10 pr-10 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
                            >

                                <option value="all">
                                    All Academic Years
                                </option>


                                {academicYears.map(
                                    (year) => (

                                        <option
                                            key={year}
                                            value={year}
                                        >
                                            {year}
                                        </option>

                                    )
                                )}

                            </select>


                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                                ▼
                            </span>

                        </div>

                    </div>

                </div>

            </div>



            {/* =========================
                ADMISSION TABLE
            ========================= */}

            <div className="bg-white rounded-xl shadow overflow-hidden">


                {/* TABLE HEADER */}

                <div className="px-6 py-4 border-b">

                    <h2 className="font-semibold text-gray-800">
                        Admission Applications
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                        {filteredAdmissions.length} applications found
                    </p>

                </div>



                {/* TABLE */}

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

                                filteredAdmissions.map(
                                    (admission) => (

                                        <tr
                                            key={admission.id}
                                            className="border-t hover:bg-gray-50"
                                        >


                                            {/* APPLICATION NO */}

                                            <td className="px-6 py-4 font-medium text-gray-800">

                                                {admission.application_no ||
                                                    "N/A"}

                                            </td>



                                            {/* STUDENT NAME */}

                                            <td className="px-6 py-4 text-gray-700">

                                                {admission.student_name ||
                                                    "N/A"}

                                            </td>



                                            {/* CLASS */}

                                            <td className="px-6 py-4 text-gray-600">

                                                {getClassName(
                                                    admission.applying_class
                                                )}

                                            </td>



                                            {/* ACADEMIC YEAR */}

                                            <td className="px-6 py-4 text-gray-600">

                                                {admission.academic_year ||
                                                    "N/A"}

                                            </td>



                                            {/* APPLIED DATE */}

                                            <td className="px-6 py-4 text-gray-600">

                                                {admission.applied_date
                                                    ? new Date(
                                                        admission.applied_date
                                                    ).toLocaleDateString()
                                                    : "N/A"}

                                            </td>



                                            {/* STATUS */}

                                            <td className="px-6 py-4">

                                                <StatusBadge
                                                    status={
                                                        admission.status
                                                    }
                                                />

                                            </td>



                                            {/* ACTION */}

                                            <td className="px-6 py-4">

                                                <button
                                                    onClick={() =>
                                                        navigate(
                                                            `/admin/admissions/${admission.id}`
                                                        )
                                                    }
                                                    className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                                                >
                                                    View
                                                </button>

                                            </td>

                                        </tr>

                                    )
                                )

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
}



// =========================
// STATUS BADGE
// =========================

function StatusBadge ({ status }) {

    const classes =
        status === "PENDING"
            ? "bg-yellow-100 text-yellow-700"
            : status === "APPROVED"
                ? "bg-green-100 text-green-700"
                : status === "REJECTED"
                    ? "bg-red-100 text-red-700"
                    : "bg-gray-100 text-gray-700";


    return (

        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${classes}`}>
            {status || "N/A"}
        </span>

    );

}


export default Admissions;