import { Link } from "react-router-dom";

function Navbar () {
    return (
        <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">

            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center">

                {/* Logo */}

                <Link
                    to="/"
                    className="flex items-center gap-3 min-w-60"
                >
                    <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center text-2xl shadow-sm">
                        🎓
                    </div>

                    <div>
                        <h1 className="text-lg font-bold text-blue-950">
                            School Management
                        </h1>

                        <p className="text-xs text-gray-500">
                            Excellence in Education
                        </p>
                    </div>
                </Link>


                {/* Navigation */}

                <div className="flex-1 flex justify-center">

                    <div className="flex items-center gap-8">

                        <Link
                            to="/"
                            className="text-gray-700 font-medium hover:text-blue-600 transition"
                        >
                            Home
                        </Link>

                        <Link
                            to="/about"
                            className="text-gray-700 font-medium hover:text-blue-600 transition"
                        >
                            About
                        </Link>

                        <Link
                            to="/admission"
                            className="text-gray-700 font-medium hover:text-blue-600 transition"
                        >
                            Admissions
                        </Link>

                        <Link
                            to="/contact"
                            className="text-gray-700 font-medium hover:text-blue-600 transition"
                        >
                            Contact
                        </Link>

                    </div>

                </div>


                {/* Login */}

                <div className="min-w-60 flex justify-end">

                    <Link
                        to="/login"
                        className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 shadow-sm hover:shadow-md transition"
                    >
                        Login
                    </Link>

                </div>

            </div>

        </nav>
    );
}

export default Navbar;