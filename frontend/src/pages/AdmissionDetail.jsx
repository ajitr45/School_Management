import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function AdmissionDetail () {

    const { id } = useParams();
    const navigate = useNavigate();

    const [admission, setAdmission] = useState(null);
    const [classes, setClasses] = useState([]);
    const [sections, setSections] = useState([]);

    const [selectedSection, setSelectedSection] = useState("");

    const [credentials, setCredentials] = useState(null);

    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    const [error, setError] = useState("");
    const [actionError, setActionError] = useState("");


    // =========================
    // GET ADMISSION + CLASS + SECTION
    // =========================

    useEffect(() => {

        const getData = async () => {

            try {

                const [
                    admissionResponse,
                    classesResponse,
                    sectionsResponse
                ] = await Promise.all([

                    api.get(`admissions/${id}/`),
                    api.get("academics/classes/"),
                    api.get("academics/sections/")

                ]);

                setAdmission(admissionResponse.data);
                setClasses(classesResponse.data);
                setSections(sectionsResponse.data);

            } catch (error) {

                console.log(error.response?.data);

                setError("Failed to load admission");

            } finally {

                setLoading(false);

            }

        };

        getData();

    }, [id]);


    // =========================
    // GET CLASS NAME
    // =========================

    const schoolClass = admission
        ? classes.find(
            (item) =>
                item.id === admission.applying_class
        )
        : null;


    // =========================
    // AVAILABLE SECTIONS
    // =========================

    const availableSections = admission
        ? sections.filter(
            (section) =>
                section.school_class ===
                admission.applying_class
        )
        : [];


    // =========================
    // APPROVE
    // =========================

    const handleApprove = async () => {

        setActionError("");


        if (!selectedSection) {

            setActionError("Please select a section");

            return;
        }


        try {

            setProcessing(true);


            const response = await api.patch(
                `admissions/${id}/approve/`,
                {
                    section: Number(selectedSection)
                }
            );


            // Save credentials
            setCredentials(response.data);


            // Update admission status
            setAdmission((prev) => ({
                ...prev,
                status: "APPROVED"
            }));


            setSelectedSection("");

        } catch (error) {

            console.log(error.response?.data);

            setActionError(
                error.response?.data?.detail ||
                error.response?.data?.section?.[0] ||
                "Failed to approve admission"
            );

        } finally {

            setProcessing(false);

        }

    };


    // =========================
    // REJECT
    // =========================

    const handleReject = async () => {

        setActionError("");


        const confirmReject =
            window.confirm(
                "Are you sure you want to reject this admission?"
            );


        if (!confirmReject) {
            return;
        }


        try {

            setProcessing(true);


            await api.patch(
                `admissions/${id}/reject/`
            );


            setAdmission((prev) => ({
                ...prev,
                status: "REJECTED"
            }));


        } catch (error) {

            console.log(error.response?.data);

            setActionError(
                error.response?.data?.detail ||
                "Failed to reject admission"
            );

        } finally {

            setProcessing(false);

        }

    };


    // =========================
    // LOADING
    // =========================

    if (loading) {

        return (
            <div className="p-6">

                <p className="text-gray-500">
                    Loading admission...
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


    if (!admission) {

        return (
            <div className="p-6">

                <p className="text-gray-500">
                    Admission not found
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
                        Admission Details
                    </h1>

                    <p className="text-gray-500 mt-1">
                        View and manage admission application
                    </p>

                </div>


                <button
                    onClick={() =>
                        navigate("/admin/admissions")
                    }
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                    Back
                </button>

            </div>



            {/* =========================
                STATUS
            ========================= */}

            <div className="bg-white rounded-xl shadow p-6">

                <div className="flex items-center justify-between">

                    <div>

                        <p className="text-sm text-gray-500">
                            Application No.
                        </p>

                        <p className="text-lg font-semibold text-gray-800 mt-1">
                            {admission.application_no}
                        </p>

                    </div>


                    <StatusBadge
                        status={admission.status}
                    />

                </div>

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
                        label="Student Name"
                        value={admission.student_name}
                    />

                    <Info
                        label="Email / Gmail"
                        value={admission.student_email}
                    />

                    <Info
                        label="Mobile"
                        value={admission.mobile}
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
                        value={admission.blood_group}
                    />

                    <Info
                        label="Applying Class"
                        value={schoolClass?.name}
                    />

                    <Info
                        label="Academic Year"
                        value={admission.academic_year}
                    />

                    <Info
                        label="Previous School"
                        value={admission.previous_school}
                    />

                    <Info
                        label="Applied Date"
                        value={
                            admission.applied_date
                                ? new Date(
                                    admission.applied_date
                                ).toLocaleDateString()
                                : null
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

                    <Info
                        label="Father Name"
                        value={admission.father_name}
                    />

                    <Info
                        label="Father Occupation"
                        value={admission.father_occupation}
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

                    <Info
                        label="Mother Name"
                        value={admission.mother_name}
                    />

                    <Info
                        label="Mother Occupation"
                        value={admission.mother_occupation}
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

                    <Info
                        label="Guardian Mobile"
                        value={admission.guardian_mobile}
                    />

                    <Info
                        label="Guardian Email"
                        value={admission.guardian_email}
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
                        value={admission.address_line1}
                    />

                    <Info
                        label="Address Line 2"
                        value={admission.address_line2}
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



            {/* =========================
                ACTION
            ========================= */}

            {admission.status === "PENDING" && (

                <div className="bg-white rounded-xl shadow p-6">

                    <h2 className="text-lg font-semibold text-gray-800 mb-5">
                        Admission Action
                    </h2>


                    {/* SECTION */}

                    <div className="max-w-md">

                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Section
                        </label>

                        <select
                            value={selectedSection}
                            onChange={(e) => {

                                setSelectedSection(
                                    e.target.value
                                );

                                setActionError("");

                            }}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >

                            <option value="">
                                Select Section
                            </option>

                            {availableSections.map(
                                (section) => (

                                    <option
                                        key={section.id}
                                        value={section.id}
                                    >
                                        Section {section.name}
                                    </option>

                                )
                            )}

                        </select>

                    </div>


                    {/* ERROR */}

                    {actionError && (

                        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mt-4">
                            {actionError}
                        </div>

                    )}


                    {/* BUTTONS */}

                    <div className="flex gap-3 mt-5">

                        <button
                            onClick={handleApprove}
                            disabled={processing}
                            className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                        >
                            {processing
                                ? "Processing..."
                                : "Approve Admission"}
                        </button>


                        <button
                            onClick={handleReject}
                            disabled={processing}
                            className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                        >
                            Reject Admission
                        </button>

                    </div>

                </div>

            )}



            {/* =========================
                APPROVAL CREDENTIALS
            ========================= */}

            {credentials && (

                <div className="bg-green-50 border border-green-200 rounded-xl p-6">

                    <h2 className="text-lg font-semibold text-green-800 mb-2">
                        Admission Approved Successfully
                    </h2>

                    <p className="text-sm text-green-700 mb-5">
                        Save these student login credentials.
                        The password will not be available again.
                    </p>


                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">


                        <Credential
                            label="Student ID"
                            value={credentials.student_id}
                        />


                        <Credential
                            label="Username"
                            value={credentials.username}
                        />


                        <Credential
                            label="Password"
                            value={credentials.password}
                        />

                    </div>

                </div>

            )}



            {/* =========================
                REJECTED MESSAGE
            ========================= */}

            {admission.status === "REJECTED" && (

                <div className="bg-red-50 border border-red-200 rounded-xl p-6">

                    <h2 className="text-lg font-semibold text-red-800">
                        Admission Rejected
                    </h2>

                    <p className="text-sm text-red-700 mt-1">
                        This admission application has been rejected.
                    </p>

                </div>

            )}



            {/* =========================
                APPROVED MESSAGE
            ========================= */}

            {admission.status === "APPROVED" && !credentials && (

                <div className="bg-green-50 border border-green-200 rounded-xl p-6">

                    <h2 className="text-lg font-semibold text-green-800">
                        Admission Approved
                    </h2>

                    <p className="text-sm text-green-700 mt-1">
                        This admission has already been converted into a student.
                    </p>

                </div>

            )}

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
// STATUS BADGE
// =========================

function StatusBadge ({ status }) {

    const classes =
        status === "PENDING"
            ? "bg-yellow-100 text-yellow-700"
            : status === "APPROVED"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700";


    return (
        <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${classes}`}
        >
            {status}
        </span>
    );

}



// =========================
// CREDENTIAL COMPONENT
// =========================

function Credential ({ label, value }) {

    return (
        <div className="bg-white border border-green-200 rounded-lg p-4">

            <p className="text-sm text-gray-500">
                {label}
            </p>

            <p className="font-semibold text-gray-800 mt-1 break-all">
                {value || "N/A"}
            </p>

        </div>
    );

}


export default AdmissionDetail;