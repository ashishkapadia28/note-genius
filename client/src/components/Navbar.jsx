import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, BookOpen } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setShowLogoutConfirm(false);
    };

    return (
        <>
            <nav className="glass sticky top-4 z-50 rounded-2xl mx-4 mt-4 mb-6 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link to="/" className="flex-shrink-0 flex items-center group">
                                <img src="/logo.png" alt="NoteGenius Logo" className="h-10 w-auto" />
                            </Link>
                        </div>
                        <div className="flex items-center space-x-2 sm:space-x-4">
                            {user ? (
                                <>
                                    <div className="hidden md:flex space-x-1">
                                        <Link to="/" className="text-slate-600 hover:text-primary-600 hover:bg-primary-50 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200">
                                            Dashboard
                                        </Link>
                                        <Link to="/history" className="text-slate-600 hover:text-primary-600 hover:bg-primary-50 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200">
                                            History
                                        </Link>
                                    </div>
                                    <div className="flex items-center ml-2 sm:ml-6 space-x-3">
                                        <span className="hidden sm:block text-sm font-medium text-slate-500 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                                            {user.name}
                                        </span>
                                        <button
                                            onClick={() => setShowLogoutConfirm(true)}
                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-4 font-medium rounded-xl text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                                        >
                                            <LogOut className="h-4 w-4 sm:mr-2" />
                                            <span className="hidden sm:inline">Logout</span>
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="text-slate-600 hover:text-primary-600 px-4 py-2 rounded-xl text-sm font-medium transition-colors">
                                        Login
                                    </Link>
                                    <Link to="/register" className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Logout Confirmation Modal */}
            {showLogoutConfirm && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in p-4">
                    <div
                        className="bg-white rounded-2xl p-8 shadow-2xl max-w-sm w-full border border-white/20 transform transition-all scale-100 relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Sign Out</h3>
                        <p className="text-slate-500 mb-8">Are you sure you want to end your session?</p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowLogoutConfirm(false)}
                                className="px-5 py-2.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 hover:border-slate-300 font-medium transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleLogout}
                                className="px-5 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 shadow-lg shadow-red-500/30 font-medium transition-all"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;
