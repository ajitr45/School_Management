import { Link } from "react-router-dom";

function Home () {
    return (
        <div className="bg-white">

            {/* HERO */}

            <section className="bg-blue-50">
                <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    <div>
                        <p className="text-blue-600 font-semibold tracking-wide">
                            WELCOME TO OUR SCHOOL
                        </p>

                        <h1 className="text-5xl font-bold text-blue-950 leading-tight mt-4">
                            Inspiring Minds.
                            <br />
                            Shaping Futures.
                        </h1>

                        <p className="text-gray-600 text-lg mt-6 max-w-xl leading-8">
                            We provide a nurturing and innovative learning
                            environment where every student can discover
                            their potential and build a successful future.
                        </p>

                        <div className="flex flex-wrap gap-4 mt-8">

                            <Link
                                to="/admission"
                                className="px-7 py-3 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition"
                            >
                                Apply for Admission
                            </Link>

                            <a
                                href="#about"
                                className="px-7 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition"
                            >
                                Explore Our School
                            </a>

                        </div>
                    </div>

                    <div>
                        <img
                            src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80"
                            alt="Students in school"
                            className="w-full h-112.5 object-cover rounded-2xl shadow-xl"
                        />
                    </div>

                </div>
            </section>


            {/* ABOUT */}

            <section id="about" className="max-w-7xl mx-auto px-6 py-20">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    <img
                        src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1000&q=80"
                        alt="School campus"
                        className="w-full h-100 object-cover rounded-2xl shadow-lg"
                    />

                    <div>

                        <p className="text-blue-600 font-semibold">
                            ABOUT OUR SCHOOL
                        </p>

                        <h2 className="text-3xl font-bold text-blue-950 mt-3">
                            Building Strong Foundations for a Bright Future
                        </h2>

                        <p className="text-gray-600 mt-5 leading-7">
                            Our school is committed to providing quality
                            education along with a strong focus on character,
                            creativity, confidence and leadership.
                        </p>

                        <p className="text-gray-600 mt-4 leading-7">
                            We believe that every child is unique. Our
                            experienced teachers and modern learning
                            environment help students grow academically,
                            socially and personally.
                        </p>

                    </div>

                </div>

            </section>


            {/* WHY CHOOSE US */}

            <section className="bg-gray-50 py-20">

                <div className="max-w-7xl mx-auto px-6">

                    <SectionHeading
                        title="Why Choose Us?"
                        description="Everything we do is focused on creating a better learning experience for our students."
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">

                        <Feature
                            icon="🎓"
                            title="Quality Education"
                            text="Modern teaching methods designed to make learning meaningful and engaging."
                        />

                        <Feature
                            icon="👨‍🏫"
                            title="Experienced Faculty"
                            text="Dedicated and qualified teachers who guide students at every step."
                        />

                        <Feature
                            icon="💡"
                            title="Modern Learning"
                            text="Technology-enabled classrooms and practical learning experiences."
                        />

                        <Feature
                            icon="🏆"
                            title="Holistic Development"
                            text="Equal focus on academics, sports, creativity and character development."
                        />

                    </div>

                </div>

            </section>


            {/* FACILITIES */}

            <section className="max-w-7xl mx-auto px-6 py-20">

                <SectionHeading
                    title="Our Facilities"
                    description="A modern campus equipped with facilities that support learning, creativity and student development."
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">

                    <Facility
                        image="https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=800&q=80"
                        title="Smart Classrooms"
                        text="Interactive and technology-enabled classrooms."
                    />

                    <Facility
                        image="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80"
                        title="Computer Lab"
                        text="Modern computers and technology-based learning."
                    />

                    <Facility
                        image="https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80"
                        title="Science Lab"
                        text="Practical learning through experiments and activities."
                    />

                    <Facility
                        image="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=800&q=80"
                        title="Library"
                        text="A peaceful space with books and learning resources."
                    />

                    <Facility
                        image="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80"
                        title="Sports Ground"
                        text="Outdoor sports and physical activities."
                    />

                    <Facility
                        image="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80"
                        title="Auditorium"
                        text="A space for events, cultural programs and performances."
                    />

                    <Facility
                        image="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80"
                        title="Cafeteria"
                        text="A clean and comfortable dining environment."
                    />

                    <Facility
                        image="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80"
                        title="Transport"
                        text="Safe and convenient school transportation."
                    />

                </div>

            </section>


            {/* ACADEMICS */}

            <section className="bg-blue-950 text-white py-20">

                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    <div>

                        <p className="text-blue-300 font-semibold">
                            ACADEMIC EXCELLENCE
                        </p>

                        <h2 className="text-3xl font-bold mt-3">
                            Learning Beyond the Classroom
                        </h2>

                        <p className="text-blue-100 mt-5 leading-7">
                            Our academic approach combines classroom
                            teaching, practical activities, technology
                            and personalized guidance to help students
                            achieve their best.
                        </p>

                        <div className="grid grid-cols-2 gap-5 mt-8">

                            <div className="border border-blue-800 rounded-xl p-5">
                                <h3 className="font-bold">
                                    Digital Learning
                                </h3>
                                <p className="text-blue-200 text-sm mt-2">
                                    Technology-supported education.
                                </p>
                            </div>

                            <div className="border border-blue-800 rounded-xl p-5">
                                <h3 className="font-bold">
                                    Practical Learning
                                </h3>
                                <p className="text-blue-200 text-sm mt-2">
                                    Learn through experiments and activities.
                                </p>
                            </div>

                            <div className="border border-blue-800 rounded-xl p-5">
                                <h3 className="font-bold">
                                    Personal Guidance
                                </h3>
                                <p className="text-blue-200 text-sm mt-2">
                                    Individual attention for students.
                                </p>
                            </div>

                            <div className="border border-blue-800 rounded-xl p-5">
                                <h3 className="font-bold">
                                    Skill Development
                                </h3>
                                <p className="text-blue-200 text-sm mt-2">
                                    Preparing students for the future.
                                </p>
                            </div>

                        </div>

                    </div>

                    <img
                        src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1000&q=80"
                        alt="Students learning"
                        className="w-full h-105 object-cover rounded-2xl"
                    />

                </div>

            </section>


            {/* ACTIVITIES */}

            <section className="max-w-7xl mx-auto px-6 py-20">

                <SectionHeading
                    title="Student Activities"
                    description="We encourage students to explore their interests beyond academics."
                />

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 mt-12">

                    <Activity icon="⚽" title="Sports" />
                    <Activity icon="🎨" title="Art" />
                    <Activity icon="🎵" title="Music" />
                    <Activity icon="💃" title="Dance" />
                    <Activity icon="🤖" title="Robotics" />
                    <Activity icon="🎤" title="Debate" />

                </div>

            </section>


            {/* GALLERY */}

            <section className="bg-gray-50 py-20">

                <div className="max-w-7xl mx-auto px-6">

                    <SectionHeading
                        title="Campus Gallery"
                        description="Take a glimpse at our learning spaces and campus environment."
                    />

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-12">

                        <GalleryImage
                            image="https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=800&q=80"
                        />

                        <GalleryImage
                            image="https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80"
                        />

                        <GalleryImage
                            image="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=800&q=80"
                        />

                        <GalleryImage
                            image="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80"
                        />

                    </div>

                </div>

            </section>


            {/* STATISTICS */}

            <section className="bg-blue-400 text-white">

                <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">

                    <Stat number="1200+" title="Students" />
                    <Stat number="80+" title="Teachers" />
                    <Stat number="30+" title="Classes & Courses" />
                    <Stat number="25+" title="Years of Excellence" />

                </div>

            </section>



        </div>
    );
}


