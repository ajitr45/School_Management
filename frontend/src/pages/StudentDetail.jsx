import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function StudentDetail () {

    const { id } = useParams();
    const navigate = useNavigate();

    const [student, setStudent] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // =========================
    // GET STUDENT
    // =========================

    useEffect(() => {

        const getStudent = async () => {

            try {

                const response = await api.get(
                    `students/${id}/`
                );

                setStudent(response.data);

            } catch (error) {

                console.log(error.response?.data);

                setError("Failed to load student");

            } finally {

                setLoading(false);

            }

        };

        getStudent();

    }, [id]);


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


    if (!student) {

        return (
            <div className="p-6">

                <p className="text-gray-500">
                    Student not found
                </p>

            </div>
        );

    }


    const admission = student.admission;


    return (

        <div className="space-y-6">


            {/* =========================
                HEADER
            ========================= */}

            <div className="flex items-center justify-between">

                <div>

                    <h1 className="text-2xl font-bold text-gray-800">
                        Student Details
                    </h1>

                    <p className="text-gray-500 mt-1">
                        View complete student information
                    </p>

                </div>


                <button
                    onClick={() =>
                        navigate("/admin/students")
                    }
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                    Back
                </button>

            </div>



            {/* =========================
                STUDENT INFORMATION
            ========================= */}

            <div className="bg-white rounded-xl shadow p-6">

                <h2 className="text-lg font-semibold text-gray-800 mb-5">
                    Student Information
                </h2>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    <Info
                        label="Student ID"
                        value={student.student_id}
                    />

                    <Info
                        label="Student Name"
                        value={admission?.student_name}
                    />

                    <Info
                        label="Email / Gmail"
                        value={admission?.student_email}
                    />

                    <Info
                        label="Mobile"
                        value={admission?.student_mobile}
                    />

                    <Info
                        label="Date of Birth"
                        value={admission?.date_of_birth}
                    />

                    <Info
                        label="Gender"
                        value={admission?.gender}
                    />

                    <Info
                        label="Blood Group"
                        value={admission?.blood_group}
                    />

                    <Info
                        label="Academic Year"
                        value={admission?.academic_year}
                    />

                    <Info
                        label="Class"
                        value={student.school_class_detail?.name}
                    />

                    <Info
                        label="Section"
                        value={
                            student.section_detail
                                ? `Section ${student.section_detail.name}`
                                : null
                        }
                    />

                    <Info
                        label="Previous School"
                        value={admission?.previous_school}
                    />

                    <Info
                        label="Admission Status"
                        value={admission?.status}
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

                    <Info
                        label="Father Name"
                        value={admission?.father_name}
                    />

                    <Info
                        label="Father Occupation"
                        value={admission?.father_occupation}
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

                    <Info
                        label="Mother Name"
                        value={admission?.mother_name}
                    />

                    <Info
                        label="Mother Occupation"
                        value={admission?.mother_occupation}
                    />

                </div>

            </div>



            {/* =========================
                GUARDIAN INFORMATION
            ========================= */}

            <div className="bg-white rounded-xl shadow p-6">

                <h2 className="text-lg font-semibold text-gray-800 mb-5">
                    Guardian Information
                </h2>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    <Info
                        label="Guardian Mobile"
                        value={admission?.guardian_mobile}
                    />

                    <Info
                        label="Guardian Email"
                        value={admission?.guardian_email}
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

                    <Info
                        label="Address Line 1"
                        value={admission?.address_line1}
                    />

                    <Info
                        label="Address Line 2"
                        value={admission?.address_line2}
                    />

                    <Info
                        label="City"
                        value={admission?.city}
                    />

                    <Info
                        label="State"
                        value={admission?.state}
                    />

                    <Info
                        label="Pin Code"
                        value={admission?.pin_code}
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


                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                    <DocumentLink
                        label="Birth Certificate"
                        file={admission?.birth_certificate}
                    />

                    <DocumentLink
                        label="Transfer Certificate"
                        file={admission?.transfer_certificate}
                    />

                    <DocumentLink
                        label="Marksheet"
                        file={admission?.marksheet}
                    />

                </div>

            </div>



            {/* =========================
                EDIT BUTTON
            ========================= */}

            <div className="flex justify-end">

                <button
                    onClick={() =>
                        navigate(
                            `/admin/students/${student.id}/edit`
                        )
                    }
                    className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Edit Student
                </button>

            </div>

        </div>
    );
}



// =========================
// INFO COMPONENT
// =========================

function Info ({ label, value }) {

    return (

        <div>

            <p className="text-sm text-gray-500">
                {label}
            </p>

            <p className="font-medium text-gray-800 mt-1">
                {value || "N/A"}
            </p>

        </div>

    );
}



// =========================
// DOCUMENT COMPONENT
// =========================

function DocumentLink ({ label, file }) {

    return (

        <div className="border rounded-lg p-4">

            <p className="text-sm text-gray-500 mb-2">
                {label}
            </p>


            {file ? (

                <a
                    href={file}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline"
                >
                    View Document
                </a>

            ) : (

                <p className="text-gray-400 text-sm">
                    Not uploaded
                </p>

            )}

        </div>

    );

}


export default StudentDetail;