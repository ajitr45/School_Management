import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function EditStudent() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [student, setStudent] = useState(null);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {

        const getStudent = async () => {

            try {

                const response = await api.get(`students/${id}/`);

                const data = response.data;

                setStudent(data);

                setFirstName(data.user?.first_name || "");
                setLastName(data.user?.last_name || "");
                setEmail(data.user?.email || "");

            } catch (error) {

                console.log(error.response?.data);

                setError("Failed to load student");

            } finally {

                setLoading(false);

            }
        };

        getStudent();

    }, [id]);


    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSaving(true);

        try {

            await api.patch(`students/${id}/`, {
                first_name: firstName,
                last_name: lastName,
                email: email,
            });

            navigate(`/admin/students/${id}`);

        } catch (error) {

            console.log(error.response?.data);

            setError(
                error.response?.data?.detail ||
                "Failed to update student"
            );

        } finally {

            setSaving(false);

        }
    };


    if (loading) {

        return (
            <div className="p-6">

                <p className="text-gray-500">
                    Loading student...
                </p>

            </div>
        );

    }


    if (error && !student) {

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


            {/* Header */}

            <div className="flex items-center justify-between">

                <div>

                    <h1 className="text-2xl font-bold text-gray-800">
                        Edit Student
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Update student information
                    </p>

                </div>


                <button
                    type="button"
                    onClick={() =>
                        navigate(`/admin/students/${id}`)
                    }
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                    Cancel
                </button>

            </div>


            {/* Form */}

            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-xl shadow p-6"
            >

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">


                    {/* First Name */}

                    <div>

                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            First Name
                        </label>

                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) =>
                                setFirstName(e.target.value)
                            }
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>


                    {/* Last Name */}

                    <div>

                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Last Name
                        </label>

                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) =>
                                setLastName(e.target.value)
                            }
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>


                    {/* Email */}

                    <div>

                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>


                    {/* Student ID - Read Only */}

                    <div>

                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Student ID
                        </label>

                        <input
                            type="text"
                            value={student.student_id || ""}
                            readOnly
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 text-gray-500"
                        />

                    </div>


                    {/* Roll Number - Read Only */}

                    <div>

                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Roll Number
                        </label>

                        <input
                            type="text"
                            value={student.roll_number || ""}
                            readOnly
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 text-gray-500"
                        />

                    </div>


                    {/* Class - Read Only */}

                    <div>

                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Class
                        </label>

                        <input
                            type="text"
                            value={student.school_class?.name || ""}
                            readOnly
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 text-gray-500"
                        />

                    </div>


                    {/* Section - Read Only */}

                    <div>

                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Section
                        </label>

                        <input
                            type="text"
                            value={student.section?.name || ""}
                            readOnly
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 text-gray-500"
                        />

                    </div>

                </div>


                {/* Error */}

                {error && (

                    <p className="text-sm text-red-600 mt-5">
                        {error}
                    </p>

                )}


                {/* Save */}

                <div className="flex justify-end mt-6">

                    <button
                        type="submit"
                        disabled={saving}
                        className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </button>

                </div>

            </form>

        </div>
    );
}

export default EditStudent;