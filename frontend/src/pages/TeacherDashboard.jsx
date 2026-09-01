function TeacherDashboard () {
    return (
        <div className="space-y-6">

            <div>
                <h1 className="text-3xl font-bold text-gray-800">
                    Teacher Dashboard
                </h1>

                <p className="text-gray-500 mt-1">
                    Welcome to your teacher panel
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                <div className="bg-white p-6 rounded-xl shadow">
                    <h2 className="text-gray-500">
                        My Classes
                    </h2>

                    <p className="text-3xl font-bold text-gray-800 mt-2">
                        -
                    </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow">
                    <h2 className="text-gray-500">
                        Students
                    </h2>

                    <p className="text-3xl font-bold text-gray-800 mt-2">
                        -
                    </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow">
                    <h2 className="text-gray-500">
                        Homework
                    </h2>

                    <p className="text-3xl font-bold text-gray-800 mt-2">
                        -
                    </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow">
                    <h2 className="text-gray-500">
                        Attendance
                    </h2>

                    <p className="text-3xl font-bold text-gray-800 mt-2">
                        -
                    </p>
                </div>

            </div>

            <div className="bg-white rounded-xl shadow p-6">

                <h2 className="text-xl font-bold text-gray-800">
                    Quick Actions
                </h2>

                <div className="flex flex-wrap gap-3 mt-4">

                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Mark Attendance
                    </button>

                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                        Add Homework
                    </button>

                    <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                        Study Material
                    </button>

                </div>

            </div>

        </div>
    );
}

export default TeacherDashboard;