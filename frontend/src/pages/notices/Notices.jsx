import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function Notices () {
    const navigate = useNavigate();

    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadNotices = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("notices/");

            setNotices(
                Array.isArray(response.data)
                    ? response.data
                    : response.data.results || []
            );
        } catch (error) {
            console.log("NOTICES ERROR:", error.response?.data);

            setError(
                error.response?.data?.detail ||
                "Failed to load notices."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadNotices();
    }, []);

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this notice?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");

            await api.delete(`notices/${id}/`);

            setNotices((previous) =>
                previous.filter((notice) => notice.id !== id)
            );
        } catch (error) {
            console.log(
                "DELETE NOTICE ERROR:",
                error.response?.data
            );

            setError(
                error.response?.data?.detail ||
                "Failed to delete notice."
            );
        }
    };

    return (
        <div className="space-y-6">

            {/* Header */}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        Notices
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Manage school notices
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => navigate("/admin/notices/create")}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                >
                    + Create Notice
                </button>

            </div>

            {/* Error */}

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {/* Main Card */}

            <div className="bg-white rounded-xl shadow overflow-hidden">

                <div className="p-6 border-b">

                    <h2 className="text-2xl font-bold text-gray-800">
                        All Notices
                    </h2>

                    <p className="text-gray-500 mt-1">
                        {notices.length} notices
                    </p>

                </div>

                {loading ? (

                    <div className="py-16 text-center text-gray-500">
                        Loading notices...
                    </div>

                ) : (

                    <div className="overflow-x-auto">

                        <table className="w-full">

                            <thead>

                                <tr className="bg-gray-50">

                                    <Th>#</Th>
                                    <Th>Title</Th>
                                    <Th>Audience</Th>
                                    <Th>Class</Th>
                                    <Th>Expiry Date</Th>
                                    <Th>Created At</Th>
                                    <Th>Actions</Th>

                                </tr>

                            </thead>

                            <tbody className="divide-y">

                                {notices.length === 0 ? (

                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="px-6 py-16 text-center text-gray-500"
                                        >
                                            No notices found.
                                        </td>
                                    </tr>

                                ) : (

                                    notices.map((notice, index) => (

                                        <tr
                                            key={notice.id}
                                            className="hover:bg-gray-50"
                                        >

                                            <Td>
                                                {index + 1}
                                            </Td>

                                            <Td>
                                                <span className="font-semibold text-gray-800">
                                                    {notice.title}
                                                </span>
                                            </Td>

                                            <Td>
                                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                                                    {notice.audience}
                                                </span>
                                            </Td>

                                            <Td>
                                                {notice.school_class || "-"}
                                            </Td>

                                            <Td>
                                                {notice.expiry_date || "No expiry"}
                                            </Td>

                                            <Td>
                                                {notice.created_at
                                                    ? new Date(
                                                        notice.created_at
                                                    ).toLocaleDateString()
                                                    : "-"}
                                            </Td>

                                            <Td>

                                                <div className="flex gap-2">

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            navigate(
                                                                `/admin/notices/${notice.id}`
                                                            )
                                                        }
                                                        className="px-3 py-1.5 text-sm bg-gray-100 rounded-md hover:bg-gray-200"
                                                    >
                                                        View
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            navigate(
                                                                `/admin/notices/${notice.id}/edit`
                                                            )
                                                        }
                                                        className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDelete(
                                                                notice.id
                                                            )
                                                        }
                                                        className="px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                                                    >
                                                        Delete
                                                    </button>

                                                </div>

                                            </Td>

                                        </tr>

                                    ))

                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>
    );
}


function Th ({ children }) {
    return (
        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 whitespace-nowrap">
            {children}
        </th>
    );
}


function Td ({ children }) {
    return (
        <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
            {children}
        </td>
    );
}


export default Notices;