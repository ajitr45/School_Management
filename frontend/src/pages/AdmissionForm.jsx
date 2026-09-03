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

    useEffect(() => {
        const getClasses = async () => {
            try {
                const response = await api.get("academics/classes/");
                setClasses(response.data);
            } catch (error) {
                console.log(error.response?.data);
                setError("Failed to load classes.");
            } finally {
                setLoading(false);
            }
        };

        getClasses();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: files[0] || null,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSubmitting(true);

        try {
            const data = new FormData();

            Object.entries(formData).forEach(([key, value]) => {
                if (value !== null && value !== "") {
                    data.append(key, value);
                }
            });

            const response = await api.post(
                "admissions/",
                data,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            navigate("/admission/success", {
                state: {
                    application: response.data,
                },
            });
        } catch (error) {
            console.log(error.response?.data);

            const backendError = error.response?.data;

            if (backendError) {
                const messages = Object.entries(backendError).map(
                    ([field, message]) =>
                        `${field}: ${Array.isArray(message) ? message.join(", ") : message}`
                );

                setError(messages.join(" | "));
            } else {
                setError("Failed to submit admission application.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center">
                <p className="text-gray-500">
                    Loading admission form...
                </p>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 py-12 px-6">
            <div className="max-w-6xl mx-auto">

                <div className="text-center mb-10">
                    <p className="text-blue-600 font-semibold uppercase tracking-wide">
                        Admissions
                    </p>

                    <h1 className="text-4xl font-bold text-blue-950 mt-2">
                        Apply for Admission
                    </h1>

                    <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
                        Fill out the application form carefully and
                        provide the required information and documents.
                    </p>
                </div>

                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-5 py-4 rounded-xl">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">

                    <Section title="Student Information">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                            <Input
                                label="Student Name"
                                name="student_name"
                                value={formData.student_name}
                                onChange={handleChange}
                                required
                            />

                            <Input
                                label="Email"
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
                                <option value="MALE">Male</option>
                                <option value="FEMALE">Female</option>
                                <option value="OTHER">Other</option>
                            </Select>

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

                            <Input
                                label="Academic Year"
                                name="academic_year"
                                placeholder="2026-27"
                                value={formData.academic_year}
                                onChange={handleChange}
                                required
                            />

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

                            <FileInput
                                label="Student Photo"
                                name="student_photo"
                                onChange={handleFileChange}
                            />

                        </div>

                    </Section>

                    <Section title="Parent / Guardian Information">

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

                    </Section>

                    <Section title="Address Information">

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

                    </Section>

                    <Section title="Required Documents">

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

                    </Section>

                    <div className="bg-white rounded-2xl shadow-sm border p-6">

                        <div className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                required
                                className="mt-1 w-4 h-4"
                            />

                            <p className="text-sm text-gray-600 leading-6">
                                I confirm that the information provided
                                in this admission application is correct
                                and complete to the best of my knowledge.
                            </p>
                        </div>

                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            {submitting
                                ? "Submitting..."
                                : "Submit Application"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}

function Section ({ title, children }) {
    return (
        <section className="bg-white rounded-2xl shadow-sm border p-6 md:p-8">

            <div className="mb-6">
                <h2 className="text-xl font-bold text-blue-950">
                    {title}
                </h2>

                <div className="w-12 h-1 bg-blue-600 rounded-full mt-3" />
            </div>

            {children}

        </section>
    );
}

function Input ({
    label,
    name,
    type = "text",
    value,
    onChange,
    placeholder,
    required = false,
}) {
    return (
        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            />
        </div>
    );
}

function Select ({
    label,
    name,
    value,
    onChange,
    children,
    required = false,
}) {
    return (
        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            >
                {children}
            </select>
        </div>
    );
}

function FileInput ({ label, name, onChange }) {
    return (
        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
                {label}
            </label>

            <input
                type="file"
                name={name}
                onChange={onChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-gray-50"
            />
        </div>
    );
}

export default AdmissionForm;