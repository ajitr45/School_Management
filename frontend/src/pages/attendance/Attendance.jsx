import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function Attendance () {

    const navigate = useNavigate();

    const [attendances, setAttendances] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // =========================
    // GET ATTENDANCE
    // =========================

    useEffect(() => {

        const getAttendance = async () => {

            try {

                const response = await api.get(
                    "attendance/"
                );

                setAttendances(response.data);

            } catch (error) {

                console.log(error.response?.data);

                setError(
                    "Failed to load attendance"
                );

            } finally {

                setLoading(false);

            }

        };

        getAttendance();

    }, []);


    // =========================
    // LOADING
    // =========================

    if (loading) {

        return (
            <div className="p-6">

                <p className="text-gray-500">
                    Loading attendance...
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

            <div className="flex items-center justify-between">

                <div>

                    <h1 className="text-2xl font-bold text-gray-800">
                        Attendance
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Manage student attendance
                    </p>

                </div>


                <button
                    onClick={() =>
                        navigate("/admin/attendance/create")
                    }
                    className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    + Mark Attendance
                </button>

            </div>

                    

            {/* =========================
                ATTENDANCE LIST
            ========================= */}

            <div className="bg-white rounded-xl shadow overflow-hidden">


                <div className="p-6 border-b">

                    <h2 className="text-lg font-semibold text-gray-800">
                        Attendance Records
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                        {attendances.length} records found
                    </p>

                </div>


                {attendances.length === 0 ? (

                    <div className="p-10 text-center">

                        <p className="text-gray-500">
                            No attendance records found.
                        </p>

                    </div>

                ) : (

                    <div className="overflow-x-auto">

                        <table className="w-full">

                            <thead className="bg-gray-50">

                                <tr>

                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                        #
                                    </th>

                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                        Student
                                    </th>

                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                        Teacher
                                    </th>

                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                        Date
                                    </th>

                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                        Status
                                    </th>

                                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                                        Action
                                    </th>

                                </tr>

                            </thead>


                            <tbody className="divide-y">

                                {attendances.map(
                                    (attendance, index) => (

                                        <tr
                                            key={attendance.id}
                                            className="hover:bg-gray-50"
                                        >

                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {index + 1}
                                            </td>


                                            <td className="px-6 py-4">

                                                <span className="font-medium text-gray-800">
                                                    Student #{attendance.student}
                                                </span>

                                            </td>


                                            <td className="px-6 py-4 text-gray-600">
                                                Teacher #{attendance.teacher}
                                            </td>


                                            <td className="px-6 py-4 text-gray-600">
                                                {attendance.date}
                                            </td>


                                            <td className="px-6 py-4">

                                                <Status
                                                    status={
                                                        attendance.status
                                                    }
                                                />

                                            </td>


                                            <td className="px-6 py-4 text-right">

                                                <button
                                                    onClick={() =>
                                                        navigate(
                                                            `/admin/attendance/${attendance.id}`
                                                        )
                                                    }
                                                    className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                                                >
                                                    View
                                                </button>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>
    );
}



// =========================
// STATUS COMPONENT
// =========================

function Status ({ status }) {

    if (status === "PRESENT") {

        return (
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                Present
            </span>
        );

    }


    if (status === "ABSENT") {

        return (
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">
                Absent
            </span>
        );

    }


    if (status === "LEAVE") {

        return (
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">
                Leave
            </span>
        );

    }


    return (
        <span className="text-gray-500">
            {status || "-"}
        </span>
    );
}


export default Attendance;