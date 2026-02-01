import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Lock, Loader2, Eye, EyeOff } from 'lucide-react';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // Validation Regex (Same as Register)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords don't match");
            return;
        }

        if (!passwordRegex.test(password)) {
            toast.error('Password must meet complexity requirements');
            return;
        }

        setLoading(true);
        try {
            await api.post('/auth/reset-password', { token, newPassword: password });
            toast.success('Password reset successful! Please login.');
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Reset failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-8 glass-card rounded-2xl animate-fade-in">
            <div className="text-center mb-8">
                <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                    <Lock className="w-8 h-8 text-primary-600" />
                </div>
                <h2 className="text-3xl font-bold text-slate-800">Reset Password</h2>
                <p className="text-slate-500 mt-2">Enter your new secure password</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-slate-700 text-sm font-semibold mb-2 ml-1">New Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 transition-all text-slate-700 pr-12 ${password && !passwordRegex.test(password)
                                ? 'border-red-300 focus:ring-red-200 focus:border-red-500'
                                : 'border-slate-200 focus:ring-primary-500/20 focus:border-primary-500'
                                }`}
                            placeholder="Enter new password"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                        >
                            {showPassword ? (
                                <EyeOff className="w-5 h-5" />
                            ) : (
                                <Eye className="w-5 h-5" />
                            )}
                        </button>
                    </div>

                    {/* Reuse validation UI or keep simple for now */}
                    <div className="mt-3 space-y-1 pl-1">
                        <p className={`text-xs flex items-center ${password.length >= 8 ? 'text-green-600' : 'text-slate-400'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full mr-2 ${password.length >= 8 ? 'bg-green-500' : 'bg-slate-300'}`}></span>
                            Min 8 chars
                        </p>
                        <p className={`text-xs flex items-center ${/[A-Z]/.test(password) ? 'text-green-600' : 'text-slate-400'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full mr-2 ${/[A-Z]/.test(password) ? 'bg-green-500' : 'bg-slate-300'}`}></span>
                            Uppercase
                        </p>
                        <p className={`text-xs flex items-center ${/[@$!%*?&]/.test(password) ? 'text-green-600' : 'text-slate-400'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full mr-2 ${/[@$!%*?&]/.test(password) ? 'bg-green-500' : 'bg-slate-300'}`}></span>
                            Special char
                        </p>
                    </div>
                </div>
                <div>
                    <label className="block text-slate-700 text-sm font-semibold mb-2 ml-1">Confirm Password</label>
                    <div className="relative">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-slate-700 placeholder-slate-400 pr-12"
                            placeholder="Confirm new password"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                        >
                            {showConfirmPassword ? (
                                <EyeOff className="w-5 h-5" />
                            ) : (
                                <Eye className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={loading || !passwordRegex.test(password)}
                    className={`w-full py-3.5 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 transform ${loading || !passwordRegex.test(password)
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                        : 'bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white shadow-primary-500/30 hover:scale-[1.02] active:scale-[0.98]'
                        }`}
                >
                    {loading ? (
                        <span className="flex items-center justify-center">
                            <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                            Resetting...
                        </span>
                    ) : 'Reset Password'}
                </button>
            </form>
        </div>
    );
};

export default ResetPassword;
