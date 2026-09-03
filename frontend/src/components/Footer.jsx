function Footer () {
    return (
        <footer className="bg-blue-950 text-white">

            <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

                <div>
                    <h2 className="text-xl font-bold">
                        School Management
                    </h2>

                    <p className="text-blue-200 mt-4 leading-7">
                        We are committed to providing quality
                        education and overall development for every
                        student.
                    </p>
                </div>

                <div>
                    <h3 className="font-bold text-lg mb-4">
                        Quick Links
                    </h3>

                    <div className="space-y-3 text-blue-200">
                        <p>Home</p>
                        <p>About Us</p>
                        <p>Academics</p>
                        <p>Admissions</p>
                        <p>Contact Us</p>
                    </div>
                </div>

                <div>
                    <h3 className="font-bold text-lg mb-4">
                        Important Links
                    </h3>

                    <div className="space-y-3 text-blue-200">
                        <p>Privacy Policy</p>
                        <p>Terms & Conditions</p>
                        <p>Student Login</p>
                        <p>Teacher Login</p>
                        <p>Admin Login</p>
                    </div>
                </div>

                <div>
                    <h3 className="font-bold text-lg mb-4">
                        Contact Us
                    </h3>

                    <div className="space-y-3 text-blue-200">
                        <p>📞 +91 98765 43210</p>
                        <p>✉️ info@school.com</p>
                        <p>📍 123, School Road, India</p>
                    </div>
                </div>

            </div>

            <div className="border-t border-blue-800">
                <p className="text-center text-blue-200 py-5 text-sm">
                    © 2026 School Management System. All rights reserved.
                </p>
            </div>

        </footer>
    );
}

export default Footer;