import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { type SharedData } from '@/types';

interface HeaderProps {
    showFullNav?: boolean;
    title?: string;
    subtitle?: string;
}

export default function Header({ showFullNav = true, title, subtitle }: HeaderProps) {
    const { auth } = usePage<SharedData>().props;
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const headerTitle = title || "OSCA";
    const headerSubtitle = subtitle || "Iligan City";

    return (
        <header className={`${showFullNav ? 'fixed' : ''} top-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 z-50 shadow-sm`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-3">
                        <img
                            src="/image/osca-final.png"
                            alt="OSCA Logo"
                            className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div>
                            <h1 className="text-lg font-bold text-gray-900">{headerTitle}</h1>
                            <p className="text-xs text-gray-600">{headerSubtitle}</p>
                        </div>
                    </div>

                    {showFullNav && (
                        <>
                            <nav className="hidden md:flex items-center space-x-8">
                                <a href="/" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Home</a>
                                <a href="/#about" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">About</a>
                                <a href="/#services" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Services</a>
                                <a href="/#contact" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Contact</a>
                                <a href="/#blog" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">News</a>
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
                                    <Link
                                        href={route('login')}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md font-medium"
                                    >
                                        Login
                                    </Link>
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
                        </>
                    )}

                    {!showFullNav && (
                        <Link
                            href="/"
                            className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                        >
                            Back to Home
                        </Link>
                    )}  
                </div>

                {showFullNav && isMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-100">
                        <div className="flex flex-col space-y-3">
                            <a href="/" className="text-gray-700 hover:text-blue-600 font-medium">Home</a>
                            <a href="/" className="text-gray-700 hover:text-blue-600 font-medium">About</a>
                            <a href="/" className="text-gray-700 hover:text-blue-600 font-medium">Services</a>
                            <a href="/" className="text-gray-700 hover:text-blue-600 font-medium">Contact</a>
                            <a href="/" className="text-gray-700 hover:text-blue-600 font-medium">News</a>
                            {auth.user ? (
                                <Link href={route('dashboard')} className="text-blue-600 font-medium">Dashboard</Link>
                            ) : (
                                <div className="flex space-x-4 pt-2">
                                    <Link href={route('login')} className="text-gray-700">Login</Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
