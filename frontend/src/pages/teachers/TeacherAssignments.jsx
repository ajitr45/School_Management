import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function TeacherAssignments () {

    const navigate = useNavigate();

    const [assignments, setAssignments] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // =========================
    // GET ASSIGNMENTS
    // =========================

    useEffect(() => {

        const getAssignments = async () => {

            try {

                const response = await api.get(
                    "teachers/assign/"
                );

                setAssignments(
                    response.data
                );

            } catch (error) {

                console.log(
                    error.response?.data
                );

                setError(
                    "Failed to load teacher assignments"
                );

            } finally {

                setLoading(false);

            }

        };

        getAssignments();

    }, []);


    // =========================
    // LOADING
    // =========================

    if (loading) {

        return (
            <div className="p-6">

                <p className="text-gray-500">
                    Loading assignments...
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
                        Teacher Assignments
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Manage teacher class, section and subject assignments
                    </p>

                </div>


                <button
                    onClick={() =>
                        navigate("/admin/teachers")
                    }
                    className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                    Teachers
                </button>

            </div>



            {/* =========================
                ASSIGNMENT TABLE
            ========================= */}

            <div className="bg-white rounded-xl shadow overflow-hidden">


                <div className="p-6 border-b">

                    <h2 className="text-lg font-semibold text-gray-800">
                        All Assignments
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                        {assignments.length} assignments found
                    </p>

                </div>


                {assignments.length === 0 ? (

                    <div className="p-10 text-center">

                        <p className="text-gray-500">
                            No teacher assignments found.
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
                                        Teacher
                                    </th>

                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                        Teacher ID
                                    </th>

                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                        Class
                                    </th>

                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                        Section
                                    </th>

                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                        Subject
                                    </th>

                                </tr>

                            </thead>


                            <tbody className="divide-y">

                                {assignments.map(
                                    (assignment, index) => (

                                        <tr
                                            key={assignment.id}
                                            className="hover:bg-gray-50"
                                        >

                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {index + 1}
                                            </td>


                                            <td className="px-6 py-4">

                                                <span className="font-medium text-gray-800">
                                                    {assignment.teacher_name}
                                                </span>

                                            </td>


                                            <td className="px-6 py-4">

                                                <span className="text-blue-600 font-medium">
                                                    {assignment.teacher_id}
                                                </span>

                                            </td>


                                            <td className="px-6 py-4 text-gray-700">
                                                {assignment.class_name}
                                            </td>


                                            <td className="px-6 py-4 text-gray-700">
                                                {assignment.section_name}
                                            </td>


                                            <td className="px-6 py-4 text-gray-700">
                                                {assignment.subject_name}
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

export default TeacherAssignments;