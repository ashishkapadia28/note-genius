import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Mail, ArrowLeft, Loader2 } from 'lucide-react';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/auth/forgot-password', { email });
            setSent(true);
            toast.success('Reset link sent to your email');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to send request');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-8 glass-card rounded-2xl animate-fade-in relative">
            <Link to="/login" className="absolute top-8 left-8 text-slate-400 hover:text-slate-600 transition-colors">
                <ArrowLeft className="w-6 h-6" />
            </Link>

            <div className="text-center mb-8 mt-4">
                <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                    <Mail className="w-8 h-8 text-primary-600" />
                </div>
                <h2 className="text-3xl font-bold text-slate-800">Forgot Password?</h2>
                <p className="text-slate-500 mt-2">Enter your email to receive a reset link</p>
            </div>

            {!sent ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-slate-700 text-sm font-semibold mb-2 ml-1">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-slate-700 placeholder-slate-400"
                            placeholder="yourname@gmail.com"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3.5 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 transform ${loading
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                            : 'bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white shadow-primary-500/30 hover:scale-[1.02] active:scale-[0.98]'
                            }`}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                                Sending...
                            </span>
                        ) : 'Send Reset Link'}
                    </button>
                </form>
            ) : (
                <div className="text-center space-y-6">
                    <div className="bg-green-50 text-green-700 p-4 rounded-xl border border-green-100 mb-6">
                        <p className="font-medium">Check your inbox!</p>
                        <p className="text-sm mt-1">We've sent a password reset link to {email}</p>
                    </div>
                    <button
                        onClick={() => setSent(false)}
                        className="text-primary-600 font-semibold hover:underline"
                    >
                        Resend Link
                    </button>
                </div>
            )}
        </div>
    );
};

export default ForgotPassword;
