import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function TimetableCreate () {

    const navigate = useNavigate();

    // =====================================================
    // DROPDOWN DATA
    // =====================================================

    const [classes, setClasses] = useState([]);
    const [sections, setSections] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [teachers, setTeachers] = useState([]);

    // =====================================================
    // FORM
    // =====================================================

    const [formData, setFormData] = useState({
        school_class: "",
        section: "",
        subject: "",
        teacher: "",
        day: "",
        period: "",
        start_time: "",
        end_time: "",
    });

    // =====================================================
    // STATE
    // =====================================================

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});


    // =====================================================
    // LOAD CLASSES + SECTIONS + SUBJECTS + TEACHERS
    // =====================================================

    useEffect(() => {

        const loadData = async () => {

            try {

                setLoading(true);
                setError("");

                const [
                    classResponse,
                    sectionResponse,
                    subjectResponse,
                    teacherResponse,
                ] = await Promise.all([

                    api.get("academics/classes/"),

                    api.get("academics/sections/"),

                    api.get("academics/subjects/"),

                    api.get("teachers/list/"),

                ]);


                const classData = Array.isArray(classResponse.data)
                    ? classResponse.data
                    : classResponse.data.results || [];


                const sectionData = Array.isArray(sectionResponse.data)
                    ? sectionResponse.data
                    : sectionResponse.data.results || [];


                const subjectData = Array.isArray(subjectResponse.data)
                    ? subjectResponse.data
                    : subjectResponse.data.results || [];


                const teacherData = Array.isArray(teacherResponse.data)
                    ? teacherResponse.data
                    : teacherResponse.data.results || [];


                setClasses(classData);
                setSections(sectionData);
                setSubjects(subjectData);
                setTeachers(teacherData);

            } catch (error) {

                console.log(
                    "TIMETABLE CREATE LOAD ERROR:",
                    error.response?.data
                );

                setError(
                    "Failed to load classes, sections, subjects and teachers."
                );

            } finally {

                setLoading(false);

            }

        };

        loadData();

    }, []);


    // =====================================================
    // INPUT CHANGE
    // =====================================================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        setFieldErrors((previous) => ({
            ...previous,
            [name]: "",
        }));

        setError("");


        // =================================================
        // CLASS CHANGE
        // =================================================

        if (name === "school_class") {

            setFormData((previous) => ({
                ...previous,
                school_class: value,
                section: "",
                subject: "",
            }));

        }

    };


    // =====================================================
    // FILTER SECTION BY CLASS
    // =====================================================

    const filteredSections = sections.filter(
        (section) =>
            String(section.school_class) ===
            String(formData.school_class)
    );


    // =====================================================
    // FILTER SUBJECT BY CLASS
    // =====================================================

    const filteredSubjects = subjects.filter(
        (subject) =>
            String(subject.school_class) ===
            String(formData.school_class)
    );


    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setFieldErrors({});


        // =================================================
        // BASIC FRONTEND VALIDATION
        // =================================================

        if (!formData.school_class) {

            setError("Please select a class.");
            return;

        }

        if (!formData.section) {

            setError("Please select a section.");
            return;

        }

        if (!formData.subject) {

            setError("Please select a subject.");
            return;

        }

        if (!formData.teacher) {

            setError("Please select a teacher.");
            return;

        }

        if (!formData.day) {

            setError("Please select a day.");
            return;

        }

        if (!formData.period) {

            setError("Please enter period.");
            return;

        }

        if (!formData.start_time) {

            setError("Please select start time.");
            return;

        }

        if (!formData.end_time) {

            setError("Please select end time.");
            return;

        }


        // =================================================
        // TIME VALIDATION
        // =================================================

        if (formData.start_time >= formData.end_time) {

            setError(
                "End time must be greater than start time."
            );

            return;

        }


        try {

            setSaving(true);


            const response = await api.post(
                "timetable/",
                {
                    school_class: Number(
                        formData.school_class
                    ),

                    section: Number(
                        formData.section
                    ),

                    subject: Number(
                        formData.subject
                    ),

                    teacher: Number(
                        formData.teacher
                    ),

                    day: formData.day,

                    period: Number(
                        formData.period
                    ),

                    start_time: formData.start_time,

                    end_time: formData.end_time,
                }
            );


            console.log(
                "TIMETABLE CREATED:",
                response.data
            );


            // =================================================
            // SUCCESS
            // =================================================

            navigate("/admin/timetable");

        } catch (error) {

            console.log(
                "CREATE TIMETABLE ERROR:",
                error.response?.data
            );


            const responseData =
                error.response?.data;


            if (
                responseData &&
                typeof responseData === "object"
            ) {

                setFieldErrors(responseData);

            } else {

                setError(
                    "Failed to create timetable."
                );

            }

        } finally {

            setSaving(false);

        }

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="py-12 text-center text-gray-500">

                Loading form...

            </div>

        );

    }


    return (

        <div className="max-w-4xl mx-auto space-y-6">


            {/* =================================================
                HEADER
            ================================================= */}

            <div>

                <button
                    type="button"
                    onClick={() =>
                        navigate("/admin/timetable")
                    }
                    className="text-sm text-blue-600 hover:text-blue-700 mb-3"
                >
                    ← Back to Timetable
                </button>


                <h1 className="text-3xl font-bold text-gray-800">
                    Add Timetable
                </h1>

                <p className="text-gray-500 mt-1">
                    Create a new timetable entry
                </p>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                    {error}
                </div>

            )}


            {/* =================================================
                FORM CARD
            ================================================= */}

            <div className="bg-white rounded-xl shadow p-6">

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >


                    {/* =================================================
                        CLASS
                    ================================================= */}

                    <FormGroup
                        label="Class"
                        error={fieldErrors.school_class}
                    >

                        <select
                            name="school_class"
                            value={formData.school_class}
                            onChange={handleChange}
                            className="input"
                        >

                            <option value="">
                                Select Class
                            </option>

                            {classes.map((item) => (

                                <option
                                    key={item.id}
                                    value={item.id}
                                >
                                    {item.name}
                                </option>

                            ))}

                        </select>

                    </FormGroup>


                    {/* =================================================
                        SECTION
                    ================================================= */}

                    <FormGroup
                        label="Section"
                        error={fieldErrors.section}
                    >

                        <select
                            name="section"
                            value={formData.section}
                            onChange={handleChange}
                            disabled={!formData.school_class}
                            className="input disabled:bg-gray-100"
                        >

                            <option value="">
                                Select Section
                            </option>

                            {filteredSections.map((item) => (

                                <option
                                    key={item.id}
                                    value={item.id}
                                >
                                    {item.name}
                                </option>

                            ))}

                        </select>

                    </FormGroup>


                    {/* =================================================
                        SUBJECT
                    ================================================= */}

                    <FormGroup
                        label="Subject"
                        error={fieldErrors.subject}
                    >

                        <select
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            disabled={!formData.school_class}
                            className="input disabled:bg-gray-100"
                        >

                            <option value="">
                                Select Subject
                            </option>

                            {filteredSubjects.map((item) => (

                                <option
                                    key={item.id}
                                    value={item.id}
                                >
                                    {item.name}
                                </option>

                            ))}

                        </select>

                    </FormGroup>


                    {/* =================================================
                        TEACHER
                    ================================================= */}

                    <FormGroup
                        label="Teacher"
                        error={fieldErrors.teacher}
                    >

                        <select
                            name="teacher"
                            value={formData.teacher}
                            onChange={handleChange}
                            className="input"
                        >

                            <option value="">
                                Select Teacher
                            </option>

                            {teachers.map((teacher) => (

                                <option
                                    key={teacher.id}
                                    value={teacher.id}
                                >

                                    {teacher.full_name ||
                                        teacher.name ||
                                        `Teacher ${teacher.id}`}

                                </option>

                            ))}

                        </select>

                    </FormGroup>


                    {/* =================================================
                        DAY + PERIOD
                    ================================================= */}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">


                        {/* DAY */}

                        <FormGroup
                            label="Day"
                            error={fieldErrors.day}
                        >

                            <select
                                name="day"
                                value={formData.day}
                                onChange={handleChange}
                                className="input"
                            >

                                <option value="">
                                    Select Day
                                </option>

                                <option value="MONDAY">
                                    Monday
                                </option>

                                <option value="TUESDAY">
                                    Tuesday
                                </option>

                                <option value="WEDNESDAY">
                                    Wednesday
                                </option>

                                <option value="THURSDAY">
                                    Thursday
                                </option>

                                <option value="FRIDAY">
                                    Friday
                                </option>

                                <option value="SATURDAY">
                                    Saturday
                                </option>

                            </select>

                        </FormGroup>


                        {/* PERIOD */}

                        <FormGroup
                            label="Period"
                            error={fieldErrors.period}
                        >

                            <input
                                type="number"
                                name="period"
                                min="1"
                                value={formData.period}
                                onChange={handleChange}
                                placeholder="Enter period number"
                                className="input"
                            />

                        </FormGroup>

                    </div>


                    {/* =================================================
                        TIME
                    ================================================= */}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">


                        {/* START TIME */}

                        <FormGroup
                            label="Start Time"
                            error={fieldErrors.start_time}
                        >

                            <input
                                type="time"
                                name="start_time"
                                value={formData.start_time}
                                onChange={handleChange}
                                className="input"
                            />

                        </FormGroup>


                        {/* END TIME */}

                        <FormGroup
                            label="End Time"
                            error={fieldErrors.end_time}
                        >

                            <input
                                type="time"
                                name="end_time"
                                value={formData.end_time}
                                onChange={handleChange}
                                className="input"
                            />

                        </FormGroup>

                    </div>


                    {/* =================================================
                        BUTTONS
                    ================================================= */}

                    <div className="flex justify-end gap-3 pt-4 border-t">

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/admin/timetable")
                            }
                            className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            disabled={saving}
                            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
                        >

                            {saving
                                ? "Creating..."
                                : "Create Timetable"}

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );
}


// =============================================================
// FORM GROUP
// =============================================================

function FormGroup ({
    label,
    error,
    children,
}) {

    return (

        <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>

            {children}

            {error && (

                <p className="text-sm text-red-600 mt-1">
                    {Array.isArray(error)
                        ? error.join(" ")
                        : error}
                </p>

            )}

        </div>

    );

}


// =============================================================
// INPUT STYLE
// =============================================================

const inputClass = `
    w-full
    border
    border-gray-300
    rounded-lg
    px-4
    py-2.5
    text-gray-800
    focus:outline-none
    focus:ring-2
    focus:ring-blue-500
    focus:border-blue-500
`;


// =============================================================
// APPLY INPUT CLASS
// =============================================================

function InputStyleFix () {
    return null;
}


export default TimetableCreate;