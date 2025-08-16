import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            <Head title="OSCA - Office of the Senior Citizen's Affairs | LGU Iligan City">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=inter:300,400,500,600,700" rel="stylesheet" />
                <meta name="description" content="Office of the Senior Citizen's Affairs - LGU Iligan City. Serving our senior citizens with care, support, and comprehensive services." />
            </Head>

            <div className="min-h-screen bg-white">
                <header className="fixed top-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 z-50 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <div className="flex items-center space-x-3">
                                <img
                                    src="/image/osca-final.png"
                                    alt="OSCA Logo"
                                    className="w-10 h-10 rounded-lg object-cover"
                                />
                                <div>
                                    <h1 className="text-lg font-bold text-gray-900">OSCA</h1>
                                    <p className="text-xs text-gray-600">Iligan City</p>
                                </div>
                            </div>
                            <nav className="hidden md:flex items-center space-x-8">
                                <a href="#home" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Home</a>
                                <a href="#about" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">About</a>
                                <a href="#services" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Services</a>
                                <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Contact</a>
                                <a href="#blog" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">News</a>
                            </nav>
                            <div className="hidden md:flex items-center space-x-4">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md font-medium"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md font-medium"
                                        >
                                            Login
                                        </Link>
                                    </>
                                )}
                            </div>
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-50"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                        {isMenuOpen && (
                            <div className="md:hidden py-4 border-t border-gray-100">
                                <div className="flex flex-col space-y-3">
                                    <a href="#home" className="text-gray-700 hover:text-blue-600 font-medium">Home</a>
                                    <a href="#about" className="text-gray-700 hover:text-blue-600 font-medium">About</a>
                                    <a href="#services" className="text-gray-700 hover:text-blue-600 font-medium">Services</a>
                                    <a href="#contact" className="text-gray-700 hover:text-blue-600 font-medium">Contact</a>
                                    <a href="#blog" className="text-gray-700 hover:text-blue-600 font-medium">News</a>
                                    {auth.user ? (
                                        <Link href={route('dashboard')} className="text-blue-600 font-medium">Dashboard</Link>
                                    ) : (
                                        <div className="flex space-x-4 pt-2">
                                            <Link href={route('login')} className="text-gray-700">Login</Link>
                                            <Link href={route('register')} className="text-blue-600 font-medium">Register</Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </header>
                <section id="home" className="pt-16 min-h-screen flex items-center relative overflow-hidden bg-gray-50">
                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh] -mt-16">
                            <div className="text-center lg:text-left">
                                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                                    Office of the
                                    <span className="text-blue-600"> Senior Citizen's Affairs</span>
                                </h1>
                                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                                    Serving our beloved senior citizens of Iligan City with compassion, dignity, and comprehensive support services for a better quality of life.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                    <a href="#services" className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-medium">
                                        Our Services
                                    </a>
                                    <a href="#contact" className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all font-medium">
                                        Get in Touch
                                    </a>
                                </div>
                            </div>
                            <div
                                className="w-full h-full min-h-[500px] lg:min-h-[600px] rounded-2xl shadow-xl bg-cover bg-center bg-no-repeat"
                                style={{
                                    backgroundImage: 'url(/image/hero-banner.jpg)'
                                }}
                            >
                            </div>
                        </div>
                    </div>
                </section>
                <section id="about" className="py-20 bg-white relative overflow-hidden">
                    <div className="absolute inset-0 opacity-5">
                        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-600 rounded-full"></div>
                        <div className="absolute top-32 right-20 w-16 h-16 bg-blue-400 rounded-full"></div>
                        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-blue-300 rounded-full"></div>
                        <div className="absolute bottom-40 right-1/3 w-24 h-24 bg-blue-500 rounded-full"></div>
                    </div>

                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">About OSCA Iligan</h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Dedicated to enhancing the lives of senior citizens through comprehensive programs, healthcare support, and community engagement.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="text-center p-8 rounded-xl bg-gray-50 border border-gray-100">
                                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Our Mission</h3>
                                <p className="text-gray-600">
                                    To provide compassionate care and comprehensive services that promote the health, well-being, and dignity of our senior citizens.
                                </p>
                            </div>

                            <div className="text-center p-8 rounded-xl bg-gray-50 border border-gray-100">
                                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Our Vision</h3>
                                <p className="text-gray-600">
                                    A community where every senior citizen lives with dignity, respect, and access to quality care and support services.
                                </p>
                            </div>

                            <div className="text-center p-8 rounded-xl bg-gray-50 border border-gray-100">
                                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Our Values</h3>
                                <p className="text-gray-600">
                                    Compassion, respect, integrity, and excellence in serving our senior community with dedication and care.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
                <section id="services" className="py-20 bg-gray-50 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 100">
                            <defs>
                                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#3B82F6" strokeWidth="0.5" />
                                </pattern>
                            </defs>
                            <rect width="100" height="100" fill="url(#grid)" />
                        </svg>
                    </div>

                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Comprehensive programs and services designed to support the health, well-being, and quality of life of our senior citizens.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[
                                {
                                    title: "Healthcare Services",
                                    description: "Regular health check-ups, medical consultations, and health monitoring programs for senior citizens.",
                                    icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z"
                                },
                                {
                                    title: "Social Activities",
                                    description: "Organized recreational activities, social gatherings, and community events to promote active aging.",
                                    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                },
                                {
                                    title: "Financial Assistance",
                                    description: "Support programs including pension assistance, benefits processing, and financial counseling.",
                                    icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                },
                                {
                                    title: "Transportation Services",
                                    description: "Safe and accessible transportation for medical appointments and essential errands.",
                                    icon: "M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                                },
                                {
                                    title: "Educational Programs",
                                    description: "Learning opportunities including health education, skills training, and digital literacy programs.",
                                    icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                },
                                {
                                    title: "Counseling Support",
                                    description: "Professional counseling services for emotional support, grief counseling, and mental health care.",
                                    icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                }
                            ].map((service, index) => (
                                <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all transform hover:-translate-y-2 border border-gray-100">
                                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={service.icon} />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                                    <p className="text-gray-600">{service.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
                <section id="contact" className="py-20 bg-white relative overflow-hidden">
                    <div className="absolute inset-0 opacity-5">
                        <svg className="absolute bottom-0 left-0 w-full h-64" viewBox="0 0 1200 120" preserveAspectRatio="none">
                            <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" fill="#3B82F6"></path>
                        </svg>
                    </div>

                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Contact Us</h2>
                            <p className="text-xl text-gray-600">
                                Get in touch with us for inquiries, assistance, or to learn more about our services.
                            </p>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-12">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h3>
                                <div className="space-y-6">
                                    <div className="flex items-start">
                                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">Address</h4>
                                            <p className="text-gray-600">Iligan City Hall Complex<br />Iligan City, Lanao del Norte<br />Philippines 9200</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">Phone</h4>
                                            <p className="text-gray-600 dark:text-gray-300">(063) 221-1234<br />Local 456</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">Email</h4>
                                            <p className="text-gray-600 dark:text-gray-300">osca@iligancity.gov.ph<br />info.osca@gmail.com</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">Office Hours</h4>
                                            <p className="text-gray-600 dark:text-gray-300">Monday - Friday: 8:00 AM - 5:00 PM<br />Saturday: 8:00 AM - 12:00 PM</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-8 rounded-xl border border-gray-100">
                                <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h3>
                                <form className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                                        <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                        <input type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                                        <textarea rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"></textarea>
                                    </div>
                                    <button type="submit" className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-lg font-medium">
                                        Send Message
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
                <section id="blog" className="py-20 bg-gray-50 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-5">
                        <div className="absolute top-20 left-20 w-8 h-8 transform rotate-45 bg-blue-600"></div>
                        <div className="absolute top-40 right-32 w-6 h-6 transform rotate-45 bg-blue-500"></div>
                        <div className="absolute bottom-32 left-1/3 w-10 h-10 transform rotate-45 bg-blue-400"></div>
                        <div className="absolute bottom-20 right-20 w-12 h-12 transform rotate-45 bg-blue-600"></div>
                        <div className="absolute top-60 left-1/2 w-4 h-4 transform rotate-45 bg-blue-300"></div>
                    </div>

                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Latest News & Updates</h2>
                            <p className="text-xl text-gray-600">
                                Stay informed about our latest programs, events, and community initiatives.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[
                                {
                                    title: "Senior Citizen's Health Fair 2024",
                                    date: "March 15, 2024",
                                    excerpt: "Join us for our annual health fair featuring free medical check-ups, health screenings, and wellness consultations for all senior citizens."
                                },
                                {
                                    title: "New Transportation Program Launched",
                                    date: "March 10, 2024",
                                    excerpt: "We're excited to announce our new transportation assistance program to help senior citizens access medical appointments and essential services."
                                },
                                {
                                    title: "Digital Literacy Classes Now Available",
                                    date: "March 5, 2024",
                                    excerpt: "Learn basic computer skills, internet navigation, and smartphone usage in our new digital literacy program designed specifically for seniors."
                                }
                            ].map((post, index) => (
                                <article key={index} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all transform hover:-translate-y-2 border border-gray-100">
                                    <div className="h-48 bg-gray-200 flex items-center justify-center">
                                        <img
                                            src="/image/osca.jpg"
                                            alt="OSCA"
                                            className="w-20 h-20 rounded-lg object-cover opacity-50"
                                        />
                                    </div>
                                    <div className="p-6">
                                        <p className="text-sm text-blue-600 mb-2 font-medium">{post.date}</p>
                                        <h3 className="text-xl font-bold text-gray-900 mb-3">{post.title}</h3>
                                        <p className="text-gray-600 mb-4">{post.excerpt}</p>
                                        <a href="#" className="text-blue-600 font-medium hover:underline">Read more →</a>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>
                <footer className="bg-gray-900 text-white py-16 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-600 to-transparent rounded-full"></div>
                        <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-blue-500 to-transparent rounded-full"></div>
                        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-gradient-to-r from-blue-400 to-transparent rounded-full"></div>
                    </div>

                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-4 gap-8">
                            <div className="col-span-2">
                                <div className="flex items-center space-x-3 mb-4">
                                    <img
                                        src="/image/osca.jpg"
                                        alt="OSCA Logo"
                                        className="w-10 h-10 rounded-lg object-cover"
                                    />
                                    <div>
                                        <h3 className="text-lg font-bold">OSCA Iligan City</h3>
                                        <p className="text-sm text-gray-400">Office of the Senior Citizen's Affairs</p>
                                    </div>
                                </div>
                                <p className="text-gray-400 mb-4 max-w-md">
                                    Dedicated to serving our senior citizens with compassion, dignity, and comprehensive support services for a better quality of life.
                                </p>
                                <div className="flex space-x-4">
                                    <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                                        <span className="sr-only">Facebook</span>
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M20 10C20 4.477 15.523 0 10 0S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clipRule="evenodd" />
                                        </svg>
                                    </a>
                                    <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                                        <span className="sr-only">Twitter</span>
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                                        </svg>
                                    </a>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                                <ul className="space-y-2">
                                    <li><a href="#about" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                                    <li><a href="#services" className="text-gray-400 hover:text-white transition-colors">Services</a></li>
                                    <li><a href="#contact" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                                    <li><a href="#blog" className="text-gray-400 hover:text-white transition-colors">News</a></li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="text-lg font-semibold mb-4">Services</h4>
                                <ul className="space-y-2">
                                    <li><span className="text-gray-400">Healthcare Services</span></li>
                                    <li><span className="text-gray-400">Social Activities</span></li>
                                    <li><span className="text-gray-400">Financial Assistance</span></li>
                                    <li><span className="text-gray-400">Transportation</span></li>
                                </ul>
                            </div>
                        </div>

                        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
                            <p className="text-gray-400">
                                © 2024 Office of the Senior Citizen's Affairs - LGU Iligan City. All rights reserved.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
