import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, BookOpen, Trash2, ChevronDown } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setShowLogoutConfirm(false);
    };

    const handleDeleteAccount = async () => {
        try {
            await api.delete('/auth/delete-account');
            logout();
            toast.success('Account deleted successfully');
            navigate('/register');
        } catch (error) {
            toast.error('Failed to delete account');
            console.error(error);
        } finally {
            setShowDeleteConfirm(false);
        }
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
                                    <div className="flex items-center ml-2 sm:ml-6 space-x-3 relative">
                                        <button
                                            onClick={() => setShowUserMenu(!showUserMenu)}
                                            className="flex items-center space-x-2 text-sm font-medium text-slate-700 hover:text-primary-600 bg-white hover:bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                        >
                                            <span className="font-bold">{user.name}</span>
                                            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
                                        </button>

                                        {/* Dropdown Menu */}
                                        {showUserMenu && (
                                            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 animate-fade-in z-50">
                                                <button
                                                    onClick={() => {
                                                        setShowUserMenu(false);
                                                        setShowDeleteConfirm(true);
                                                    }}
                                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Delete Account
                                                </button>
                                                <div className="h-px bg-slate-100 my-1"></div>
                                                <button
                                                    onClick={() => {
                                                        setShowUserMenu(false);
                                                        setShowLogoutConfirm(true);
                                                    }}
                                                    className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 flex items-center transition-colors"
                                                >
                                                    <LogOut className="w-4 h-4 mr-2" />
                                                    Logout
                                                </button>
                                            </div>
                                        )}

                                        {/* Click outside closer overlay */}
                                        {showUserMenu && (
                                            <div
                                                className="fixed inset-0 z-40 bg-transparent"
                                                onClick={() => setShowUserMenu(false)}
                                            ></div>
                                        )}
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

            {/* Delete Account Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in p-4">
                    <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-sm w-full border border-white/20 transform transition-all scale-100 relative">
                        <h3 className="text-xl font-bold text-red-600 mb-2">Delete Account</h3>
                        <p className="text-slate-500 mb-8">This action cannot be undone. All your notes and history will be permanently lost.</p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="px-5 py-2.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 hover:border-slate-300 font-medium transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                className="px-5 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 shadow-lg shadow-red-600/30 font-medium transition-all"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;
