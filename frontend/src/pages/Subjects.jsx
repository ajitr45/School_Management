import { useEffect, useState } from "react";
import api from "../services/api";

function Subjects () {

    const [classes, setClasses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    // Filter ke liye
    const [selectedClass, setSelectedClass] = useState("all");
    // Create / Edit form ke liye
    const [formClass, setFormClass] = useState("");
    const [subjectName, setSubjectName] = useState("");
    const [editingSubject, setEditingSubject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [formError, setFormError] = useState("");


    // =========================
    // GET CLASSES + SUBJECTS
    // =========================

    useEffect(() => {

        const getData = async () => {

            try {

                const [classesResponse, subjectsResponse] =
                    await Promise.all([
                        api.get("academics/classes/"),
                        api.get("academics/subjects/")
                    ]);

                setClasses(classesResponse.data);
                setSubjects(subjectsResponse.data);

            } catch (error) {

                console.log(error.response?.data);

                setError("Failed to load classes and subjects");

            } finally {

                setLoading(false);

            }

        };

        getData();

    }, []);


    // =========================
    // FILTER SUBJECTS
    // =========================

    const filteredSubjects =
        selectedClass === "all"
            ? subjects
            : subjects.filter(
                (subject) =>
                    subject.school_class === Number(selectedClass)
            );


    // =========================
    // CREATE / UPDATE SUBJECT
    // =========================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setFormError("");


        // Class validation
        if (!formClass) {

            setFormError("Please select a class");

            return;
        }


        // Subject validation
        if (!subjectName.trim()) {

            setFormError("Subject name is required");

            return;
        }


        try {

            setSaving(true);


            const data = {
                name: subjectName.trim(),
                school_class: Number(formClass)
            };


            // =========================
            // UPDATE
            // =========================

            if (editingSubject) {

                const response = await api.patch(
                    `academics/subjects/${editingSubject.id}/`,
                    data
                );


                setSubjects((prev) =>
                    prev.map((subject) =>
                        subject.id === editingSubject.id
                            ? response.data
                            : subject
                    )
                );


                setEditingSubject(null);
                setSubjectName("");
                setFormClass("");

            }


            // =========================
            // CREATE
            // =========================

            else {

                const response = await api.post(
                    "academics/subjects/",
                    data
                );


                setSubjects((prev) => [
                    ...prev,
                    response.data
                ]);


                setSubjectName("");
                setFormClass("");

            }

        } catch (error) {

            console.log(error.response?.data);

            setFormError(
                error.response?.data?.detail ||
                error.response?.data?.name?.[0] ||
                "Failed to save subject"
            );

        } finally {

            setSaving(false);

        }

    };


    // =========================
    // EDIT SUBJECT
    // =========================

    const handleEdit = (subject) => {

        setEditingSubject(subject);

        setSubjectName(subject.name);

        // Form ka class alag state me
        setFormClass(
            subject.school_class.toString()
        );

        setFormError("");

    };


    // =========================
    // CANCEL EDIT
    // =========================

    const handleCancel = () => {

        setEditingSubject(null);

        setSubjectName("");

        setFormClass("");

        setFormError("");

    };


    // =========================
    // LOADING
    // =========================

    if (loading) {

        return (
            <div className="p-6">

                <p className="text-gray-500">
                    Loading subjects...
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


    return (
        <div className="space-y-6">


            {/* =========================
                HEADER
            ========================= */}

            <div>

                <h1 className="text-2xl font-bold text-gray-800">
                    Subjects
                </h1>

                <p className="text-gray-500 mt-1">
                    Manage subjects for each class
                </p>

            </div>



            {/* =========================
                CREATE / EDIT FORM
            ========================= */}

            <div className="bg-white rounded-xl shadow p-6">

                <h2 className="text-lg font-semibold text-gray-800 mb-5">

                    {editingSubject
                        ? "Edit Subject"
                        : "Create Subject"}

                </h2>


                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end"
                >


                    {/* CLASS */}

                    <div>

                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Class
                        </label>

                        <select
                            value={formClass}
                            onChange={(e) => {

                                setFormClass(e.target.value);
                                setFormError("");

                            }}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
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

                        </select>

                    </div>



                    {/* SUBJECT NAME */}

                    <div>

                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Subject Name
                        </label>

                        <input
                            type="text"
                            placeholder="Example: Mathematics"
                            value={subjectName}
                            onChange={(e) => {

                                setSubjectName(e.target.value);
                                setFormError("");

                            }}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>



                    {/* BUTTONS */}

                    <div className="flex gap-2">

                        <button
                            type="submit"
                            disabled={saving}
                            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >

                            {saving
                                ? "Saving..."
                                : editingSubject
                                    ? "Update Subject"
                                    : "Add Subject"}

                        </button>


                        {editingSubject && (

                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                            >
                                Cancel
                            </button>

                        )}

                    </div>

                </form>


                {/* FORM ERROR */}

                {formError && (

                    <p className="text-red-600 text-sm mt-3">
                        {formError}
                    </p>

                )}

            </div>



            {/* =========================
                CLASS FILTER
            ========================= */}

            <div className="bg-white rounded-xl shadow p-5">

                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filter by Class
                </label>


                <select
                    value={selectedClass}
                    onChange={(e) => {

                        setSelectedClass(e.target.value);

                    }}
                    className="w-full md:w-80 border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                >

                    <option value="all">
                        All Classes
                    </option>

                    {classes.map((schoolClass) => (

                        <option
                            key={schoolClass.id}
                            value={schoolClass.id}
                        >
                            {schoolClass.name}
                        </option>

                    ))}

                </select>

            </div>



            {/* =========================
                SUBJECT TABLE
            ========================= */}

            <div className="bg-white rounded-xl shadow overflow-hidden">


                {/* TABLE HEADER */}

                <div className="px-6 py-4 border-b">

                    <h2 className="font-semibold text-gray-800">
                        Subject List
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                        {filteredSubjects.length} subjects found
                    </p>

                </div>



                {/* TABLE */}

                <div className="overflow-x-auto">

                    <table className="w-full">


                        {/* THEAD */}

                        <thead className="bg-gray-50">

                            <tr>

                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                    #
                                </th>

                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                    Class
                                </th>

                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                    Subject
                                </th>

                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                    Action
                                </th>

                            </tr>

                        </thead>



                        {/* TBODY */}

                        <tbody>

                            {filteredSubjects.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="4"
                                        className="text-center py-10 text-gray-500"
                                    >
                                        No subjects found
                                    </td>

                                </tr>

                            ) : (

                                filteredSubjects.map(
                                    (subject, index) => {

                                        const schoolClass =
                                            classes.find(
                                                (item) =>
                                                    item.id ===
                                                    subject.school_class
                                            );


                                        return (

                                            <tr
                                                key={subject.id}
                                                className="border-t hover:bg-gray-50"
                                            >

                                                {/* NUMBER */}

                                                <td className="px-6 py-4 text-gray-600">
                                                    {index + 1}
                                                </td>


                                                {/* CLASS */}

                                                <td className="px-6 py-4 font-medium text-gray-800">
                                                    {schoolClass?.name || "N/A"}
                                                </td>


                                                {/* SUBJECT */}

                                                <td className="px-6 py-4 text-gray-700">
                                                    {subject.name}
                                                </td>


                                                {/* ACTION */}

                                                <td className="px-6 py-4">

                                                    <button
                                                        onClick={() =>
                                                            handleEdit(subject)
                                                        }
                                                        className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                                                    >
                                                        Edit
                                                    </button>

                                                </td>

                                            </tr>

                                        );

                                    }
                                )

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
}

export default Subjects;