import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function Teachers () {

    const navigate = useNavigate();

    const [teachers, setTeachers] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // =========================
    // GET TEACHERS
    // =========================

    useEffect(() => {

        const getTeachers = async () => {

            try {

                const response = await api.get(
                    "teachers/list/"
                );

                setTeachers(response.data);

            } catch (error) {

                console.log(error.response?.data);

                setError(
                    "Failed to load teachers"
                );

            } finally {

                setLoading(false);

            }

        };

        getTeachers();

    }, []);


    // =========================
    // LOADING
    // =========================

    if (loading) {

        return (
            <div className="p-6">

                <p className="text-gray-500">
                    Loading teachers...
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
                        Teachers
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Manage school teachers
                    </p>

                </div>


                <button
                    onClick={() =>
                        navigate(
                            "/admin/teachers/create"
                        )
                    }
                    className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    + Add Teacher
                </button>

            </div>



            {/* =========================
                TEACHER LIST
            ========================= */}

            <div className="bg-white rounded-xl shadow overflow-hidden">


                <div className="p-6 border-b">

                    <h2 className="text-lg font-semibold text-gray-800">
                        All Teachers
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                        {teachers.length} teachers found
                    </p>

                </div>


                {teachers.length === 0 ? (

                    <div className="p-6 text-center">

                        <p className="text-gray-500">
                            No teachers found.
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
                                        Teacher ID
                                    </th>

                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                        Name
                                    </th>

                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                        Email
                                    </th>

                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                        Mobile
                                    </th>

                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                        Qualification
                                    </th>

                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                        Experience
                                    </th>

                                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                                        Action
                                    </th>

                                </tr>

                            </thead>


                            <tbody className="divide-y">

                                {teachers.map(
                                    (teacher, index) => (

                                        <tr
                                            key={teacher.id || teacher.teacher_id}
                                            className="hover:bg-gray-50"
                                        >

                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {index + 1}
                                            </td>


                                            <td className="px-6 py-4">

                                                <span className="font-medium text-blue-600">
                                                    {teacher.teacher_id}
                                                </span>

                                            </td>


                                            <td className="px-6 py-4">

                                                <span className="font-medium text-gray-800">
                                                    {teacher.full_name}
                                                </span>

                                            </td>


                                            <td className="px-6 py-4 text-gray-600">
                                                {teacher.email}
                                            </td>


                                            <td className="px-6 py-4 text-gray-600">
                                                {teacher.mobile}
                                            </td>


                                            <td className="px-6 py-4 text-gray-600">
                                                {teacher.qualification}
                                            </td>


                                            <td className="px-6 py-4 text-gray-600">
                                                {teacher.experience} years
                                            </td>


                                            <td className="px-6 py-4 text-right">

                                                <button
                                                    onClick={() =>
                                                        navigate(
                                                            `/admin/teachers/${teacher.id}`
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

export default Teachers;