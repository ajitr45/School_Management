import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function TeacherAssignment () {

    const navigate = useNavigate();

    const [teachers, setTeachers] = useState([]);
    const [classes, setClasses] = useState([]);
    const [sections, setSections] = useState([]);
    const [subjects, setSubjects] = useState([]);

    const [teacher, setTeacher] = useState("");
    const [schoolClass, setSchoolClass] = useState("");
    const [section, setSection] = useState("");
    const [subject, setSubject] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    // =========================
    // GET TEACHERS + CLASSES
    // =========================

    useEffect(() => {

        const getData = async () => {

            try {

                const [
                    teachersResponse,
                    classesResponse,
                    sectionsResponse,
                    subjectsResponse
                ] = await Promise.all([

                    api.get("teachers/list/"),
                    api.get("academics/classes/"),
                    api.get("academics/sections/"),
                    api.get("academics/subjects/")

                ]);

                setTeachers(teachersResponse.data);
                setClasses(classesResponse.data);
                setSections(sectionsResponse.data);
                setSubjects(subjectsResponse.data);

            } catch (error) {

                console.log(error.response?.data);

                setError(
                    "Failed to load assignment data."
                );

            } finally {

                setLoading(false);

            }

        };

        getData();

    }, []);


    // =========================
    // CLASS CHANGE
    // =========================

    const handleClassChange = (e) => {

        const value = e.target.value;

        setSchoolClass(value);

        // Class change hone par
        // purana section aur subject hata do

        setSection("");
        setSubject("");

        setError("");
        setSuccess("");

    };


    // =========================
    // ASSIGN TEACHER
    // =========================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");


        // Frontend validation

        if (!teacher) {

            setError("Please select a teacher.");
            return;

        }

        if (!schoolClass) {

            setError("Please select a class.");
            return;

        }

        if (!section) {

            setError("Please select a section.");
            return;

        }

        if (!subject) {

            setError("Please select a subject.");
            return;

        }


        try {

            setSaving(true);


            const data = {

                teacher: Number(teacher),

                school_class:
                    Number(schoolClass),

                section:
                    Number(section),

                subject:
                    Number(subject)

            };


            const response = await api.post(
                "teachers/assign/",
                data
            );


            console.log(response.data);


            setSuccess(
                "Teacher assigned successfully."
            );


            // Form reset

            setTeacher("");
            setSchoolClass("");
            setSection("");
            setSubject("");


        } catch (error) {

            console.log(error.response?.data);


            setError(

                error.response?.data?.detail ||

                error.response?.data?.section ||

                error.response?.data?.subject ||

                "Failed to assign teacher."

            );

        } finally {

            setSaving(false);

        }

    };


    // =========================
    // FILTER SECTIONS
    // =========================

    const availableSections = sections.filter(
        (item) =>
            item.school_class ===
            Number(schoolClass)
    );


    // =========================
    // FILTER SUBJECTS
    // =========================

    const availableSubjects = subjects.filter(
        (item) =>
            item.school_class ===
            Number(schoolClass)
    );


    // =========================
    // LOADING
    // =========================

    if (loading) {

        return (
            <div className="p-6">

                <p className="text-gray-500">
                    Loading assignment data...
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
                        Teacher Assignment
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Assign a teacher to a class, section and subject.
                    </p>

                </div>


                <button
                    type="button"
                    onClick={() =>
                        navigate("/admin/teachers")
                    }
                    className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                    Back
                </button>

            </div>


            {/* =========================
                ERROR
            ========================= */}

            {error && (

                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">

                    {error}

                </div>

            )}


            {/* =========================
                SUCCESS
            ========================= */}

            {success && (

                <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">

                    {success}

                </div>

            )}


            {/* =========================
                FORM
            ========================= */}

            <div className="bg-white rounded-xl shadow p-6">

                <h2 className="text-lg font-semibold text-gray-800 mb-6">
                    Assign Teacher
                </h2>


                <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">


                        {/* TEACHER */}

                        <Select
                            label="Teacher"
                            value={teacher}
                            onChange={(e) =>
                                setTeacher(e.target.value)
                            }
                            options={[
                                ["", "Select Teacher"],

                                ...teachers.map(
                                    (item) => [
                                        item.teacher_id,
                                        `${item.full_name} (${item.teacher_id})`
                                    ]
                                )
                            ]}
                        />


                        {/* CLASS */}

                        <Select
                            label="Class"
                            value={schoolClass}
                            onChange={handleClassChange}
                            options={[
                                ["", "Select Class"],

                                ...classes.map(
                                    (item) => [
                                        item.id,
                                        item.name
                                    ]
                                )
                            ]}
                        />


                        {/* SECTION */}

                        <Select
                            label="Section"
                            value={section}
                            onChange={(e) =>
                                setSection(e.target.value)
                            }
                            disabled={!schoolClass}
                            options={[
                                [
                                    "",
                                    schoolClass
                                        ? "Select Section"
                                        : "Select Class First"
                                ],

                                ...availableSections.map(
                                    (item) => [
                                        item.id,
                                        item.name
                                    ]
                                )
                            ]}
                        />


                        {/* SUBJECT */}

                        <Select
                            label="Subject"
                            value={subject}
                            onChange={(e) =>
                                setSubject(e.target.value)
                            }
                            disabled={!schoolClass}
                            options={[
                                [
                                    "",
                                    schoolClass
                                        ? "Select Subject"
                                        : "Select Class First"
                                ],

                                ...availableSubjects.map(
                                    (item) => [
                                        item.id,
                                        item.name
                                    ]
                                )
                            ]}
                        />

                    </div>


                    {/* =========================
                        INFO
                    ========================= */}

                    {schoolClass && (

                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">

                            <p className="text-sm text-blue-700">

                                Section and Subject are filtered
                                according to the selected class.

                            </p>

                        </div>

                    )}


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
                            disabled={
                                saving ||
                                !teacher ||
                                !schoolClass ||
                                !section ||
                                !subject
                            }
                            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >

                            {saving
                                ? "Assigning..."
                                : "Assign Teacher"
                            }

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );
}


// =========================
// SELECT COMPONENT
// =========================

function Select ({
    label,
    value,
    onChange,
    options,
    disabled = false
}) {

    return (

        <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>

            <select
                value={value}
                onChange={onChange}
                disabled={disabled}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
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


export default TeacherAssignment;