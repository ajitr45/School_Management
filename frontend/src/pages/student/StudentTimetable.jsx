import { useEffect, useState } from "react";
import api from "../../services/api";

function StudentTimetable () {
    const [timetable, setTimetable] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadTimetable = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("timetable/");

            const data = Array.isArray(response.data)
                ? response.data
                : response.data.results || [];

            setTimetable(data);
        } catch (error) {
            console.log(
                "STUDENT TIMETABLE ERROR:",
                error.response?.data
            );

            setError(
                error.response?.data?.detail ||
                "Failed to load timetable."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTimetable();
    }, []);

    if (loading) {
        return (
            <div className="py-12 text-center text-gray-500">
                Loading timetable...
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">
                    My Timetable
                </h1>

                <p className="text-gray-500 mt-1">
                    View your class timetable
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
                        Class Timetable
                    </h2>

                    <p className="text-gray-500 mt-1">
                        {timetable.length} periods
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
                                    Day
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                    Time
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                    Subject
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                    Teacher
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y">
                            {timetable.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="px-6 py-12 text-center text-gray-500"
                                    >
                                        No timetable found.
                                    </td>
                                </tr>
                            ) : (
                                timetable.map((item, index) => (
                                    <tr
                                        key={item.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {index + 1}
                                        </td>

                                        <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                                            {item.day_name ||
                                                item.day ||
                                                "-"}
                                        </td>

                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {item.start_time &&
                                                item.end_time
                                                ? `${item.start_time} - ${item.end_time}`
                                                : "-"}
                                        </td>

                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {item.subject_name || "-"}
                                        </td>

                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {item.teacher_name || "-"}
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

export default StudentTimetable;