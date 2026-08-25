import { useLocation, useNavigate } from "react-router-dom";

function AdmissionSuccess() {

    const location = useLocation();
    const navigate = useNavigate();

    const application = location.state?.application;


    if (!application) {

        return (
            <div className="p-6 text-center">

                <p className="text-gray-500">
                    Application information not found.
                </p>

                <button
                    onClick={() => navigate("/admission/apply")}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                    Apply Again
                </button>

            </div>
        );

    }


    return (

        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">

            <div className="bg-white rounded-xl shadow p-8 max-w-lg w-full text-center">

                <div className="text-green-600 text-5xl mb-4">
                    ✓
                </div>

                <h1 className="text-2xl font-bold text-gray-800">
                    Admission Application Submitted
                </h1>

                <p className="text-gray-500 mt-2">
                    Your admission application has been submitted successfully.
                </p>


                <div className="bg-gray-50 rounded-lg p-5 mt-6">

                    <p className="text-sm text-gray-500">
                        Application Number
                    </p>

                    <p className="text-xl font-bold text-blue-600 mt-1">
                        {application.application_no}
                    </p>

                </div>


                <p className="text-sm text-gray-500 mt-5">
                    Please save your Application Number for future reference.
                </p>


                <button
                    onClick={() => navigate("/")}
                    className="mt-6 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Go Home
                </button>

            </div>

        </div>

    );
}

export default AdmissionSuccess;