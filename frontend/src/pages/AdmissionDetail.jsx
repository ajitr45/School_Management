import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function AdmissionDetail() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [admission, setAdmission] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const getAdmission = async () => {

            try {

                const response = await api.get(`admissions/${id}/`);

                setAdmission(response.data);

            } catch (error) {

                console.log(error.response?.data);

                setError("Failed to load admission");

            } finally {

                setLoading(false);

            }
        };

        getAdmission();

    }, [id]);


    if (loading) {

        return (
            <div className="p-6">
                <p className="text-gray-500">
                    Loading admission...
                </p>
            </div>
        );

    }


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


            {/* Header */}

            <div className="flex items-center justify-between">

                <div>

                    <h1 className="text-2xl font-bold text-gray-800">
                        Admission Details
                    </h1>

                    <p className="text-gray-500 mt-1">
                        View admission application
                    </p>

                </div>


                <button
                    onClick={() => navigate("/admin/admissions")}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                    Back
                </button>

            </div>


            {/* Application Information */}

            <div className="bg-white rounded-xl shadow p-6">

                <h2 className="text-lg font-semibold text-gray-800 mb-5">
                    Application Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    <Info
                        label="Application No."
                        value={admission.application_no}
                    />

                    <Info
                        label="Student Name"
                        value={admission.student_name}
                    />

                    <Info
                        label="Email"
                        value={admission.student_email || "N/A"}
                    />

                    <Info
                        label="Mobile"
                        value={admission.student_mobile || "N/A"}
                    />

                    <Info
                        label="Date of Birth"
                        value={admission.date_of_birth}
                    />

                    <Info
                        label="Gender"
                        value={admission.gender}
                    />

                    <Info
                        label="Blood Group"
                        value={admission.blood_group || "N/A"}
                    />

                    <Info
                        label="Academic Year"
                        value={admission.academic_year}
                    />

                    <Info
                        label="Applying Class"
                        value={admission.applying_class}
                    />

                    <Info
                        label="Previous School"
                        value={admission.previous_school || "N/A"}
                    />

                    <Info
                        label="Status"
                        value={admission.status}
                    />

                    <Info
                        label="Applied Date"
                        value={
                            admission.applied_date
                                ? new Date(
                                      admission.applied_date
                                  ).toLocaleDateString()
                                : "N/A"
                        }
                    />

                </div>

            </div>


            {/* Guardian Information */}

            <div className="bg-white rounded-xl shadow p-6">

                <h2 className="text-lg font-semibold text-gray-800 mb-5">
                    Guardian Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    <Info
                        label="Father Name"
                        value={admission.father_name}
                    />

                    <Info
                        label="Father Occupation"
                        value={admission.father_occupation || "N/A"}
                    />

                    <Info
                        label="Mother Name"
                        value={admission.mother_name}
                    />

                    <Info
                        label="Mother Occupation"
                        value={admission.mother_occupation || "N/A"}
                    />

                    <Info
                        label="Guardian Mobile"
                        value={admission.guardian_mobile || "N/A"}
                    />

                    <Info
                        label="Guardian Email"
                        value={admission.guardian_email || "N/A"}
                    />

                </div>

            </div>


            {/* Address Information */}

            <div className="bg-white rounded-xl shadow p-6">

                <h2 className="text-lg font-semibold text-gray-800 mb-5">
                    Address Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    <Info
                        label="Address Line 1"
                        value={admission.address_line1}
                    />

                    <Info
                        label="Address Line 2"
                        value={admission.address_line2 || "N/A"}
                    />

                    <Info
                        label="City"
                        value={admission.city}
                    />

                    <Info
                        label="State"
                        value={admission.state}
                    />

                    <Info
                        label="Pin Code"
                        value={admission.pin_code}
                    />

                </div>

            </div>


            {/* Documents */}

            <div className="bg-white rounded-xl shadow p-6">

                <h2 className="text-lg font-semibold text-gray-800 mb-5">
                    Documents
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                    <DocumentLink
                        label="Birth Certificate"
                        file={admission.birth_certificate}
                    />

                    <DocumentLink
                        label="Transfer Certificate"
                        file={admission.transfer_certificate}
                    />

                    <DocumentLink
                        label="Marksheet"
                        file={admission.marksheet}
                    />

                </div>

            </div>


            {/* Approve */}

            {admission.status === "PENDING" && (

                <div className="bg-white rounded-xl shadow p-6">

                    <h2 className="text-lg font-semibold text-gray-800">
                        Admission Action
                    </h2>

                    <p className="text-gray-500 mt-1">
                        Approve this admission to create the student account.
                    </p>

                    <div className="mt-5">

                        <button
                            onClick={() => {
                                // Next step: approve flow
                            }}
                            className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                            Approve Admission
                        </button>

                    </div>

                </div>

            )}

        </div>
    );
}


function Info({ label, value }) {

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


function DocumentLink({ label, file }) {

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


export default AdmissionDetail;