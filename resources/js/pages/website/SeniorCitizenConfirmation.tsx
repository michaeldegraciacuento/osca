import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Registration {
    registration_id: string;
    full_name: string;
    email: string;
    contact_number: string;
    status: string;
    status_label: string;
    created_at: string;
}

interface Props {
    registration: Registration;
}

export default function SeniorCitizenConfirmation({ registration }: Props) {
    const handlePrint = () => {
        window.print();
    };

    return (
        <>
            <Head title="Registration Confirmation - OSCA Iligan City" />
            
            <div className="min-h-screen bg-gray-50">
                <Header showFullNav={true} />
                
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
                    {/* Success Message */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h2 className="text-lg font-semibold text-green-800">
                                    Registration Submitted Successfully!
                                </h2>
                                <p className="text-green-700">
                                    Your senior citizen registration has been received and is now being processed.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Registration Details */}
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <div className="px-6 py-4 bg-blue-600 text-white">
                            <h3 className="text-lg font-semibold">Registration Confirmation</h3>
                            <p className="text-blue-100">Please save this information for your records</p>
                        </div>
                        
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Registration ID</label>
                                    <div className="text-2xl font-bold text-blue-600 font-mono">
                                        {registration.registration_id}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                                        {registration.status}
                                    </span>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Applicant Name</label>
                                    <div className="text-lg font-semibold text-gray-900">
                                        {registration.last_name}, {registration.first_name} {registration.middle_name}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Submitted On</label>
                                    <div className="text-gray-900">
                                        {new Date(registration.created_at).toLocaleString()}
                                    </div>
                                </div>
                            </div>

                            {/* Important Information */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                <h4 className="text-lg font-semibold text-blue-800 mb-3">What happens next?</h4>
                                <div className="space-y-2 text-blue-700">
                                    <div className="flex items-start">
                                        <span className="flex-shrink-0 w-6 h-6 bg-blue-200 text-blue-800 text-sm font-bold rounded-full flex items-center justify-center mt-0.5 mr-3">1</span>
                                        <span>Your application will be reviewed by our staff within <strong>1-3 business days</strong>.</span>
                                    </div>
                                    <div className="flex items-start">
                                        <span className="flex-shrink-0 w-6 h-6 bg-blue-200 text-blue-800 text-sm font-bold rounded-full flex items-center justify-center mt-0.5 mr-3">2</span>
                                        <span>We will verify the information and documents you provided.</span>
                                    </div>
                                    <div className="flex items-start">
                                        <span className="flex-shrink-0 w-6 h-6 bg-blue-200 text-blue-800 text-sm font-bold rounded-full flex items-center justify-center mt-0.5 mr-3">3</span>
                                        <span>You will receive a notification via email or phone call regarding the status of your application.</span>
                                    </div>
                                    <div className="flex items-start">
                                        <span className="flex-shrink-0 w-6 h-6 bg-blue-200 text-blue-800 text-sm font-bold rounded-full flex items-center justify-center mt-0.5 mr-3">4</span>
                                        <span>Once approved, you can visit our office!</span>
                                    </div>
                                    <div className="flex items-start">
                                        <span className="flex-shrink-0 w-6 h-6 bg-blue-200 text-blue-800 text-sm font-bold rounded-full flex items-center justify-center mt-0.5 mr-3">5</span>
                                        <span>Note: Keep a copy of your <b>Registration ID</b> for future reference.</span>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                                <h4 className="text-lg font-semibold text-gray-800 mb-3">Need Help?</h4>
                                <p className="text-gray-600 mb-3">
                                    If you have any questions about your application, please contact us:
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <strong className="text-gray-700">Phone:</strong> (063) 221-1234 Local 456
                                    </div>
                                    <div>
                                        <strong className="text-gray-700">Email:</strong> osca@iligancity.gov.ph
                                    </div>
                                    <div className="md:col-span-2">
                                        <strong className="text-gray-700">Office:</strong> OSCA Office, Iligan City Hall Complex, Iligan City
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={handlePrint}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md font-medium flex items-center justify-center"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                    </svg>
                                    Print Confirmation
                                </button>
                                
                                <Link
                                    href="/"
                                    className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all shadow-md font-medium flex items-center justify-center"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                    Back to Home
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                
                <Footer />
            </div>
        </>
    );
}
