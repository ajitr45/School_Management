import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function TeacherCreate () {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({

        full_name: "",
        email: "",
        mobile: "",
        qualification: "",
        experience: "",
        date_of_birth: "",
        gender: "",
        address: "",
        photo: null,
        joining_date: ""

    });

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [credentials, setCredentials] = useState(null);


    // =========================
    // HANDLE CHANGE
    // =========================

    const handleChange = (e) => {

        const { name, value, files } = e.target;

        setFormData((prev) => ({

            ...prev,

            [name]: files
                ? files[0]
                : value

        }));

        setError("");

    };


    // =========================
    // SUBMIT
    // =========================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");


        if (!formData.full_name.trim()) {

            setError("Full name is required.");
            return;

        }


        if (!formData.email.trim()) {

            setError("Email is required.");
            return;

        }


        if (!formData.mobile.trim()) {

            setError("Mobile is required.");
            return;

        }


        if (!formData.qualification.trim()) {

            setError("Qualification is required.");
            return;

        }


        if (!formData.date_of_birth) {

            setError("Date of birth is required.");
            return;

        }


        if (!formData.gender) {

            setError("Please select gender.");
            return;

        }


        if (!formData.address.trim()) {

            setError("Address is required.");
            return;

        }


        if (!formData.joining_date) {

            setError("Joining date is required.");
            return;

        }


        try {

            setSaving(true);


            const data = new FormData();


            data.append(
                "full_name",
                formData.full_name.trim()
            );

            data.append(
                "email",
                formData.email.trim()
            );

            data.append(
                "mobile",
                formData.mobile.trim()
            );

            data.append(
                "qualification",
                formData.qualification.trim()
            );

            data.append(
                "experience",
                formData.experience || 0
            );

            data.append(
                "date_of_birth",
                formData.date_of_birth
            );

            data.append(
                "gender",
                formData.gender
            );

            data.append(
                "address",
                formData.address.trim()
            );

            data.append(
                "joining_date",
                formData.joining_date
            );


            if (formData.photo) {

                data.append(
                    "photo",
                    formData.photo
                );

            }


            const response = await api.post(
                "teachers/",
                data
            );


            // Backend credentials save
            setCredentials(response.data);


        } catch (error) {

            console.log(error.response?.data);

            const data = error.response?.data;

            setError(

                data?.email?.[0] ||

                data?.mobile?.[0] ||

                data?.full_name?.[0] ||

                data?.qualification?.[0] ||

                data?.date_of_birth?.[0] ||

                data?.gender?.[0] ||

                data?.address?.[0] ||

                data?.joining_date?.[0] ||

                data?.detail ||

                "Failed to create teacher."

            );

        } finally {

            setSaving(false);

        }

    };


    // =========================
    // CREDENTIALS
    // =========================

    if (credentials) {

        return (

            <div className="max-w-2xl mx-auto space-y-6">


                <div className="bg-green-50 border border-green-200 rounded-xl p-6">

                    <h1 className="text-2xl font-bold text-green-700">
                        Teacher Created Successfully
                    </h1>

                    <p className="text-green-600 mt-2">
                        Please save these login credentials.
                    </p>

                </div>


                <div className="bg-white rounded-xl shadow p-6 space-y-5">

                    <div>

                        <p className="text-sm text-gray-500">
                            Teacher ID
                        </p>

                        <p className="font-semibold text-gray-800">
                            {credentials.teacher_id}
                        </p>

                    </div>


                    <div>

                        <p className="text-sm text-gray-500">
                            Username
                        </p>

                        <p className="font-semibold text-gray-800">
                            {credentials.username}
                        </p>

                    </div>


                    <div>

                        <p className="text-sm text-gray-500">
                            Password
                        </p>

                        <p className="font-semibold text-gray-800">
                            {credentials.password}
                        </p>

                    </div>


                    <div className="flex gap-3 pt-3">

                        <button
                            onClick={() =>
                                navigate("/admin/teachers")
                            }
                            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Go To Teachers
                        </button>

                    </div>

                </div>

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
                        Add Teacher
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Create a new teacher account
                    </p>

                </div>


                <button
                    onClick={() =>
                        navigate("/admin/teachers")
                    }
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                    Back
                </button>

            </div>



            {/* =========================
                ERROR
            ========================= */}

            {error && (

                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg">
                    {error}
                </div>

            )}



            {/* =========================
                FORM
            ========================= */}

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


                        <Input
                            label="Full Name"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            required
                        />


                        <Input
                            label="Email / Gmail"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />


                        <Input
                            label="Mobile"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleChange}
                            required
                        />


                        <Input
                            label="Qualification"
                            name="qualification"
                            value={formData.qualification}
                            onChange={handleChange}
                            placeholder="e.g. M.Sc, B.Ed"
                            required
                        />


                        <Input
                            label="Experience (Years)"
                            name="experience"
                            type="number"
                            min="0"
                            value={formData.experience}
                            onChange={handleChange}
                        />


                        <Input
                            label="Date of Birth"
                            name="date_of_birth"
                            type="date"
                            value={formData.date_of_birth}
                            onChange={handleChange}
                            required
                        />


                        <Select
                            label="Gender"
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            options={[
                                ["", "Select Gender"],
                                ["MALE", "Male"],
                                ["FEMALE", "Female"],
                                ["OTHER", "Other"]
                            ]}
                        />


                        <Input
                            label="Joining Date"
                            name="joining_date"
                            type="date"
                            value={formData.joining_date}
                            onChange={handleChange}
                            required
                        />


                        <Input
                            label="Photo"
                            name="photo"
                            type="file"
                            accept="image/*"
                            onChange={handleChange}
                        />

                    </div>


                    {/* ADDRESS */}

                    <div className="mt-5">

                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Address
                        </label>

                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            rows="4"
                            placeholder="Enter teacher address"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>

                </div>



                {/* =========================
                    BUTTONS
                ========================= */}

                <div className="flex justify-end gap-3">

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/admin/teachers")
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
                            ? "Creating..."
                            : "Create Teacher"
                        }
                    </button>

                </div>

            </form>

        </div>
    );
}


// =========================
// INPUT
// =========================

function Input ({
    label,
    name,
    value,
    onChange,
    type = "text",
    placeholder = "",
    required = false,
    min
}) {

    return (

        <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>

            <input
                type={type}
                name={name}
                value={type === "file" ? undefined : value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                min={min}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
            />

        </div>

    );
}


// =========================
// SELECT
// =========================

function Select ({
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
                value={value}
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

export default TeacherCreate;