import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function Classes () {

    const navigate = useNavigate();

    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =========================
    // GET CLASSES
    // =========================

    useEffect(() => {

        const getClasses = async () => {

            try {

                const response = await api.get(
                    "academics/classes/"
                );

                setClasses(response.data);

            } catch (error) {

                console.log(error.response?.data);

                setError(
                    "Failed to load classes"
                );

            } finally {

                setLoading(false);

            }

        };

        getClasses();

    }, []);


    // =========================
    // LOADING
    // =========================

    if (loading) {

        return (
            <div className="p-6">

                <p className="text-gray-500">
                    Loading classes...
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
                        Classes
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Manage school classes
                    </p>

                </div>


                <button
                    onClick={() =>
                        navigate("/admin/academics/classes/create")
                    }
                    className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    + Add Class
                </button>

            </div>



            {/* =========================
                CLASS LIST
            ========================= */}

            <div className="bg-white rounded-xl shadow overflow-hidden">

                <div className="p-6 border-b">

                    <h2 className="text-lg font-semibold text-gray-800">
                        All Classes
                    </h2>

                </div>


                {classes.length === 0 ? (

                    <div className="p-6 text-center">

                        <p className="text-gray-500">
                            No classes found.
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
                                        Class Name
                                    </th>

                                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                                        Action
                                    </th>

                                </tr>

                            </thead>


                            <tbody className="divide-y">

                                {classes.map(
                                    (schoolClass, index) => (

                                        <tr
                                            key={schoolClass.id}
                                            className="hover:bg-gray-50"
                                        >

                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {index + 1}
                                            </td>


                                            <td className="px-6 py-4">

                                                <span className="font-medium text-gray-800">
                                                    {schoolClass.name}
                                                </span>

                                            </td>


                                            <td className="px-6 py-4 text-right">

                                                <button
                                                    onClick={() =>
                                                        navigate(
                                                            `/admin/academics/classes/${schoolClass.id}/edit`
                                                        )
                                                    }
                                                    className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                                                >
                                                    Edit
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

export default Classes;