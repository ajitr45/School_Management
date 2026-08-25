import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

function TeacherDetail() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [teacher, setTeacher] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // =========================
    // GET TEACHER
    // =========================

    useEffect(() => {

        const getTeacher = async () => {

            try {

                const response = await api.get(
                    `teachers/${id}/`
                );

                setTeacher(response.data);

            } catch (error) {

                console.log(error.response?.data);

                setError(
                    "Failed to load teacher"
                );

            } finally {

                setLoading(false);

            }

        };

        getTeacher();

    }, [id]);


    // =========================
    // LOADING
    // =========================

    if (loading) {

        return (
            <div className="p-6">

                <p className="text-gray-500">
                    Loading teacher...
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


    if (!teacher) {

        return (
            <div className="p-6">

                <p className="text-gray-500">
                    Teacher not found.
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
                        Teacher Details
                    </h1>

                    <p className="text-gray-500 mt-1">
                        View teacher information
                    </p>

                </div>


                <div className="flex gap-3">

                    <button
                        onClick={() =>
                            navigate(
                                `/admin/teachers/${id}/edit`
                            )
                        }
                        className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Edit
                    </button>


                    <button
                        onClick={() =>
                            navigate("/admin/teachers")
                        }
                        className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    >
                        Back
                    </button>

                </div>

            </div>



            {/* =========================
                PROFILE
            ========================= */}

            <div className="bg-white rounded-xl shadow p-6">

                <div className="flex flex-col md:flex-row gap-6">


                    {/* PHOTO */}

                    <div className="w-32 h-32 shrink-0">

                        {teacher.photo ? (

                            <img
                                src={teacher.photo}
                                alt={teacher.full_name}
                                className="w-32 h-32 object-cover rounded-xl border"
                            />

                        ) : (

                            <div className="w-32 h-32 rounded-xl bg-gray-100 flex items-center justify-center">

                                <span className="text-gray-400">
                                    No Photo
                                </span>

                            </div>

                        )}

                    </div>



                    {/* BASIC INFO */}

                    <div>

                        <h2 className="text-2xl font-bold text-gray-800">
                            {teacher.full_name}
                        </h2>

                        <p className="text-gray-500 mt-1">
                            Teacher ID: {teacher.teacher_id}
                        </p>

                        <p className="text-gray-500">
                            {teacher.email}
                        </p>

                    </div>

                </div>

            </div>



            {/* =========================
                PROFESSIONAL INFORMATION
            ========================= */}

            <div className="bg-white rounded-xl shadow p-6">

                <h2 className="text-lg font-semibold text-gray-800 mb-5">
                    Professional Information
                </h2>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    <Info
                        label="Teacher ID"
                        value={teacher.teacher_id}
                    />

                    <Info
                        label="Qualification"
                        value={teacher.qualification}
                    />

                    <Info
                        label="Experience"
                        value={`${teacher.experience} years`}
                    />

                    <Info
                        label="Joining Date"
                        value={teacher.joining_date}
                    />

                </div>

            </div>



            {/* =========================
                PERSONAL INFORMATION
            ========================= */}

            <div className="bg-white rounded-xl shadow p-6">

                <h2 className="text-lg font-semibold text-gray-800 mb-5">
                    Personal Information
                </h2>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    <Info
                        label="Full Name"
                        value={teacher.full_name}
                    />

                    <Info
                        label="Email"
                        value={teacher.email}
                    />

                    <Info
                        label="Mobile"
                        value={teacher.mobile}
                    />

                    <Info
                        label="Date of Birth"
                        value={teacher.date_of_birth}
                    />

                    <Info
                        label="Gender"
                        value={teacher.gender}
                    />

                </div>

            </div>



            {/* =========================
                ADDRESS
            ========================= */}

            <div className="bg-white rounded-xl shadow p-6">

                <h2 className="text-lg font-semibold text-gray-800 mb-5">
                    Address
                </h2>


                <p className="text-gray-700 whitespace-pre-line">
                    {teacher.address || "No address available"}
                </p>

            </div>

        </div>

    );
}



// =========================
// INFO COMPONENT
// =========================

function Info({
    label,
    value
}) {

    return (

        <div>

            <p className="text-sm text-gray-500 mb-1">
                {label}
            </p>

            <p className="font-medium text-gray-800">
                {value || "-"}
            </p>

        </div>

    );

}


export default TeacherDetail;