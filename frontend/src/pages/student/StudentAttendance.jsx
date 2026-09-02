import { useEffect, useState } from "react";
import api from "../../services/api";

function StudentAttendance () {
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadAttendance = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("attendance/");

            const data = Array.isArray(response.data)
                ? response.data
                : response.data.results || [];

            setAttendance(data);
        } catch (error) {
            console.log(
                "STUDENT ATTENDANCE ERROR:",
                error.response?.data
            );

            setError(
                error.response?.data?.detail ||
                "Failed to load attendance."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAttendance();
    }, []);

    if (loading) {
        return (
            <div className="py-12 text-center text-gray-500">
                Loading attendance...
            </div>
        );
    }

    return (
        <div className="space-y-6">

            <div>
                <h1 className="text-3xl font-bold text-gray-800">
                    My Attendance
                </h1>

                <p className="text-gray-500 mt-1">
                    View your attendance records
                </p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            <div className="bg-white rounded-xl shadow overflow-hidden">

                <div className="p-6 border-b">
                    <h2 className="text-xl font-bold text-gray-800">
                        Attendance Records
                    </h2>

                    <p className="text-gray-500 mt-1">
                        {attendance.length} records
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">

                        <thead>
                            <tr className="bg-gray-50">
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                    #
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                    Date
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                    Status
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                    Remarks
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y">

                            {attendance.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="4"
                                        className="px-6 py-12 text-center text-gray-500"
                                    >
                                        No attendance records found.
                                    </td>
                                </tr>
                            ) : (
                                attendance.map((record, index) => (
                                    <tr
                                        key={record.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {index + 1}
                                        </td>

                                        <td className="px-6 py-4 text-sm text-gray-800">
                                            {record.date}
                                        </td>

                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${record.status === "PRESENT"
                                                        ? "bg-green-100 text-green-700"
                                                        : record.status === "ABSENT"
                                                            ? "bg-red-100 text-red-700"
                                                            : "bg-yellow-100 text-yellow-700"
                                                    }`}
                                            >
                                                {record.status}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {record.remarks || "-"}
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

export default StudentAttendance;