function SectionHeading ({ title, description }) {
    return (
        <div className="text-center max-w-2xl mx-auto">

            <h2 className="text-3xl font-bold text-blue-950">
                {title}
            </h2>

            <div className="w-14 h-1 bg-blue-600 rounded-full mx-auto mt-4" />

            <p className="text-gray-600 mt-4 leading-7">
                {description}
            </p>

        </div>
    );
}


function Feature ({ icon, title, text }) {
    return (
        <div className="bg-white border rounded-2xl p-7 text-center shadow-sm hover:shadow-md transition">

            <div className="text-4xl">
                {icon}
            </div>

            <h3 className="font-bold text-lg text-blue-950 mt-5">
                {title}
            </h3>

            <p className="text-gray-600 mt-3 leading-6">
                {text}
            </p>

        </div>
    );
}


function Facility ({ image, title, text }) {
    return (
        <div className="bg-white rounded-2xl overflow-hidden border shadow-sm hover:shadow-lg transition">

            <img
                src={image}
                alt={title}
                className="w-full h-48 object-cover"
            />

            <div className="p-5">

                <h3 className="font-bold text-lg text-blue-950">
                    {title}
                </h3>

                <p className="text-gray-600 text-sm mt-2 leading-6">
                    {text}
                </p>

            </div>

        </div>
    );
}


function Activity ({ icon, title }) {
    return (
        <div className="border rounded-xl p-6 text-center hover:border-blue-500 hover:shadow-sm transition">

            <div className="text-3xl">
                {icon}
            </div>

            <p className="font-semibold text-blue-950 mt-3">
                {title}
            </p>

        </div>
    );
}


function GalleryImage ({ image }) {
    return (
        <img
            src={image}
            alt="School campus"
            className="w-full h-64 object-cover rounded-xl hover:scale-[1.02] transition duration-300"
        />
    );
}


function Stat ({ number, title }) {
    return (
        <div>
            <h2 className="text-3xl font-bold">
                {number}
            </h2>

            <p className="text-blue-100 mt-2">
                {title}
            </p>
        </div>
    );
}


export default Home;