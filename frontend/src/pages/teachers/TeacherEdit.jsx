import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

function TeacherEdit() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [teacher, setTeacher] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [formError, setFormError] = useState("");


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
    // FIELD CHANGE
    // =========================

    const handleChange = (e) => {

        const { name, value, files } = e.target;

        setTeacher((prev) => ({

            ...prev,

            [name]: files
                ? files[0]
                : value

        }));

        setFormError("");

    };


    // =========================
    // UPDATE TEACHER
    // =========================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setFormError("");


        if (!teacher.full_name?.trim()) {

            setFormError(
                "Teacher name is required."
            );

            return;

        }


        if (!teacher.mobile?.trim()) {

            setFormError(
                "Mobile is required."
            );

            return;

        }


        if (!teacher.qualification?.trim()) {

            setFormError(
                "Qualification is required."
            );

            return;

        }


        if (!teacher.date_of_birth) {

            setFormError(
                "Date of birth is required."
            );

            return;

        }


        if (!teacher.gender) {

            setFormError(
                "Please select gender."
            );

            return;

        }


        if (!teacher.address?.trim()) {

            setFormError(
                "Address is required."
            );

            return;

        }


        try {

            setSaving(true);


            const data = new FormData();


            data.append(
                "full_name",
                teacher.full_name.trim()
            );


            data.append(
                "mobile",
                teacher.mobile.trim()
            );


            data.append(
                "qualification",
                teacher.qualification.trim()
            );


            data.append(
                "experience",
                teacher.experience || 0
            );


            data.append(
                "date_of_birth",
                teacher.date_of_birth
            );


            data.append(
                "gender",
                teacher.gender
            );


            data.append(
                "address",
                teacher.address.trim()
            );


            // Photo only if user selected a new photo

            if (teacher.photo instanceof File) {

                data.append(
                    "photo",
                    teacher.photo
                );

            }


            const response = await api.patch(
                `teachers/${id}/`,
                data,
                {
                    headers: {
                        "Content-Type":
                            "multipart/form-data"
                    }
                }
            );


            setTeacher(response.data);

            alert(
                "Teacher updated successfully."
            );


            navigate(
                `/admin/teachers/${id}`
            );


        } catch (error) {

            console.log(
                error.response?.data
            );


            const backendError =
                error.response?.data;


            setFormError(

                backendError?.detail ||

                backendError?.full_name?.[0] ||

                backendError?.mobile?.[0] ||

                backendError?.qualification?.[0] ||

                backendError?.experience?.[0] ||

                backendError?.date_of_birth?.[0] ||

                backendError?.gender?.[0] ||

                backendError?.address?.[0] ||

                backendError?.photo?.[0] ||

                "Failed to update teacher."

            );

        } finally {

            setSaving(false);

        }

    };


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
                        Edit Teacher
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Update teacher information
                    </p>

                </div>


                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            `/admin/teachers/${id}`
                        )
                    }
                    className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                    Back
                </button>

            </div>



            <form
                onSubmit={handleSubmit}
                className="space-y-6"
            >


                {/* =========================
                    BASIC INFORMATION
                ========================= */}

                <div className="bg-white rounded-xl shadow p-6">

                    <h2 className="text-lg font-semibold text-gray-800 mb-5">
                        Teacher Information
                    </h2>


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">


                        {/* TEACHER ID */}

                        <Input
                            label="Teacher ID"
                            value={teacher.teacher_id}
                            disabled
                        />


                        {/* NAME */}

                        <Input
                            label="Full Name"
                            name="full_name"
                            value={teacher.full_name}
                            onChange={handleChange}
                        />


                        {/* EMAIL */}

                        <Input
                            label="Email"
                            value={teacher.email}
                            disabled
                        />


                        {/* MOBILE */}

                        <Input
                            label="Mobile"
                            name="mobile"
                            value={teacher.mobile}
                            onChange={handleChange}
                        />


                        {/* QUALIFICATION */}

                        <Input
                            label="Qualification"
                            name="qualification"
                            value={teacher.qualification}
                            onChange={handleChange}
                        />


                        {/* EXPERIENCE */}

                        <Input
                            label="Experience (Years)"
                            name="experience"
                            type="number"
                            min="0"
                            value={teacher.experience}
                            onChange={handleChange}
                        />


                        {/* DOB */}

                        <Input
                            label="Date of Birth"
                            name="date_of_birth"
                            type="date"
                            value={
                                teacher.date_of_birth || ""
                            }
                            onChange={handleChange}
                        />


                        {/* GENDER */}

                        <Select
                            label="Gender"
                            name="gender"
                            value={teacher.gender || ""}
                            onChange={handleChange}
                            options={[
                                ["", "Select Gender"],
                                ["MALE", "Male"],
                                ["FEMALE", "Female"],
                                ["OTHER", "Other"]
                            ]}
                        />


                        {/* JOINING DATE */}

                        <Input
                            label="Joining Date"
                            value={teacher.joining_date}
                            disabled
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


                    <textarea
                        name="address"
                        value={teacher.address || ""}
                        onChange={handleChange}
                        rows="4"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                    />

                </div>



                {/* =========================
                    PHOTO
                ========================= */}

                <div className="bg-white rounded-xl shadow p-6">

                    <h2 className="text-lg font-semibold text-gray-800 mb-5">
                        Teacher Photo
                    </h2>


                    {teacher.photo &&
                        !(teacher.photo instanceof File) && (

                            <div className="mb-4">

                                <img
                                    src={teacher.photo}
                                    alt={teacher.full_name}
                                    className="w-32 h-32 object-cover rounded-xl border"
                                />

                            </div>

                        )}


                    <input
                        type="file"
                        name="photo"
                        accept="image/*"
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
                    />

                </div>



                {/* =========================
                    ERROR
                ========================= */}

                {formError && (

                    <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg">
                        {formError}
                    </div>

                )}



                {/* =========================
                    BUTTONS
                ========================= */}

                <div className="flex justify-end gap-3">

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                `/admin/teachers/${id}`
                            )
                        }
                        className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    >
                        Cancel
                    </button>


                    <button
                        type="submit"
                        disabled={saving}
                        className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        {saving
                            ? "Saving..."
                            : "Save Changes"}
                    </button>

                </div>

            </form>

        </div>

    );
}



// =========================
// INPUT
// =========================

function Input({
    label,
    name,
    value,
    onChange,
    type = "text",
    min,
    disabled = false
}) {

    return (

        <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>


            <input
                type={type}
                name={name}
                value={value || ""}
                onChange={onChange}
                min={min}
                disabled={disabled}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
            />

        </div>

    );

}



// =========================
// SELECT
// =========================

function Select({
    label,
    name,
    value,
    onChange,
    options
}) {

    return (

        <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>


            <select
                name={name}
                value={value || ""}
                onChange={onChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >

                {options.map(
                    ([optionValue, optionLabel]) => (

                        <option
                            key={optionValue}
                            value={optionValue}
                        >
                            {optionLabel}
                        </option>

                    )
                )}

            </select>

        </div>

    );

}


export default TeacherEdit;