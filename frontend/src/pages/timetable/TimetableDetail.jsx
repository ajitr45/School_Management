import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

function TimetableDetail () {

    const { id } = useParams();
    const navigate = useNavigate();

    const [timetable, setTimetable] = useState(null);

    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);

    const [error, setError] = useState("");


    // =====================================================
    // LOAD TIMETABLE
    // =====================================================

    useEffect(() => {

        const loadTimetable = async () => {

            try {

                setLoading(true);
                setError("");

                const response = await api.get(
                    `timetable/${id}/`
                );

                console.log(
                    "TIMETABLE DETAIL:",
                    response.data
                );

                setTimetable(response.data);

            } catch (error) {

                console.log(
                    "TIMETABLE DETAIL ERROR:",
                    error.response?.data
                );

                setError(
                    "Failed to load timetable."
                );

            } finally {

                setLoading(false);

            }

        };

        loadTimetable();

    }, [id]);


    // =====================================================
    // DELETE
    // =====================================================

    const handleDelete = async () => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this timetable?"
        );

        if (!confirmed) {
            return;
        }

        try {

            setDeleting(true);
            setError("");

            await api.delete(
                `timetable/${id}/`
            );

            navigate("/admin/timetable");

        } catch (error) {

            console.log(
                "DELETE TIMETABLE ERROR:",
                error.response?.data
            );

            setError(
                "Failed to delete timetable."
            );

            setDeleting(false);

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
    // ERROR
    // =====================================================

    if (error && !timetable) {

        return (

            <div className="space-y-4">

                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                    {error}
                </div>

                <button
                    type="button"
                    onClick={() =>
                        navigate("/admin/timetable")
                    }
                    className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    ← Back to Timetable
                </button>

            </div>

        );

    }


    return (

        <div className="max-w-4xl mx-auto space-y-6">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

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
                        Timetable Details
                    </h1>

                    <p className="text-gray-500 mt-1">
                        View complete timetable information
                    </p>

                </div>


                {/* ACTIONS */}

                <div className="flex gap-3">

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                `/admin/timetable/${id}/edit`
                            )
                        }
                        className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                    >
                        Edit
                    </button>


                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={deleting}
                        className="px-5 py-2.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50"
                    >
                        {deleting
                            ? "Deleting..."
                            : "Delete"}
                    </button>

                </div>

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
                MAIN CARD
            ================================================= */}

            <div className="bg-white rounded-xl shadow overflow-hidden">


                {/* =================================================
                    TITLE
                ================================================= */}

                <div className="p-6 border-b bg-gray-50">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-sm text-gray-500">
                                Period
                            </p>

                            <p className="text-3xl font-bold text-blue-600 mt-1">
                                {timetable.period}
                            </p>

                        </div>


                        <div className="text-right">

                            <p className="text-sm text-gray-500">
                                Day
                            </p>

                            <p className="text-xl font-semibold text-gray-800 mt-1">
                                {timetable.day}
                            </p>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    CLASS INFORMATION
                ================================================= */}

                <div className="p-6 border-b">

                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                        Class Information
                    </h2>


                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">


                        <InfoBox
                            label="Class"
                            value={
                                timetable.class_name ||
                                timetable.school_class
                            }
                        />


                        <InfoBox
                            label="Section"
                            value={
                                timetable.section_name ||
                                timetable.section
                            }
                        />


                        <InfoBox
                            label="Subject"
                            value={
                                timetable.subject_name ||
                                timetable.subject
                            }
                        />

                    </div>

                </div>


                {/* =================================================
                    TEACHER INFORMATION
                ================================================= */}

                <div className="p-6 border-b">

                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                        Teacher Information
                    </h2>


                    <InfoBox
                        label="Teacher"
                        value={
                            timetable.teacher_name ||
                            timetable.teacher
                        }
                    />

                </div>


                {/* =================================================
                    TIME INFORMATION
                ================================================= */}

                <div className="p-6 border-b">

                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                        Schedule
                    </h2>


                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">


                        <InfoBox
                            label="Day"
                            value={timetable.day}
                        />


                        <InfoBox
                            label="Start Time"
                            value={timetable.start_time}
                        />


                        <InfoBox
                            label="End Time"
                            value={timetable.end_time}
                        />

                    </div>

                </div>


                {/* =================================================
                    SYSTEM INFORMATION
                ================================================= */}

                <div className="p-6">

                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                        System Information
                    </h2>


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


                        <InfoBox
                            label="Created At"
                            value={
                                formatDate(
                                    timetable.created_at
                                )
                            }
                        />


                        <InfoBox
                            label="Updated At"
                            value={
                                formatDate(
                                    timetable.updated_at
                                )
                            }
                        />

                    </div>

                </div>

            </div>

        </div>

    );
}


// =============================================================
// INFO BOX
// =============================================================

function InfoBox ({
    label,
    value,
}) {

    return (

        <div className="bg-gray-50 rounded-lg p-4">

            <p className="text-xs text-gray-500">
                {label}
            </p>

            <p className="font-semibold text-gray-800 mt-1">
                {value || "-"}
            </p>

        </div>

    );

}


// =============================================================
// DATE FORMAT
// =============================================================

function formatDate (value) {

    if (!value) {
        return "-";
    }

    return new Date(value).toLocaleString();

}


export default TimetableDetail;