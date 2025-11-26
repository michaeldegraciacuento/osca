import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [registrationId, setRegistrationId] = useState('');
    const [statusLoading, setStatusLoading] = useState(false);
    const [statusError, setStatusError] = useState<string | null>(null);
    const [statusResult, setStatusResult] = useState<any>(null);
    
    // Calendar modal state
    const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
    const [calendarLoading, setCalendarLoading] = useState(false);
    const [calendarVisits, setCalendarVisits] = useState<any[]>([]);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    // Mortuary Aid modal state
    const [isMortuaryModalOpen, setIsMortuaryModalOpen] = useState(false);

    const checkStatus = async () => {
        try {
            setStatusLoading(true);
            setStatusError(null);
            setStatusResult(null);

            const id = registrationId.trim();
            if (!id) {
                setStatusError('Enter a Registration ID.');
                return;
            }

            // Use GET (avoids CSRF token requirement)
            const res = await fetch(`/senior-citizen/check-status/${encodeURIComponent(id)}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
                credentials: 'same-origin',
            });

            if (res.status === 404) {
                setStatusError('Registration ID not found.');
                return;
            }
            if (!res.ok) {
                setStatusError('Unable to fetch status.');
                return;
            }

            const data = await res.json();
            if (!data.success) {
                setStatusError(data.message || 'Unable to fetch status.');
                return;
            }
            setStatusResult(data.registration);
        } catch {
            setStatusError('Something went wrong. Please try again.');
        } finally {
            setStatusLoading(false);
        }
    };

    const fetchCalendarVisits = async () => {
        try {
            setCalendarLoading(true);
            const res = await fetch('/api/home-visit-calendar', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
                credentials: 'same-origin',
            });

            if (!res.ok) {
                console.error('Failed to fetch calendar visits');
                return;
            }

            const data = await res.json();
            setCalendarVisits(data.visits || []);
        } catch (error) {
            console.error('Error fetching calendar visits:', error);
        } finally {
            setCalendarLoading(false);
        }
    };

    const openCalendarModal = () => {
        setIsCalendarModalOpen(true);
        fetchCalendarVisits();
    };

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();
        
        return { daysInMonth, startingDayOfWeek, year, month };
    };

    const hasVisitOnDate = (date: Date) => {
        // Format date as YYYY-MM-DD without timezone conversion
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;
        return calendarVisits.some(visit => visit.scheduled_date === dateStr);
    };

    const getVisitsForDate = (date: Date) => {
        // Format date as YYYY-MM-DD without timezone conversion
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;
        return calendarVisits.filter(visit => visit.scheduled_date === dateStr);
    };

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    };

    const prevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    };

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                        'July', 'August', 'September', 'October', 'November', 'December'];

    return (
        <>
            <Head title="OSCA - Office of the Senior Citizen's Affairs | LGU Iligan City">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=inter:300,400,500,600,700" rel="stylesheet" />
                <meta name="description" content="Office of the Senior Citizen's Affairs - LGU Iligan City. Serving our senior citizens with care, support, and comprehensive services." />
                <meta name="color-scheme" content="light" />
            </Head>
            <div className="min-h-screen bg-white text-gray-900">
                <Header showFullNav={true} />
                <section id="home" className="pt-16 min-h-screen flex items-center relative overflow-hidden bg-gray-50">
                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh] -mt-16">
                            <div className="text-center lg:text-left">
                                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                                    Office for the
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
                                    backgroundImage: 'url(/image/hero.jpg)'
                                }}
                            >
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

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl border-2 border-blue-200 hover:shadow-lg transition-all transform hover:-translate-y-2 group hover:border-blue-300">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-15 h-10 bg-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-bold text-blue-900">Register as a Senior Citizen</h3>
                                </div>
                                <Link
                                    href="/senior-citizen/register"
                                    className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-bold text-sm group-hover:shadow-lg block text-center"
                                >
                                    Start Registration
                                </Link>
                            </div>

                            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl border-2 border-green-200 hover:shadow-lg transition-all transform hover:-translate-y-2 group hover:border-green-300">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-11 h-10 bg-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-bold text-green-900 ">Mortuary Aid</h3>
                                </div>
                                <button 
                                    onClick={() => setIsMortuaryModalOpen(true)}
                                    className="w-full mt-4 px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-bold text-sm group-hover:shadow-lg"
                                >
                                    Apply Now
                                </button>
                            </div>

                            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-xl border-2 border-orange-200 hover:shadow-lg transition-all transform hover:-translate-y-2 group hover:border-orange-300">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-15 h-11 bg-orange-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                        </svg>
                                    </div>
                                    <h3 className="text-base font-bold text-orange-900">Check Application Status</h3>
                                </div>
                                <button
                                    className="w-full mt-1 px-6 py-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all font-bold text-sm group-hover:shadow-lg"
                                    onClick={() => setIsStatusModalOpen(true)}
                                >
                                    Check Status
                                </button>
                            </div>

                            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-xl border-2 border-purple-200 hover:shadow-lg transition-all transform hover:-translate-y-2 group hover:border-purple-300">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-14 h-11 bg-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                        </svg>
                                    </div>
                                    <h3 className="text-base font-bold text-purple-900">Home Visit Calendar</h3>
                                </div>
                                <button 
                                    className="w-full px-6 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all font-bold text-sm group-hover:shadow-lg"
                                    onClick={openCalendarModal}
                                >
                                    Check Visit
                                </button>
                            </div>
                        </div>

                        <div className="text-center mt-12">
                            <p className="text-gray-600 mb-4 text-lg">Need help with any of these services?</p>
                            <a href="#contact" className="inline-flex items-center px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all font-bold text-lg">
                                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                Contact Our Support Team
                            </a>
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
                                            <p className="text-gray-600 text-gray-300">(063) 221-1234<br />Local 456</p>
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
                                            <p className="text-gray-600 text-gray-300">osca@iligancity.gov.ph<br />info.osca@gmail.com</p>
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
                                            <p className="text-gray-600 text-gray-300">Monday - Friday: 8:00 AM - 5:00 PM<br />Saturday: 8:00 AM - 12:00 PM</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-8 rounded-xl border border-gray-100">
                                <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h3>
                                <form className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                                        <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                        <input type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                                        <textarea rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"></textarea>
                                    </div>
                                    <button type="submit" className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-lg font-medium">
                                        Send Message
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="py-20 bg-gray-50 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-5">
                        <div className="absolute top-10 right-10 w-32 h-32 bg-blue-600 rounded-full"></div>
                        <div className="absolute bottom-10 left-10 w-24 h-24 bg-blue-400 rounded-full"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-blue-300 rounded-full"></div>
                    </div>

                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Visit Our Office</h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Find us at the Iligan City Hall Complex. We're here to serve you and provide assistance with all senior citizen services.
                            </p>
                        </div>

                        <div className="grid lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-1 space-y-6">
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 mb-2">Office Address</h3>
                                            <p className="text-gray-600 leading-relaxed">
                                                Iligan City Hall Complex<br />
                                                Iligan City, Lanao del Norte<br />
                                                Philippines 9200
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 mb-2">Office Hours</h3>
                                            <p className="text-gray-600 leading-relaxed">
                                                Monday - Friday: 8:00 AM - 5:00 PM<br />
                                                Saturday: 8:00 AM - 12:00 PM<br />
                                                Sunday: Closed
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                                            <svg className="w-12 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 mb-2">Getting There</h3>
                                            <p className="text-gray-600 leading-relaxed">
                                                Located at the main Iligan City Hall building. Public transportation and parking available nearby.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-2">
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                    <div className="p-4 bg-gray-50 border-b border-gray-100">
                                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 9m0 8V9m0 0V7m0 2L9 7" />
                                            </svg>
                                            OSCA Office Location
                                        </h3>
                                    </div>
                                    <div className="relative h-96 bg-gray-100">
                                        <iframe
                                            src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3970.242!2d124.25173190821492!3d8.225997815576388!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zOMKwMTMnMzMuNiJOIDEyNMKwMTUnMDYuMiJF!5e0!3m2!1sen!2sph!4v1647856384234!5m2!1sen!2sph"
                                            width="100%"
                                            height="100%"
                                            style={{ border: 0 }}
                                            allowFullScreen
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                            className="absolute inset-0"
                                            title="OSCA Office Location - Iligan City Hall"
                                        />
                                    </div>

                                    <div className="p-4 bg-gray-50 border-t border-gray-100">
                                        <div className="flex flex-wrap items-center justify-between gap-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Exact coordinates: 8°13'33.6"N 124°15'06.2"E
                                            </div>
                                            <div className="flex gap-2">
                                                <a
                                                    href="https://maps.google.com/?q=8.225997815576388,124.25173190821492"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm font-medium"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                    </svg>
                                                    Open in Google Maps
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Check Status Modal */}
                <Dialog open={isStatusModalOpen} onOpenChange={(open) => {
                    setIsStatusModalOpen(open);
                    if (!open) {
                        setRegistrationId('');
                        setStatusResult(null);
                        setStatusError(null);
                        setStatusLoading(false);
                    }
                }}>
                    <DialogContent className="bg-white text-gray-900">
                        <DialogHeader>
                            <DialogTitle>Check Application Status</DialogTitle>
                            <DialogDescription>Enter your Registration ID to see the current status of your application.</DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="registrationId">Registration ID</Label>
                                <Input
                                    id="registrationId"
                                    placeholder="e.g., OSCA-202510-1147"
                                    value={registrationId}
                                    onChange={(e) => setRegistrationId(e.target.value)}
                                />
                            </div>

                            {statusError && (
                                <div className="text-sm text-red-600 bg-red-50 border border-red-200 p-2 rounded">
                                    {statusError}
                                </div>
                            )}

                            {statusResult && (
                                <div className="rounded-lg border p-3 bg-white">
                                    <div className="grid sm:grid-cols-2 gap-3 text-sm">
                                        <div>
                                            <div className="text-muted-foreground">Registration ID</div>
                                            <div className="font-medium">{statusResult.id}</div>
                                        </div>
                                        <div>
                                            <div className="text-muted-foreground">Name</div>
                                            <div className="font-medium">{statusResult.name}</div>
                                        </div>
                                        <div>
                                            <div className="text-muted-foreground">Status</div>
                                            <div className="font-medium">{statusResult.status_label || statusResult.status}</div>
                                        </div>
                                        <div>
                                            <div className="text-muted-foreground">Submitted</div>
                                            <div className="font-medium">{statusResult.submitted_at}</div>
                                        </div>
                                        {statusResult.reviewed_at && (
                                            <div>
                                                <div className="text-muted-foreground">Reviewed</div>
                                                <div className="font-medium">{statusResult.reviewed_at}</div>
                                            </div>
                                        )}
                                        {statusResult.notes && (
                                            <div className="sm:col-span-2">
                                                <div className="text-muted-foreground">Notes</div>
                                                <div className="font-medium">{statusResult.notes}</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <DialogFooter className="gap-2">
                            <Button variant="outline" onClick={() => setIsStatusModalOpen(false)}>Close</Button>
                            <Button onClick={checkStatus} disabled={statusLoading || !registrationId.trim()}>
                                {statusLoading ? 'Checking...' : 'Check Status'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Home Visit Calendar Modal */}
                <Dialog open={isCalendarModalOpen} onOpenChange={(open) => {
                    setIsCalendarModalOpen(open);
                    if (!open) {
                        setSelectedDate(null);
                        setCalendarVisits([]);
                    }
                }}>
                    <DialogContent className="max-h-[90vh] overflow-y-auto bg-white text-gray-900" style={{ width: '90vw', maxWidth: '900px' }}>
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold text-gray-900">Home Visit Calendar</DialogTitle>
                            <DialogDescription>
                                View scheduled home visits for senior citizens
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4">
                            {calendarLoading ? (
                                <div className="flex justify-center items-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                                </div>
                            ) : (
                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Left Column - Calendar */}
                                    <div className="space-y-4">
                                        {/* Calendar Header */}
                                        <div className="flex items-center justify-between mb-4">
                                            <Button
                                                variant="outline"
                                                onClick={prevMonth}
                                                className="px-4 py-2"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                </svg>
                                            </Button>
                                            <h3 className="text-lg font-bold text-gray-900">
                                                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                                            </h3>
                                            <Button
                                                variant="outline"
                                                onClick={nextMonth}
                                                className="px-4 py-2"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </Button>
                                        </div>

                                        {/* Calendar Grid */}
                                        <div className="grid grid-cols-7 gap-1">
                                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                                <div key={day} className="text-center font-bold text-xs text-gray-600 py-2">
                                                    {day}
                                                </div>
                                            ))}
                                            
                                            {(() => {
                                                const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth);
                                                const days = [];
                                                
                                                // Empty cells before first day
                                                for (let i = 0; i < startingDayOfWeek; i++) {
                                                    days.push(<div key={`empty-${i}`} className="p-2"></div>);
                                                }
                                                
                                                // Days of the month
                                                for (let day = 1; day <= daysInMonth; day++) {
                                                    const date = new Date(year, month, day);
                                                    const hasVisit = hasVisitOnDate(date);
                                                    const isSelected = selectedDate?.toDateString() === date.toDateString();
                                                    const isToday = new Date().toDateString() === date.toDateString();
                                                    
                                                    days.push(
                                                        <button
                                                            key={day}
                                                            onClick={() => setSelectedDate(date)}
                                                            className={`p-2 rounded-lg text-center transition-all text-sm ${
                                                                isSelected 
                                                                    ? 'bg-purple-600 text-white font-bold shadow-lg' 
                                                                    : hasVisit 
                                                                        ? 'bg-purple-100 text-purple-900 font-semibold hover:bg-purple-200 border-2 border-purple-400' 
                                                                        : isToday
                                                                            ? 'bg-gray-100 text-gray-900 font-medium hover:bg-gray-200'
                                                                            : 'text-gray-700 hover:bg-gray-50'
                                                            }`}
                                                        >
                                                            {day}
                                                            {hasVisit && !isSelected && (
                                                                <div className="w-1 h-1 bg-purple-600 rounded-full mx-auto mt-0.5"></div>
                                                            )}
                                                        </button>
                                                    );
                                                }
                                                
                                                return days;
                                            })()}
                                        </div>
                                    </div>

                                    {/* Right Column - Selected Date Details */}
                                    <div className="space-y-4">
                                        <div className="sticky top-0">
                                            {selectedDate ? (
                                                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200 min-h-[400px]">
                                                    <h4 className="font-bold text-base text-purple-900 mb-3">
                                                        {selectedDate.toLocaleDateString('en-US', { 
                                                            weekday: 'long', 
                                                            year: 'numeric', 
                                                            month: 'long', 
                                                            day: 'numeric' 
                                                        })}
                                                    </h4>
                                                    {(() => {
                                                        const visits = getVisitsForDate(selectedDate);
                                                        if (visits.length === 0) {
                                                            return (
                                                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                                                    <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                    </svg>
                                                                    <p className="text-gray-500 text-sm font-medium">No visits scheduled</p>
                                                                    <p className="text-gray-400 text-xs mt-1">This date has no scheduled home visits</p>
                                                                </div>
                                                            );
                                                        }
                                                        return (
                                                            <>
                                                                <p className="text-xs text-purple-700 mb-4 font-medium">
                                                                    {visits.length} visit{visits.length > 1 ? 's' : ''} scheduled
                                                                </p>
                                                                <div className="space-y-3 max-h-[450px] overflow-y-auto pr-2">
                                                                    {visits.map((visit: any, idx: number) => (
                                                                        <div key={idx} className="bg-white p-4 rounded-lg shadow-sm border border-purple-100 hover:shadow-md transition-shadow">
                                                                            <div className="flex items-start justify-between mb-2">
                                                                                <div className="flex items-center gap-2">
                                                                                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                                    </svg>
                                                                                    <p className="font-bold text-gray-900">{visit.time_slot}</p>
                                                                                </div>
                                                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                                                                    visit.status === 'Scheduled' 
                                                                                        ? 'bg-blue-100 text-blue-700'
                                                                                        : visit.status === 'Re-Scheduled'
                                                                                            ? 'bg-orange-100 text-orange-700'
                                                                                            : 'bg-green-100 text-green-700'
                                                                                }`}>
                                                                                    {visit.status}
                                                                                </span>
                                                                            </div>
                                                                            {(visit.full_name || visit.registration_id) && (
                                                                                <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-purple-100">
                                                                                    {visit.full_name && (
                                                                                        <div className="flex items-center gap-2">
                                                                                            <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                                                            </svg>
                                                                                            <span className="text-xs text-gray-700 font-medium truncate">{visit.full_name}</span>
                                                                                        </div>
                                                                                    )}
                                                                                    {visit.registration_id && (
                                                                                        <div className="flex items-center gap-2">
                                                                                            <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-4m-4-8l4-4m0 0l4 4m-4-4v12" />
                                                                                            </svg>
                                                                                            <span className="text-xs text-gray-700 font-mono truncate">{visit.registration_id}</span>
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </>
                                                        );
                                                    })()}
                                                </div>
                                            ) : (
                                                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 min-h-[400px] flex flex-col items-center justify-center text-center">
                                                    <svg className="w-20 h-20 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    <h4 className="font-semibold text-gray-700 mb-2">Select a Date</h4>
                                                    <p className="text-gray-500 text-sm max-w-xs">
                                                        Click on a date in the calendar to view scheduled home visits for that day
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {/* Legend */}
                                        <div className="flex  gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 bg-purple-100 border-2 border-purple-400 rounded"></div>
                                                <span className="text-xs text-gray-700">Has Scheduled Visits</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 bg-gray-100 rounded"></div>
                                                <span className="text-xs text-gray-700">Today</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 bg-purple-600 rounded"></div>
                                                <span className="text-xs text-gray-700">Selected Date</span>
                                            </div>
                                        </div>
                                </div>
                            )}
                        </div>

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsCalendarModalOpen(false)}>
                                Close
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Mortuary Aid Application Process Modal */}
                <Dialog open={isMortuaryModalOpen} onOpenChange={setIsMortuaryModalOpen}>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white text-gray-900">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold text-gray-900">Mortuary Aid Application Process</DialogTitle>
                            <DialogDescription>
                                Follow these steps to apply for mortuary assistance for a deceased senior citizen
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-6 py-4">
                            {/* Step 1 */}
                            <div className="flex gap-4">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                        1
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">Apply for Senior Citizen Registration</h3>
                                    <p className="text-gray-600 mb-3">
                                        First, the deceased must have been a registered senior citizen. If not yet registered, you need to complete the Senior Citizen Registration form with all required information and documents.
                                    </p>
                                    <Link
                                        href="/senior-citizen/register"
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium text-sm"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                        </svg>
                                        Start Registration
                                    </Link>
                                </div>
                            </div>

                            {/* Step 2 */}
                            <div className="flex gap-4">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                        2
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">Wait for Registration Review</h3>
                                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-3">
                                        <div className="flex items-start gap-3">
                                            <svg className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <div>
                                                <p className="font-semibold text-orange-900 mb-1">Review Period: Up to 3 Business Days</p>
                                                <p className="text-sm text-orange-700">
                                                    Our team will review the registration application. The status will be updated to "Under Review" during this period.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 text-sm">
                                        You can check your application status anytime using your Registration ID.
                                    </p>
                                </div>
                            </div>

                            {/* Step 3 */}
                            <div className="flex gap-4">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                        3
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">Receive Approval Notification</h3>
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-3">
                                        <div className="flex items-start gap-3">
                                            <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            <div>
                                                <p className="font-semibold text-green-900 mb-1">Email Notification</p>
                                                <p className="text-sm text-green-700">
                                                    Once approved, you will receive an email notification to the registered email address with instructions to proceed with the mortuary aid application.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Step 4 */}
                            <div className="flex gap-4">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                        4
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">Upload Mortuary Aid Documents</h3>
                                    <p className="text-gray-600 mb-3">
                                        After approval, log in to the portal and upload all necessary documents for the mortuary aid application:
                                    </p>
                                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                        <p className="font-semibold text-purple-900 mb-3 text-sm">Required Documents:</p>
                                        <ul className="space-y-2 text-sm text-purple-800">
                                            <li className="flex items-start gap-2">
                                                <svg className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span>OSCA ID (Original)</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <svg className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span>Barangay Residency Certificate</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <svg className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span>Barangay Indigency Certificate</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <svg className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span>Death Certificate</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <svg className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span>Affidavit of Next of Kin</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <svg className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span>OSCA Certificate</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <svg className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span>Marriage Contract (if applicable)</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <svg className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span>Birth Certificate of Children</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <svg className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span>Valid ID of Children</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <svg className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span>Valid ID of Claimants</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <svg className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span>Waiver / Authority to Claim</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-3 italic">
                                        * All documents must be in PDF, JPG, JPEG, or PNG format (max 5MB each)
                                    </p>
                                </div>
                            </div>

                            {/* Important Note */}
                            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-lg">
                                <div className="flex items-start gap-3">
                                    <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div>
                                        <p className="font-semibold text-blue-900 mb-1">Important Note</p>
                                        <p className="text-sm text-blue-800">
                                            The mortuary aid application is automatically created once the senior citizen registration is approved. You just need to upload the required documents through the portal after receiving the approval email.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="gap-2">
                            <Button variant="outline" onClick={() => setIsMortuaryModalOpen(false)}>
                                Close
                            </Button>
                            <Link href="/senior-citizen/register">
                                <Button className="bg-blue-600 hover:bg-blue-700">
                                    Start Registration Now
                                </Button>
                            </Link>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Footer />
            </div>
        </>
    );
}