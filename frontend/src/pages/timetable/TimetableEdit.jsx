import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

function TimetableEdit () {
    const { id } = useParams();
    const navigate = useNavigate();

    const [classes, setClasses] = useState([]);
    const [sections, setSections] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [teachers, setTeachers] = useState([]);

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

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // =====================================================
    // LOAD TIMETABLE + DROPDOWN DATA
    // =====================================================

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError("");

                const [
                    timetableResponse,
                    classResponse,
                    sectionResponse,
                    subjectResponse,
                    teacherResponse,
                ] = await Promise.all([
                    api.get(`timetable/${id}/`),
                    api.get("academics/classes/"),
                    api.get("academics/sections/"),
                    api.get("academics/subjects/"),
                    api.get("teachers/"),
                ]);

                const timetable = timetableResponse.data;

                setFormData({
                    school_class: timetable.school_class || "",
                    section: timetable.section || "",
                    subject: timetable.subject || "",
                    teacher: timetable.teacher || "",
                    day: timetable.day || "",
                    period: timetable.period || "",
                    start_time: timetable.start_time
                        ? timetable.start_time.slice(0, 5)
                        : "",
                    end_time: timetable.end_time
                        ? timetable.end_time.slice(0, 5)
                        : "",
                });

                setClasses(
                    Array.isArray(classResponse.data)
                        ? classResponse.data
                        : classResponse.data.results || []
                );

                setSections(
                    Array.isArray(sectionResponse.data)
                        ? sectionResponse.data
                        : sectionResponse.data.results || []
                );

                setSubjects(
                    Array.isArray(subjectResponse.data)
                        ? subjectResponse.data
                        : subjectResponse.data.results || []
                );

                setTeachers(
                    Array.isArray(teacherResponse.data)
                        ? teacherResponse.data
                        : teacherResponse.data.results || []
                );
            } catch (error) {
                console.log(error.response?.data);

                setError(
                    error.response?.data?.detail ||
                    "Failed to load timetable."
                );
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id]);

    // =====================================================
    // INPUT CHANGE
    // =====================================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        setError("");
        setSuccess("");
    };

    // =====================================================
    // UPDATE TIMETABLE
    // =====================================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            await api.patch(`timetable/${id}/`, {
                school_class: Number(formData.school_class),
                section: Number(formData.section),
                subject: Number(formData.subject),
                teacher: Number(formData.teacher),
                day: formData.day,
                period: Number(formData.period),
                start_time: formData.start_time,
                end_time: formData.end_time,
            });

            setSuccess("Timetable updated successfully.");

            setTimeout(() => {
                navigate("/admin/timetable");
            }, 800);
        } catch (error) {
            console.log(error.response?.data);

            const data = error.response?.data;

            if (data) {
                const firstError = Object.values(data)[0];

                setError(
                    Array.isArray(firstError)
                        ? firstError[0]
                        : firstError || "Failed to update timetable."
                );
            } else {
                setError("Failed to update timetable.");
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
                Loading timetable...
            </div>
        );
    }

    // =====================================================
    // FILTER SECTION + SUBJECT
    // =====================================================

    const filteredSections = sections.filter(
        (section) =>
            !formData.school_class ||
            String(section.school_class) === String(formData.school_class)
    );

    const filteredSubjects = subjects.filter(
        (subject) =>
            !formData.school_class ||
            String(subject.school_class) === String(formData.school_class)
    );

    // =====================================================
    // UI
    // =====================================================

    return (
        <div className="max-w-4xl mx-auto space-y-6">

            {/* HEADER */}

            <div>
                <h1 className="text-3xl font-bold text-gray-800">
                    Edit Timetable
                </h1>

                <p className="text-gray-500 mt-1">
                    Update timetable information
                </p>
            </div>

            {/* ERROR */}

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {/* SUCCESS */}

            {success && (
                <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
                    {success}
                </div>
            )}

            {/* FORM */}

            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-xl shadow p-6 space-y-6"
            >

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    {/* CLASS */}

                    <FormGroup label="Class">
                        <select
                            name="school_class"
                            value={formData.school_class}
                            onChange={handleChange}
                            required
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

                    {/* SECTION */}

                    <FormGroup label="Section">
                        <select
                            name="section"
                            value={formData.section}
                            onChange={handleChange}
                            required
                            className="input"
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

                    {/* SUBJECT */}

                    <FormGroup label="Subject">
                        <select
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                            className="input"
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

                    {/* TEACHER */}

                    <FormGroup label="Teacher">
                        <select
                            name="teacher"
                            value={formData.teacher}
                            onChange={handleChange}
                            required
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

                    {/* DAY */}

                    <FormGroup label="Day">
                        <select
                            name="day"
                            value={formData.day}
                            onChange={handleChange}
                            required
                            className="input"
                        >
                            <option value="">
                                Select Day
                            </option>

                            <option value="MONDAY">Monday</option>
                            <option value="TUESDAY">Tuesday</option>
                            <option value="WEDNESDAY">
                                Wednesday
                            </option>
                            <option value="THURSDAY">
                                Thursday
                            </option>
                            <option value="FRIDAY">Friday</option>
                            <option value="SATURDAY">
                                Saturday
                            </option>
                        </select>
                    </FormGroup>

                    {/* PERIOD */}

                    <FormGroup label="Period">
                        <input
                            type="number"
                            name="period"
                            min="1"
                            value={formData.period}
                            onChange={handleChange}
                            required
                            className="input"
                            placeholder="Enter period"
                        />
                    </FormGroup>

                    {/* START TIME */}

                    <FormGroup label="Start Time">
                        <input
                            type="time"
                            name="start_time"
                            value={formData.start_time}
                            onChange={handleChange}
                            required
                            className="input"
                        />
                    </FormGroup>

                    {/* END TIME */}

                    <FormGroup label="End Time">
                        <input
                            type="time"
                            name="end_time"
                            value={formData.end_time}
                            onChange={handleChange}
                            required
                            className="input"
                        />
                    </FormGroup>

                </div>

                {/* BUTTONS */}

                <div className="flex justify-end gap-3 pt-4 border-t">

                    <button
                        type="button"
                        onClick={() => navigate("/admin/timetable")}
                        className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={saving}
                        className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        {saving
                            ? "Updating..."
                            : "Update Timetable"}
                    </button>

                </div>

            </form>
        </div>
    );
}


// =====================================================
// FORM GROUP
// =====================================================

function FormGroup ({ label, children }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>

            {children}
        </div>
    );
}

export default TimetableEdit;