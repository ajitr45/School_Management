import { useEffect, useState } from "react";
import api from "../../services/api";

function TeacherTimetable () {

    const [timetables, setTimetables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const days = [
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
        "SATURDAY",
    ];

    const loadTimetable = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await api.get("timetable/");

            const data = Array.isArray(response.data)
                ? response.data
                : response.data.results || [];

            setTimetables(data);

        } catch (error) {

            console.log(
                "TEACHER TIMETABLE ERROR:",
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


    const getDayName = (day) => {

        return day.charAt(0) + day.slice(1).toLowerCase();

    };


    if (loading) {

        return (
            <div className="py-12 text-center text-gray-500">
                Loading timetable...
            </div>
        );

    }


    return (
        <div className="space-y-6">

            {/* Header */}

            <div>

                <h1 className="text-3xl font-bold text-gray-800">
                    My Timetable
                </h1>

                <p className="text-gray-500 mt-1">
                    View your assigned class timetable
                </p>

            </div>


            {/* Error */}

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}


            {/* Timetable */}

            <div className="space-y-6">

                {days.map((day) => {

                    const dayTimetables = timetables
                        .filter((item) => item.day === day)
                        .sort((a, b) => a.period - b.period);


                    return (
                        <div
                            key={day}
                            className="bg-white rounded-xl shadow overflow-hidden"
                        >

                            {/* Day Header */}

                            <div className="px-6 py-4 border-b bg-gray-50">

                                <h2 className="text-xl font-bold text-gray-800">
                                    {getDayName(day)}
                                </h2>

                            </div>


                            {/* Periods */}

                            {dayTimetables.length === 0 ? (

                                <div className="px-6 py-8 text-center text-gray-500">
                                    No periods assigned.
                                </div>

                            ) : (

                                <div className="overflow-x-auto">

                                    <table className="w-full">

                                        <thead>

                                            <tr className="border-b">

                                                <th className="px-6 py-4 text-left">
                                                    Period
                                                </th>

                                                <th className="px-6 py-4 text-left">
                                                    Time
                                                </th>

                                                <th className="px-6 py-4 text-left">
                                                    Class
                                                </th>

                                                <th className="px-6 py-4 text-left">
                                                    Section
                                                </th>

                                                <th className="px-6 py-4 text-left">
                                                    Subject
                                                </th>

                                            </tr>

                                        </thead>


                                        <tbody className="divide-y">

                                            {dayTimetables.map((item) => (

                                                <tr
                                                    key={item.id}
                                                    className="hover:bg-gray-50"
                                                >

                                                    <td className="px-6 py-4 font-medium">
                                                        {item.period}
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        {item.start_time} - {item.end_time}
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        {item.class_name ||
                                                            `Class ${item.school_class}`}
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        {item.section_name ||
                                                            `Section ${item.section}`}
                                                    </td>

                                                    <td className="px-6 py-4 font-medium">
                                                        {item.subject_name ||
                                                            `Subject ${item.subject}`}
                                                    </td>

                                                </tr>

                                            ))}

                                        </tbody>

                                    </table>

                                </div>

                            )}

                        </div>
                    );

                })}

            </div>

        </div>
    );
}

export default TeacherTimetable;