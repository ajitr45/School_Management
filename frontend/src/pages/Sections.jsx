import { useEffect, useState } from "react";
import api from "../services/api";

function Sections () {

    const [classes, setClasses] = useState([]);
    const [sections, setSections] = useState([]);

    // Form ke liye
    const [formClass, setFormClass] = useState("all");

    // Table filter ke liye
    const [filterClass, setFilterClass] = useState("all");

    const [sectionName, setSectionName] = useState("");
    const [editingSection, setEditingSection] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [formError, setFormError] = useState("");


    // =========================
    // GET CLASSES + SECTIONS
    // =========================

    useEffect(() => {

        const getData = async () => {

            try {

                const [classesResponse, sectionsResponse] =
                    await Promise.all([
                        api.get("academics/classes/"),
                        api.get("academics/sections/")
                    ]);

                setClasses(classesResponse.data);
                setSections(sectionsResponse.data);

            } catch (error) {

                console.log(error.response?.data);

                setError(
                    "Failed to load classes and sections"
                );

            } finally {

                setLoading(false);

            }

        };

        getData();

    }, []);


    // =========================
    // FILTER SECTIONS
    // =========================

    const filteredSections =
        filterClass === "all"
            ? sections
            : sections.filter(
                (section) =>
                    section.school_class === Number(filterClass)
            );


    // =========================
    // CREATE / UPDATE SECTION
    // =========================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setFormError("");


        // Section validation
        if (!sectionName.trim()) {

            setFormError(
                "Section name is required"
            );

            return;
        }


        // Class validation
        if (!formClass || formClass === "all") {

            setFormError(
                "Please select a class"
            );

            return;
        }


        try {

            setSaving(true);


            const data = {
                name: sectionName.trim(),
                school_class: Number(formClass)
            };


            // =========================
            // UPDATE
            // =========================

            if (editingSection) {

                const response = await api.patch(
                    `academics/sections/${editingSection.id}/`,
                    data
                );


                setSections((prev) =>
                    prev.map((section) =>
                        section.id === editingSection.id
                            ? response.data
                            : section
                    )
                );

            }


            // =========================
            // CREATE
            // =========================

            else {

                const response = await api.post(
                    "academics/sections/",
                    data
                );


                setSections((prev) => [
                    ...prev,
                    response.data
                ]);

            }


            // Reset form
            setSectionName("");
            setFormClass("all");
            setEditingSection(null);

        } catch (error) {

            console.log(error.response?.data);

            setFormError(
                error.response?.data?.detail ||
                error.response?.data?.name?.[0] ||
                error.response?.data?.school_class?.[0] ||
                "Failed to save section"
            );

        } finally {

            setSaving(false);

        }

    };


    // =========================
    // EDIT SECTION
    // =========================

    const handleEdit = (section) => {

        setEditingSection(section);

        setSectionName(section.name);

        // Sirf form ka class change hoga
        setFormClass(
            section.school_class.toString()
        );

        setFormError("");

    };


    // =========================
    // CANCEL EDIT
    // =========================

    const handleCancel = () => {

        setEditingSection(null);

        setSectionName("");

        setFormClass("all");

        setFormError("");

    };


    // =========================
    // LOADING
    // =========================

    if (loading) {

        return (
            <div className="p-6">

                <p className="text-gray-500">
                    Loading sections...
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


            {/* ================= HEADER ================= */}

            <div>

                <h1 className="text-2xl font-bold text-gray-800">
                    Sections
                </h1>

                <p className="text-gray-500 mt-1">
                    Manage class sections
                </p>

            </div>


            {/* ================= FORM ================= */}

            <div className="bg-white rounded-xl shadow p-6">

                <h2 className="text-lg font-semibold text-gray-800 mb-5">

                    {editingSection
                        ? "Edit Section"
                        : "Create Section"}

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

                            <option value="all">
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


                    {/* SECTION NAME */}

                    <div>

                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Section Name
                        </label>

                        <select
                            value={sectionName}
                            onChange={(e) => {

                                setSectionName(e.target.value);
                                setFormError("");

                            }}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                        >

                            <option value="">
                                Select Section
                            </option>

                            <option value="A">
                                Section A
                            </option>

                            <option value="B">
                                Section B
                            </option>

                            <option value="C">
                                Section C
                            </option>

                            <option value="D">
                                Section D
                            </option>

                        </select>

                    </div>


                    {/* BUTTONS */}

                    <div className="flex gap-2">

                        <button
                            type="submit"
                            disabled={
                                saving ||
                                !sectionName ||
                                formClass === "all"
                            }
                            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >

                            {saving
                                ? "Saving..."
                                : editingSection
                                    ? "Update Section"
                                    : "Add Section"}

                        </button>


                        {editingSection && (

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


            {/* ================= FILTER ================= */}

            <div className="bg-white rounded-xl shadow p-5">

                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filter by Class
                </label>


                <select
                    value={filterClass}
                    onChange={(e) =>
                        setFilterClass(e.target.value)
                    }
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


            {/* ================= TABLE ================= */}

            <div className="bg-white rounded-xl shadow overflow-hidden">


                {/* TABLE HEADER */}

                <div className="px-6 py-4 border-b">

                    <h2 className="font-semibold text-gray-800">
                        Section List
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                        {filteredSections.length} sections found
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
                                    Section
                                </th>

                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                    Action
                                </th>

                            </tr>

                        </thead>


                        {/* TBODY */}

                        <tbody>

                            {filteredSections.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="4"
                                        className="text-center py-10 text-gray-500"
                                    >
                                        No sections found
                                    </td>

                                </tr>

                            ) : (

                                filteredSections.map(
                                    (section, index) => {

                                        const schoolClass =
                                            classes.find(
                                                (item) =>
                                                    item.id ===
                                                    section.school_class
                                            );


                                        return (

                                            <tr
                                                key={section.id}
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


                                                {/* SECTION */}

                                                <td className="px-6 py-4 text-gray-700">
                                                    Section {section.name}
                                                </td>


                                                {/* ACTION */}

                                                <td className="px-6 py-4">

                                                    <button
                                                        onClick={() =>
                                                            handleEdit(section)
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

export default Sections;