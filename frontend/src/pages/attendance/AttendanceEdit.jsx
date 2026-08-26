import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

function AttendanceEdit () {

    const { id } = useParams();
    const navigate = useNavigate();

    const [attendance, setAttendance] = useState(null);

    const [status, setStatus] = useState("");
    const [remarks, setRemarks] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");


    // =========================
    // GET ATTENDANCE
    // =========================

    useEffect(() => {

        const getAttendance = async () => {

            try {

                const response = await api.get(
                    `attendance/${id}/`
                );

                setAttendance(response.data);

                setStatus(
                    response.data.status
                );

                setRemarks(
                    response.data.remarks || ""
                );

            } catch (error) {

                console.log(
                    error.response?.data
                );

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
    // UPDATE
    // =========================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

        try {

            setSaving(true);

            const response = await api.patch(
                `attendance/${id}/`,
                {
                    status: status,
                    remarks: remarks.trim(),
                }
            );

            console.log(
                "Attendance updated:",
                response.data
            );

            navigate(
                `/admin/attendance/${id}`
            );

        } catch (error) {

            console.log(
                error.response?.data
            );

            setError(
                error.response?.data?.detail ||
                error.response?.data?.status?.[0] ||
                error.response?.data?.remarks?.[0] ||
                "Failed to update attendance"
            );

        } finally {

            setSaving(false);

        }

    };


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


    if (error && !attendance) {

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

            <div>

                <h1 className="text-2xl font-bold text-gray-800">
                    Edit Attendance
                </h1>

                <p className="text-gray-500 mt-1">
                    Update attendance status and remarks
                </p>

            </div>



            {/* =========================
                ERROR
            ========================= */}

            {error && (

                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg">
                    {error}
                </div>

            )}



            {/* =========================
                STUDENT INFORMATION
            ========================= */}

            <div className="bg-white rounded-xl shadow p-6">

                <h2 className="text-lg font-semibold text-gray-800 mb-5">
                    Attendance Record
                </h2>


                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

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

                </div>

            </div>



            {/* =========================
                EDIT FORM
            ========================= */}

            <div className="bg-white rounded-xl shadow p-6">

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >


                    {/* STATUS */}

                    <div>

                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Status
                        </label>

                        <select
                            value={status}
                            onChange={(e) =>
                                setStatus(e.target.value)
                            }
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                        >

                            <option value="PRESENT">
                                Present
                            </option>

                            <option value="ABSENT">
                                Absent
                            </option>

                            <option value="LEAVE">
                                Leave
                            </option>

                        </select>

                    </div>



                    {/* REMARKS */}

                    <div>

                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Remarks
                        </label>

                        <textarea
                            value={remarks}
                            onChange={(e) =>
                                setRemarks(e.target.value)
                            }
                            rows="4"
                            placeholder="Enter remarks"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>



                    {/* BUTTONS */}

                    <div className="flex gap-3">

                        <button
                            type="submit"
                            disabled={saving}
                            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >

                            {saving
                                ? "Updating..."
                                : "Update Attendance"
                            }

                        </button>


                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    `/admin/attendance/${id}`
                                )
                            }
                            className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                        >
                            Cancel
                        </button>

                    </div>

                </form>

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


export default AttendanceEdit;