import { useEffect, useState } from "react";
import api from "../../services/api";

function TeacherAttendance () {

    const [assignments, setAssignments] = useState([]);
    const [students, setStudents] = useState([]);

    const [selectedAssignment, setSelectedAssignment] = useState("");
    const [date, setDate] = useState(
        new Date().toISOString().split("T")[0]
    );

    const [attendance, setAttendance] = useState({});
    const [remarks, setRemarks] = useState({});

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    // Load teacher assignments
    const loadAssignments = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await api.get("teachers/assign/");

            setAssignments(
                Array.isArray(response.data)
                    ? response.data
                    : response.data.results || []
            );

        } catch (error) {

            console.log(
                "TEACHER ASSIGNMENTS ERROR:",
                error.response?.data
            );

            setError(
                error.response?.data?.detail ||
                "Failed to load assignments."
            );

        } finally {

            setLoading(false);

        }
    };


    // Load students
    const loadStudents = async () => {

        try {

            const response = await api.get("students/");

            const data = Array.isArray(response.data)
                ? response.data
                : response.data.results || [];

            setStudents(data);

        } catch (error) {

            console.log(
                "STUDENTS ERROR:",
                error.response?.data
            );

            setError(
                error.response?.data?.detail ||
                "Failed to load students."
            );

        }
    };


    useEffect(() => {

        loadAssignments();
        loadStudents();

    }, []);


    // Select assignment
    const handleAssignmentChange = (e) => {

        const assignmentId = e.target.value;

        setSelectedAssignment(assignmentId);
        setAttendance({});
        setRemarks({});
        setMessage("");
    };


    // Change attendance status
    const handleStatusChange = (studentId, status) => {

        setAttendance((previous) => ({
            ...previous,
            [studentId]: status,
        }));

    };


    // Change remark
    const handleRemarkChange = (studentId, value) => {

        setRemarks((previous) => ({
            ...previous,
            [studentId]: value,
        }));

    };


    const selected = assignments.find(
        (assignment) =>
            String(assignment.id) === String(selectedAssignment)
    );


    // Filter students according to selected assignment
    const assignedStudents = selected
        ? students.filter(
            (student) =>
                String(student.school_class) ===
                String(selected.school_class) &&
                String(student.section) ===
                String(selected.section)
        )
        : [];


    // Submit attendance
    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setMessage("");

        try {

            for (const student of assignedStudents) {

                const status = attendance[student.id];

                if (!status) {
                    continue;
                }

                await api.post("attendance/", {
                    student: student.id,
                    date: date,
                    status: status,
                    remarks: remarks[student.id] || "",
                });

            }

            setMessage("Attendance marked successfully.");

            setAttendance({});
            setRemarks({});

        } catch (error) {

            console.log(
                "ATTENDANCE ERROR:",
                error.response?.data
            );

            setError(
                error.response?.data?.detail ||
                "Failed to mark attendance."
            );
        }
    };


    if (loading) {

        return (
            <div className="py-12 text-center text-gray-500">
                Loading...
            </div>
        );

    }


    return (
        <div className="space-y-6">

            {/* Header */}

            <div>

                <h1 className="text-3xl font-bold text-gray-800">
                    Attendance
                </h1>

                <p className="text-gray-500 mt-1">
                    Mark attendance for your assigned classes
                </p>

            </div>


            {/* Error */}

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}


            {/* Success */}

            {message && (
                <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
                    {message}
                </div>
            )}


            {/* Selection */}

            <div className="bg-white rounded-xl shadow p-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Assignment */}

                    <div>

                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Class / Section / Subject
                        </label>

                        <select
                            value={selectedAssignment}
                            onChange={handleAssignmentChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3"
                        >

                            <option value="">
                                Select assignment
                            </option>

                            {assignments.map((assignment) => (

                                <option
                                    key={assignment.id}
                                    value={assignment.id}
                                >
                                    Class {assignment.school_class} -
                                    Section {assignment.section} -
                                    Subject {assignment.subject}
                                </option>

                            ))}

                        </select>

                    </div>


                    {/* Date */}

                    <div>

                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Date
                        </label>

                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3"
                        />

                    </div>

                </div>

            </div>


            {/* Students */}

            {selectedAssignment && (

                <form onSubmit={handleSubmit}>

                    <div className="bg-white rounded-xl shadow overflow-hidden">

                        <div className="p-6 border-b">

                            <h2 className="text-xl font-bold text-gray-800">
                                Students
                            </h2>

                            <p className="text-gray-500 mt-1">
                                {assignedStudents.length} students
                            </p>

                        </div>


                        <div className="overflow-x-auto">

                            <table className="w-full">

                                <thead>

                                    <tr className="bg-gray-50">

                                        <th className="px-6 py-4 text-left">
                                            #
                                        </th>

                                        <th className="px-6 py-4 text-left">
                                            Student ID
                                        </th>

                                        <th className="px-6 py-4 text-left">
                                            Student
                                        </th>

                                        <th className="px-6 py-4 text-left">
                                            Status
                                        </th>

                                        <th className="px-6 py-4 text-left">
                                            Remarks
                                        </th>

                                    </tr>

                                </thead>


                                <tbody className="divide-y">

                                    {assignedStudents.length === 0 ? (

                                        <tr>

                                            <td
                                                colSpan="5"
                                                className="px-6 py-12 text-center text-gray-500"
                                            >
                                                No students found.
                                            </td>

                                        </tr>

                                    ) : (

                                        assignedStudents.map(
                                            (student, index) => (

                                                <tr
                                                    key={student.id}
                                                    className="hover:bg-gray-50"
                                                >

                                                    <td className="px-6 py-4">
                                                        {index + 1}
                                                    </td>

                                                    <td className="px-6 py-4 font-medium">
                                                        {student.student_id}
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        {student.student_name ||
                                                            student.full_name ||
                                                            student.name ||
                                                            `Student ${student.id}`}
                                                    </td>

                                                    <td className="px-6 py-4">

                                                        <select
                                                            value={
                                                                attendance[
                                                                student.id
                                                                ] || ""
                                                            }
                                                            onChange={(e) =>
                                                                handleStatusChange(
                                                                    student.id,
                                                                    e.target.value
                                                                )
                                                            }
                                                            className="border border-gray-300 rounded-lg px-3 py-2"
                                                        >

                                                            <option value="">
                                                                Select
                                                            </option>

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

                                                    </td>

                                                    <td className="px-6 py-4">

                                                        <input
                                                            type="text"
                                                            value={
                                                                remarks[
                                                                student.id
                                                                ] || ""
                                                            }
                                                            onChange={(e) =>
                                                                handleRemarkChange(
                                                                    student.id,
                                                                    e.target.value
                                                                )
                                                            }
                                                            placeholder="Optional"
                                                            className="border border-gray-300 rounded-lg px-3 py-2"
                                                        />

                                                    </td>

                                                </tr>

                                            )
                                        )

                                    )}

                                </tbody>

                            </table>

                        </div>


                        {assignedStudents.length > 0 && (

                            <div className="p-6 border-t flex justify-end">

                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                                >
                                    Mark Attendance
                                </button>

                            </div>

                        )}

                    </div>

                </form>

            )}

        </div>
    );
}

export default TeacherAttendance;