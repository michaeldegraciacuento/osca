import React from 'react';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white py-16 relative overflow-hidden">
            {/* ...existing code from your footer... */}
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
                                src="/image/osca-final.png"
                                alt="OSCA Logo"
                                className="w-10 h-10 rounded-lg object-cover"
                            />
                            <div>
                                <h3 className="text-lg font-bold">OSCA Iligan City</h3>
                                <p className="text-sm text-gray-400">Office for the Senior Citizen's Affairs</p>
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
                            <li><a href="/#about" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                            <li><a href="/#services" className="text-gray-400 hover:text-white transition-colors">Services</a></li>
                            <li><a href="/#contact" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                            <li><a href="/#blog" className="text-gray-400 hover:text-white transition-colors">News</a></li>
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
    );
}
