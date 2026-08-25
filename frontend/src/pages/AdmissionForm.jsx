import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AdmissionForm () {

    const navigate = useNavigate();

    const [classes, setClasses] = useState([]);

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        student_name: "",
        student_email: "",
        student_mobile: "",
        date_of_birth: "",
        gender: "",
        blood_group: "",
        academic_year: "",
        applying_class: "",
        previous_school: "",

        father_name: "",
        father_occupation: "",
        mother_name: "",
        mother_occupation: "",
        guardian_mobile: "",
        guardian_email: "",

        address_line1: "",
        address_line2: "",
        city: "",
        state: "",
        pin_code: "",

        student_photo: null,
        birth_certificate: null,
        transfer_certificate: null,
        marksheet: null,
    });


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

                setError("Failed to load classes");

            } finally {

                setLoading(false);

            }

        };

        getClasses();

    }, []);


    // =========================
    // INPUT CHANGE
    // =========================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

    };


    // =========================
    // FILE CHANGE
    // =========================

    const handleFileChange = (e) => {

        const { name, files } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: files[0] || null
        }));

    };


    // =========================
    // SUBMIT
    // =========================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSubmitting(true);


        try {

            const data = new FormData();


            // =========================
            // STUDENT INFORMATION
            // =========================

            data.append(
                "student_name",
                formData.student_name
            );

            data.append(
                "student_email",
                formData.student_email
            );

            data.append(
                "student_mobile",
                formData.student_mobile
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
                "academic_year",
                formData.academic_year
            );

            data.append(
                "applying_class",
                formData.applying_class
            );


            // =========================
            // OPTIONAL STUDENT FIELDS
            // =========================

            if (formData.blood_group) {

                data.append(
                    "blood_group",
                    formData.blood_group
                );

            }

            if (formData.previous_school) {

                data.append(
                    "previous_school",
                    formData.previous_school
                );

            }


            // =========================
            // PARENTS / GUARDIAN
            // =========================

            data.append(
                "father_name",
                formData.father_name
            );

            data.append(
                "mother_name",
                formData.mother_name
            );


            if (formData.father_occupation) {

                data.append(
                    "father_occupation",
                    formData.father_occupation
                );

            }

            if (formData.mother_occupation) {

                data.append(
                    "mother_occupation",
                    formData.mother_occupation
                );

            }

            if (formData.guardian_mobile) {

                data.append(
                    "guardian_mobile",
                    formData.guardian_mobile
                );

            }

            if (formData.guardian_email) {

                data.append(
                    "guardian_email",
                    formData.guardian_email
                );

            }


            // =========================
            // ADDRESS
            // =========================

            data.append(
                "address_line1",
                formData.address_line1
            );

            data.append(
                "city",
                formData.city
            );

            data.append(
                "state",
                formData.state
            );

            data.append(
                "pin_code",
                formData.pin_code
            );


            if (formData.address_line2) {

                data.append(
                    "address_line2",
                    formData.address_line2
                );

            }


            // =========================
            // DOCUMENTS
            // =========================

            if (formData.student_photo) {

                data.append(
                    "student_photo",
                    formData.student_photo
                );

            }

            if (formData.birth_certificate) {

                data.append(
                    "birth_certificate",
                    formData.birth_certificate
                );

            }

            if (formData.transfer_certificate) {

                data.append(
                    "transfer_certificate",
                    formData.transfer_certificate
                );

            }

            if (formData.marksheet) {

                data.append(
                    "marksheet",
                    formData.marksheet
                );

            }


            // =========================
            // CREATE ADMISSION
            // =========================

            const response = await api.post(
                "admissions/",
                data,
                {
                    headers: {
                        "Content-Type":
                            "multipart/form-data"
                    }
                }
            );


            // =========================
            // SUCCESS PAGE
            // =========================

            navigate("/admission/success", {
                state: {
                    application: response.data
                }
            });


        } catch (error) {

            console.log(error.response?.data);

            const backendError =
                error.response?.data;

            if (backendError) {

                const messages = Object.entries(
                    backendError
                ).map(
                    ([field, message]) =>
                        `${field}: ${message}`
                );

                setError(messages.join(" | "));

            } else {

                setError(
                    "Failed to submit admission application"
                );

            }

        } finally {

            setSubmitting(false);

        }

    };


    // =========================
    // LOADING
    // =========================

    if (loading) {

        return (
            <div className="p-6">

                <p className="text-gray-500">
                    Loading form...
                </p>

            </div>
        );

    }


    // =========================
    // ERROR LOADING CLASSES
    // =========================

    if (error && classes.length === 0) {

        return (
            <div className="p-6">

                <p className="text-red-600">
                    {error}
                </p>

            </div>
        );

    }


    return (

        <div className="max-w-5xl mx-auto space-y-6">

            {/* HEADER */}

            <div>

                <h1 className="text-2xl font-bold text-gray-800">
                    Admission Form
                </h1>

                <p className="text-gray-500 mt-1">
                    Fill student admission application
                </p>

            </div>


            {/* ERROR */}

            {error && (

                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                    {error}
                </div>

            )}


            <form
                onSubmit={handleSubmit}
                className="space-y-6"
            >


                {/* =========================
                    STUDENT INFORMATION
                ========================= */}

                <div className="bg-white rounded-xl shadow p-6">

                    <h2 className="text-lg font-semibold text-gray-800 mb-5">
                        Student Information
                    </h2>


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">


                        <Input
                            label="Student Name"
                            name="student_name"
                            value={formData.student_name}
                            onChange={handleChange}
                            required
                        />


                        <Input
                            label="Email / Gmail"
                            name="student_email"
                            type="email"
                            value={formData.student_email}
                            onChange={handleChange}
                            required
                        />


                        <Input
                            label="Mobile"
                            name="student_mobile"
                            value={formData.student_mobile}
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


                        {/* GENDER */}

                        <Select
                            label="Gender"
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            required
                        >

                            <option value="">
                                Select Gender
                            </option>

                            <option value="MALE">
                                Male
                            </option>

                            <option value="FEMALE">
                                Female
                            </option>

                            <option value="OTHER">
                                Other
                            </option>

                        </Select>


                        {/* BLOOD GROUP */}

                        <Select
                            label="Blood Group"
                            name="blood_group"
                            value={formData.blood_group}
                            onChange={handleChange}
                        >

                            <option value="">
                                Select Blood Group
                            </option>

                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>

                        </Select>


                        {/* ACADEMIC YEAR */}

                        <Input
                            label="Academic Year"
                            name="academic_year"
                            placeholder="2026-27"
                            value={formData.academic_year}
                            onChange={handleChange}
                            required
                        />


                        {/* CLASS */}

                        <Select
                            label="Applying Class"
                            name="applying_class"
                            value={formData.applying_class}
                            onChange={handleChange}
                            required
                        >

                            <option value="">
                                Select Class
                            </option>

                            {classes.map((schoolClass) => (

                                <option
                                    key={schoolClass.id}
                                    value={schoolClass.id}
                                >
                                    {schoolClass.name}
                                </option>

                            ))}

                        </Select>


                        <Input
                            label="Previous School"
                            name="previous_school"
                            value={formData.previous_school}
                            onChange={handleChange}
                        />


                        {/* STUDENT PHOTO */}

                        <FileInput
                            label="Student Photo"
                            name="student_photo"
                            onChange={handleFileChange}
                        />

                    </div>

                </div>



                {/* =========================
                    FATHER INFORMATION
                ========================= */}

                <div className="bg-white rounded-xl shadow p-6">

                    <h2 className="text-lg font-semibold text-gray-800 mb-5">
                        Father Information
                    </h2>


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        <Input
                            label="Father Name"
                            name="father_name"
                            value={formData.father_name}
                            onChange={handleChange}
                            required
                        />

                        <Input
                            label="Father Occupation"
                            name="father_occupation"
                            value={formData.father_occupation}
                            onChange={handleChange}
                        />

                    </div>

                </div>



                {/* =========================
                    MOTHER INFORMATION
                ========================= */}

                <div className="bg-white rounded-xl shadow p-6">

                    <h2 className="text-lg font-semibold text-gray-800 mb-5">
                        Mother Information
                    </h2>


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        <Input
                            label="Mother Name"
                            name="mother_name"
                            value={formData.mother_name}
                            onChange={handleChange}
                            required
                        />

                        <Input
                            label="Mother Occupation"
                            name="mother_occupation"
                            value={formData.mother_occupation}
                            onChange={handleChange}
                        />

                    </div>

                </div>



                {/* =========================
                    GUARDIAN
                ========================= */}

                <div className="bg-white rounded-xl shadow p-6">

                    <h2 className="text-lg font-semibold text-gray-800 mb-5">
                        Guardian Information
                    </h2>


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        <Input
                            label="Guardian Mobile"
                            name="guardian_mobile"
                            value={formData.guardian_mobile}
                            onChange={handleChange}
                        />

                        <Input
                            label="Guardian Email"
                            name="guardian_email"
                            type="email"
                            value={formData.guardian_email}
                            onChange={handleChange}
                        />

                    </div>

                </div>



                {/* =========================
                    ADDRESS
                ========================= */}

                <div className="bg-white rounded-xl shadow p-6">

                    <h2 className="text-lg font-semibold text-gray-800 mb-5">
                        Address Information
                    </h2>


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        <Input
                            label="Address Line 1"
                            name="address_line1"
                            value={formData.address_line1}
                            onChange={handleChange}
                            required
                        />

                        <Input
                            label="Address Line 2"
                            name="address_line2"
                            value={formData.address_line2}
                            onChange={handleChange}
                        />

                        <Input
                            label="City"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            required
                        />

                        <Input
                            label="State"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            required
                        />

                        <Input
                            label="Pin Code"
                            name="pin_code"
                            value={formData.pin_code}
                            onChange={handleChange}
                            required
                        />

                    </div>

                </div>



                {/* =========================
                    DOCUMENTS
                ========================= */}

                <div className="bg-white rounded-xl shadow p-6">

                    <h2 className="text-lg font-semibold text-gray-800 mb-5">
                        Documents
                    </h2>


                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                        <FileInput
                            label="Birth Certificate"
                            name="birth_certificate"
                            onChange={handleFileChange}
                        />

                        <FileInput
                            label="Transfer Certificate"
                            name="transfer_certificate"
                            onChange={handleFileChange}
                        />

                        <FileInput
                            label="Marksheet"
                            name="marksheet"
                            onChange={handleFileChange}
                        />

                    </div>

                </div>



                {/* =========================
                    SUBMIT
                ========================= */}

                <div className="flex justify-end">

                    <button
                        type="submit"
                        disabled={submitting}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >

                        {submitting
                            ? "Submitting..."
                            : "Submit Admission"}

                    </button>

                </div>

            </form>

        </div>
    );
}



// =========================
// INPUT COMPONENT
// =========================

function Input ({
    label,
    name,
    type = "text",
    value,
    onChange,
    placeholder,
    required = false
}) {

    return (

        <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
                {required && (
                    <span className="text-red-500 ml-1">
                        *
                    </span>
                )}
            </label>

            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
            />

        </div>

    );

}



// =========================
// SELECT COMPONENT
// =========================

function Select ({
    label,
    name,
    value,
    onChange,
    children,
    required = false
}) {

    return (

        <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
                {required && (
                    <span className="text-red-500 ml-1">
                        *
                    </span>
                )}
            </label>

            <select
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >

                {children}

            </select>

        </div>

    );

}



// =========================
// FILE COMPONENT
// =========================

function FileInput ({label, name, onChange}) 

{

    return (

        <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>

            <input
                type="file"
                name={name}
                onChange={onChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm"
            />

        </div>

    );

}


export default AdmissionForm;