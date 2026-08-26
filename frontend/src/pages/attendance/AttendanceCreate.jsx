import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function AttendanceCreate () {

    const navigate = useNavigate();

    const [students, setStudents] = useState([]);

    const [student, setStudent] = useState("");
    const [date, setDate] = useState("");
    const [status, setStatus] = useState("PRESENT");
    const [remarks, setRemarks] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");


    // =========================
    // GET STUDENTS
    // =========================

    useEffect(() => {

        const getStudents = async () => {

            try {

                const response = await api.get(
                    "students/"
                );

                setStudents(response.data);

            } catch (error) {

                console.log(error.response?.data);

                setError(
                    "Failed to load students"
                );

            } finally {

                setLoading(false);

            }

        };

        getStudents();

    }, []);


    // =========================
    // SUBMIT
    // =========================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");


        if (!student) {

            setError("Please select a student.");
            return;

        }

        if (!date) {

            setError("Please select a date.");
            return;

        }


        try {

            setSaving(true);


            const response = await api.post(
                "attendance/",
                {
                    student: Number(student),
                    date: date,
                    status: status,
                    remarks: remarks.trim(),
                }
            );


            console.log(
                "Attendance created:",
                response.data
            );


            navigate("/admin/attendance");


        } catch (error) {

            console.log(
                error.response?.data
            );


            setError(
                error.response?.data?.detail ||
                error.response?.data?.student?.[0] ||
                error.response?.data?.date?.[0] ||
                "Failed to mark attendance"
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
                    Loading students...
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
                    Mark Attendance
                </h1>

                <p className="text-gray-500 mt-1">
                    Mark attendance for a student
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
                FORM
            ========================= */}

            <div className="bg-white rounded-xl shadow p-6">


                <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >


                    {/* STUDENT */}

                    <div>

                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Student
                        </label>

                        <select
                            value={student}
                            onChange={(e) =>
                                setStudent(e.target.value)
                            }
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                        >

                            <option value="">
                                Select Student
                            </option>

                            {students.map(
                                (item) => (

                                    <option
                                        key={item.id}
                                        value={item.id}
                                    >
                                        {item.student_id}
                                    </option>

                                )
                            )}

                        </select>

                    </div>



                    {/* DATE */}

                    <div>

                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Date
                        </label>

                        <input
                            type="date"
                            value={date}
                            onChange={(e) =>
                                setDate(e.target.value)
                            }
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>



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
                            placeholder="Enter remarks (optional)"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>



                    {/* BUTTONS */}

                    <div className="flex gap-3">

                        <button
                            type="submit"
                            disabled={
                                saving ||
                                !student ||
                                !date
                            }
                            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            {saving ? "Saving..." : "Mark Attendance"}
                        </button>


                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/admin/attendance"
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

export default AttendanceCreate;