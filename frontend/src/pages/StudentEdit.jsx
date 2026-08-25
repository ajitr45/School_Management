import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function StudentEdit () {

    const { id } = useParams();
    const navigate = useNavigate();

    const [student, setStudent] = useState(null);

    const [classes, setClasses] = useState([]);
    const [sections, setSections] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [formError, setFormError] = useState("");


    // =========================
    // GET STUDENT + CLASSES + SECTIONS
    // =========================

    useEffect(() => {

        const getData = async () => {

            try {

                const [
                    studentResponse,
                    classesResponse,
                    sectionsResponse
                ] = await Promise.all([

                    api.get(`students/${id}/`),
                    api.get("academics/classes/"),
                    api.get("academics/sections/")

                ]);

                setStudent(studentResponse.data);
                setClasses(classesResponse.data);
                setSections(sectionsResponse.data);

            } catch (error) {

                console.log(error.response?.data);

                setError("Failed to load student");

            } finally {

                setLoading(false);

            }

        };

        getData();

    }, [id]);


    // =========================
    // ADMISSION FIELD CHANGE
    // =========================

    const handleAdmissionChange = (e) => {

        const { name, value } = e.target;

        setStudent((prev) => ({

            ...prev,

            admission: {

                ...prev.admission,

                [name]: value

            }

        }));

        setFormError("");

    };


    // =========================
    // CLASS CHANGE
    // =========================

    const handleClassChange = (e) => {

        const value = e.target.value;

        setStudent((prev) => ({

            ...prev,

            school_class: value
                ? Number(value)
                : "",

            section: ""

        }));

        setFormError("");

    };


    // =========================
    // SECTION CHANGE
    // =========================

    const handleSectionChange = (e) => {

        const value = e.target.value;

        setStudent((prev) => ({

            ...prev,

            section: value
                ? Number(value)
                : ""

        }));

        setFormError("");

    };


    // =========================
    // UPDATE STUDENT
    // =========================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setFormError("");


        if (!student.admission?.student_name?.trim()) {

            setFormError(
                "Student name is required"
            );

            return;
        }


        if (!student.school_class) {

            setFormError(
                "Please select a class"
            );

            return;
        }


        if (!student.section) {

            setFormError(
                "Please select a section"
            );

            return;
        }


        try {

            setSaving(true);


            const data = {

                admission: {

                    student_name:
                        student.admission.student_name?.trim() || "",

                    student_email:
                        student.admission.student_email?.trim() || "",

                    student_mobile:
                        student.admission.student_mobile?.trim() || "",

                    date_of_birth:
                        student.admission.date_of_birth || null,

                    gender:
                        student.admission.gender || "",

                    blood_group:
                        student.admission.blood_group || "",

                    previous_school:
                        student.admission.previous_school?.trim() || "",

                    father_name:
                        student.admission.father_name?.trim() || "",

                    father_occupation:
                        student.admission.father_occupation?.trim() || "",

                    mother_name:
                        student.admission.mother_name?.trim() || "",

                    mother_occupation:
                        student.admission.mother_occupation?.trim() || "",

                    guardian_mobile:
                        student.admission.guardian_mobile?.trim() || "",

                    guardian_email:
                        student.admission.guardian_email?.trim() || "",

                    address_line1:
                        student.admission.address_line1?.trim() || "",

                    address_line2:
                        student.admission.address_line2?.trim() || "",

                    city:
                        student.admission.city?.trim() || "",

                    state:
                        student.admission.state?.trim() || "",

                    pin_code:
                        student.admission.pin_code?.trim() || ""

                },

                school_class:
                    Number(student.school_class),

                section:
                    Number(student.section)

            };


            const response = await api.patch(
                `students/${id}/`,
                data
            );


            setStudent(response.data);

            alert(
                "Student updated successfully"
            );

            navigate(
                `/admin/students/${id}`
            );

        } catch (error) {

            console.log(error.response?.data);

            setFormError(

                error.response?.data?.detail ||

                error.response?.data?.admission?.student_email?.[0] ||

                error.response?.data?.admission?.student_name?.[0] ||

                error.response?.data?.school_class?.[0] ||

                error.response?.data?.section?.[0] ||

                "Failed to update student"

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
                    Loading student...
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


    if (!student || !student.admission) {

        return (
            <div className="p-6">

                <p className="text-gray-500">
                    Student information not found
                </p>

            </div>
        );

    }


    // =========================
    // AVAILABLE SECTIONS
    // =========================

    const availableSections = sections.filter(

        (section) =>
            section.school_class ===
            Number(student.school_class)

    );


    return (

        <div className="space-y-6">


            {/* =========================
                HEADER
            ========================= */}

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
                    onClick={() =>
                        navigate(
                            `/admin/students/${id}`
                        )
                    }
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                    Back
                </button>

            </div>



            {/* =========================
                FORM
            ========================= */}

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
                            label="Student ID"
                            value={student.student_id}
                            disabled
                        />


                        <Input
                            label="Student Name"
                            name="student_name"
                            value={
                                student.admission.student_name
                            }
                            onChange={
                                handleAdmissionChange
                            }
                        />


                        <Input
                            label="Email / Gmail"
                            name="student_email"
                            type="email"
                            value={
                                student.admission.student_email
                            }
                            onChange={
                                handleAdmissionChange
                            }
                        />


                        <Input
                            label="Mobile"
                            name="student_mobile"
                            value={
                                student.admission.student_mobile
                            }
                            onChange={
                                handleAdmissionChange
                            }
                        />


                        <Input
                            label="Date of Birth"
                            name="date_of_birth"
                            type="date"
                            value={
                                student.admission.date_of_birth || ""
                            }
                            onChange={
                                handleAdmissionChange
                            }
                        />


                        <Select
                            label="Gender"
                            name="gender"
                            value={
                                student.admission.gender || ""
                            }
                            onChange={
                                handleAdmissionChange
                            }
                            options={[
                                ["", "Select Gender"],
                                ["MALE", "Male"],
                                ["FEMALE", "Female"],
                                ["OTHER", "Other"]
                            ]}
                        />


                        <Select
                            label="Blood Group"
                            name="blood_group"
                            value={
                                student.admission.blood_group || ""
                            }
                            onChange={
                                handleAdmissionChange
                            }
                            options={[
                                ["", "Select Blood Group"],
                                ["A+", "A+"],
                                ["A-", "A-"],
                                ["B+", "B+"],
                                ["B-", "B-"],
                                ["AB+", "AB+"],
                                ["AB-", "AB-"],
                                ["O+", "O+"],
                                ["O-", "O-"]
                            ]}
                        />


                        {/* CLASS */}

                        <Select
                            label="Class"
                            value={
                                student.school_class || ""
                            }
                            onChange={
                                handleClassChange
                            }
                            options={[
                                ["", "Select Class"],

                                ...classes.map(
                                    (schoolClass) => [
                                        schoolClass.id,
                                        schoolClass.name
                                    ]
                                )
                            ]}
                        />


                        {/* SECTION */}

                        <Select
                            label="Section"
                            value={
                                student.section || ""
                            }
                            onChange={
                                handleSectionChange
                            }
                            options={[
                                ["", "Select Section"],

                                ...availableSections.map(
                                    (section) => [
                                        section.id,
                                        `Section ${section.name}`
                                    ]
                                )
                            ]}
                        />


                        <Input
                            label="Previous School"
                            name="previous_school"
                            value={
                                student.admission.previous_school || ""
                            }
                            onChange={
                                handleAdmissionChange
                            }
                        />

                    </div>

                </div>



                {/* =========================
                    FATHER
                ========================= */}

                <div className="bg-white rounded-xl shadow p-6">

                    <h2 className="text-lg font-semibold text-gray-800 mb-5">
                        Father Information
                    </h2>


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        <Input
                            label="Father Name"
                            name="father_name"
                            value={
                                student.admission.father_name || ""
                            }
                            onChange={
                                handleAdmissionChange
                            }
                        />

                        <Input
                            label="Father Occupation"
                            name="father_occupation"
                            value={
                                student.admission.father_occupation || ""
                            }
                            onChange={
                                handleAdmissionChange
                            }
                        />

                    </div>

                </div>



                {/* =========================
                    MOTHER
                ========================= */}

                <div className="bg-white rounded-xl shadow p-6">

                    <h2 className="text-lg font-semibold text-gray-800 mb-5">
                        Mother Information
                    </h2>


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        <Input
                            label="Mother Name"
                            name="mother_name"
                            value={
                                student.admission.mother_name || ""
                            }
                            onChange={
                                handleAdmissionChange
                            }
                        />

                        <Input
                            label="Mother Occupation"
                            name="mother_occupation"
                            value={
                                student.admission.mother_occupation || ""
                            }
                            onChange={
                                handleAdmissionChange
                            }
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
                            value={
                                student.admission.guardian_mobile || ""
                            }
                            onChange={
                                handleAdmissionChange
                            }
                        />

                        <Input
                            label="Guardian Email"
                            name="guardian_email"
                            type="email"
                            value={
                                student.admission.guardian_email || ""
                            }
                            onChange={
                                handleAdmissionChange
                            }
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
                            value={
                                student.admission.address_line1 || ""
                            }
                            onChange={
                                handleAdmissionChange
                            }
                        />

                        <Input
                            label="Address Line 2"
                            name="address_line2"
                            value={
                                student.admission.address_line2 || ""
                            }
                            onChange={
                                handleAdmissionChange
                            }
                        />

                        <Input
                            label="City"
                            name="city"
                            value={
                                student.admission.city || ""
                            }
                            onChange={
                                handleAdmissionChange
                            }
                        />

                        <Input
                            label="State"
                            name="state"
                            value={
                                student.admission.state || ""
                            }
                            onChange={
                                handleAdmissionChange
                            }
                        />

                        <Input
                            label="Pin Code"
                            name="pin_code"
                            value={
                                student.admission.pin_code || ""
                            }
                            onChange={
                                handleAdmissionChange
                            }
                        />

                    </div>

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
                                `/admin/students/${id}`
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
// INPUT COMPONENT
// =========================

function Input ({
    label,
    name,
    value,
    onChange,
    type = "text",
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
                disabled={disabled}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
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


export default StudentEdit;