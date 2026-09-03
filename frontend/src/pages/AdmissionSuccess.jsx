import { Link, useLocation } from "react-router-dom";

function AdmissionSuccess () {

    const location = useLocation();

    const application = location.state?.application;

    return (
        <div className="min-h-[70vh] bg-gray-50 flex items-center justify-center px-6 py-12">

            <div className="bg-white max-w-2xl w-full rounded-2xl shadow-sm border p-8 md:p-12 text-center">

                <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-4xl text-green-600">
                        ✓
                    </span>
                </div>

                <h1 className="text-3xl font-bold text-blue-950 mt-6">
                    Application Submitted Successfully
                </h1>

                <p className="text-gray-600 mt-4 leading-7">
                    Thank you for applying for admission.
                    Your application has been successfully submitted.
                    Our school administration will review your application
                    and contact you soon.
                </p>

                {application && (
                    <div className="mt-8 bg-blue-50 rounded-xl p-5 text-left">

                        <h2 className="font-bold text-blue-950 mb-4">
                            Application Details
                        </h2>

                        <div className="space-y-2 text-sm">

                            {application.id && (
                                <p>
                                    <span className="font-semibold">
                                        Application ID:
                                    </span>{" "}
                                    {application.id}
                                </p>
                            )}

                            {application.student_name && (
                                <p>
                                    <span className="font-semibold">
                                        Student Name:
                                    </span>{" "}
                                    {application.student_name}
                                </p>
                            )}

                            {application.academic_year && (
                                <p>
                                    <span className="font-semibold">
                                        Academic Year:
                                    </span>{" "}
                                    {application.academic_year}
                                </p>
                            )}

                        </div>

                    </div>
                )}

                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">

                    <Link to="/" className="px-6 py-3 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition">
                        Back to Home
                    </Link>


                </div>

            </div>

        </div>
    );
}

export default AdmissionSuccess;