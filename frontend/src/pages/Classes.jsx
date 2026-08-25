import { useEffect, useState } from "react";
import api from "../services/api";

function Classes() {

    const [classes, setClasses] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);

    const [className, setClassName] = useState("");

    const [editingClass, setEditingClass] = useState(null);


    // Get Classes
    useEffect(() => {

        const getClasses = async () => {

            try {

                const response = await api.get(
                    "academics/classes/"
                );

                setClasses(response.data);

            } catch (error) {

                console.log(error.response?.data);

                setError("Failed to load classes");

            } finally {

                setLoading(false);

            }

        };

        getClasses();

    }, []);


    // Open Add Form
    const handleAdd = () => {

        setEditingClass(null);
        setClassName("");
        setError("");
        setShowForm(true);

    };


    // Open Edit Form
    const handleEdit = (schoolClass) => {

        setEditingClass(schoolClass);
        setClassName(schoolClass.name);
        setError("");
        setShowForm(true);

    };


    // Close Form
    const handleCancel = () => {

        setShowForm(false);
        setEditingClass(null);
        setClassName("");
        setError("");

    };


    // Create / Update Class
    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!className.trim()) {
            setError("Class name is required.");
            return;
        }


        try {

            setSaving(true);
            setError("");


            if (editingClass) {

                // Update
                const response = await api.patch(
                    `academics/classes/${editingClass.id}/`,
                    {
                        name: className.trim()
                    }
                );


                setClasses((prev) =>
                    prev.map((item) =>
                        item.id === editingClass.id
                            ? response.data
                            : item
                    )
                );

            } else {

                // Create
                const response = await api.post(
                    "academics/classes/",
                    {
                        name: className.trim()
                    }
                );


                setClasses((prev) => [
                    ...prev,
                    response.data
                ]);

            }


            handleCancel();

        } catch (error) {

            console.log(error.response?.data);

            setError(
                error.response?.data?.name?.[0] ||
                "Failed to save class"
            );

        } finally {

            setSaving(false);

        }

    };


    if (loading) {

        return (
            <div className="p-6">

                <p className="text-gray-500">
                    Loading classes...
                </p>

            </div>
        );

    }


    return (
        <div className="space-y-6">


            {/* Header */}

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
                    onClick={handleAdd}
                    className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Add Class
                </button>

            </div>


            {/* Error */}

            {error && (

                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg">
                    {error}
                </div>

            )}


            {/* Add / Edit Form */}

            {showForm && (

                <div className="bg-white rounded-xl shadow p-6">

                    <h2 className="text-lg font-semibold text-gray-800 mb-4">

                        {editingClass
                            ? "Edit Class"
                            : "Add New Class"
                        }

                    </h2>


                    <form
                        onSubmit={handleSubmit}
                        className="flex gap-3 max-w-lg"
                    >

                        <input
                            type="text"
                            placeholder="Enter class name"
                            value={className}
                            onChange={(e) =>
                                setClassName(e.target.value)
                            }
                            className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                        />


                        <button
                            type="submit"
                            disabled={
                                saving ||
                                !className.trim()
                            }
                            className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                        >

                            {saving
                                ? "Saving..."
                                : editingClass
                                    ? "Update"
                                    : "Save"
                            }

                        </button>


                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                        >
                            Cancel
                        </button>

                    </form>

                </div>

            )}


            {/* Classes Table */}

            <div className="bg-white rounded-xl shadow overflow-hidden">


                <div className="px-6 py-4 border-b">

                    <h2 className="font-semibold text-gray-800">
                        Class List
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                        {classes.length} classes found
                    </p>

                </div>


                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead className="bg-gray-50">

                            <tr>

                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                    ID
                                </th>

                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                    Class Name
                                </th>

                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                    Action
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {classes.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="3"
                                        className="text-center py-10 text-gray-500"
                                    >
                                        No classes found
                                    </td>

                                </tr>

                            ) : (

                                classes.map((schoolClass) => (

                                    <tr
                                        key={schoolClass.id}
                                        className="border-t hover:bg-gray-50"
                                    >

                                        <td className="px-6 py-4 text-gray-600">
                                            {schoolClass.id}
                                        </td>


                                        <td className="px-6 py-4 font-medium text-gray-800">
                                            {schoolClass.name}
                                        </td>


                                        <td className="px-6 py-4">

                                            <button
                                                onClick={() =>
                                                    handleEdit(
                                                        schoolClass
                                                    )
                                                }
                                                className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                                            >
                                                Edit
                                            </button>

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

export default Classes;