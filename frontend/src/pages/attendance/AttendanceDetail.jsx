import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

function AttendanceDetail () {

    const { id } = useParams();
    const navigate = useNavigate();

    const [attendance, setAttendance] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // =========================
    // GET ATTENDANCE DETAIL
    // =========================

    useEffect(() => {

        const getAttendance = async () => {

            try {

                const response = await api.get(
                    `attendance/${id}/`
                );

                setAttendance(response.data);

            } catch (error) {

                console.log(error.response?.data);

                setError(
                    error.response?.data?.detail ||
                    "Failed to load attendance"
                );

            } finally {

                setLoading(false);

            }

        };

        getAttendance();

    }, [id]);


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


    if (!attendance) {

        return (
            <div className="p-6">

                <p className="text-gray-500">
                    Attendance not found.
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
                        Attendance Details
                    </h1>

                    <p className="text-gray-500 mt-1">
                        View attendance information
                    </p>

                </div>


                <div className="flex gap-3">

                    <button
                        onClick={() =>
                            navigate(
                                `/admin/attendance/${id}/edit`
                            )
                        }
                        className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Edit
                    </button>


                    <button
                        onClick={() =>
                            navigate(
                                "/admin/attendance"
                            )
                        }
                        className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    >
                        Back
                    </button>

                </div>

            </div>



            {/* =========================
                ATTENDANCE INFORMATION
            ========================= */}

            <div className="bg-white rounded-xl shadow p-6">

                <h2 className="text-lg font-semibold text-gray-800 mb-5">
                    Attendance Information
                </h2>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


                    <Info
                        label="Attendance ID"
                        value={attendance.id}
                    />


                    <Info
                        label="Student ID"
                        value={attendance.student}
                    />


                    <Info
                        label="Teacher ID"
                        value={attendance.teacher}
                    />


                    <Info
                        label="Date"
                        value={attendance.date}
                    />


                    <div>

                        <p className="text-sm text-gray-500 mb-1">
                            Status
                        </p>

                        <Status
                            status={attendance.status}
                        />

                    </div>


                    <Info
                        label="Remarks"
                        value={
                            attendance.remarks ||
                            "No remarks"
                        }
                    />

                </div>

            </div>



            {/* =========================
                TIMESTAMPS
            ========================= */}

            <div className="bg-white rounded-xl shadow p-6">

                <h2 className="text-lg font-semibold text-gray-800 mb-5">
                    Record Information
                </h2>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <Info
                        label="Created At"
                        value={attendance.created_at}
                    />

                    <Info
                        label="Updated At"
                        value={attendance.updated_at}
                    />

                </div>

            </div>

        </div>
    );
}



// =========================
// INFO COMPONENT
// =========================

function Info ({
    label,
    value
}) {

    return (

        <div>

            <p className="text-sm text-gray-500 mb-1">
                {label}
            </p>

            <p className="font-medium text-gray-800">
                {value || "-"}
            </p>

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


export default AttendanceDetail;