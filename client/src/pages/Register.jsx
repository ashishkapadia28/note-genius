import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    // Validation Regex
    const emailRegex = /^[a-zA-Z0-9.]+@gmail\.com$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!emailRegex.test(email)) {
            toast.error('Only letters (a-z), numbers (0-9), and periods (.) are allowed');
            return;
        }

        if (!passwordRegex.test(password)) {
            toast.error('Password must meet all complexity requirements');
            return;
        }

        setLoading(true);
        try {
            await register(name, email, password);
            toast.success('Registration successful! Please login.');
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 sm:mt-20 p-8 glass-card rounded-2xl animate-fade-in">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-500">
                    Create Account
                </h2>
                <p className="text-slate-500 mt-2">Join NoteGenius today</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-slate-700 text-sm font-semibold mb-2 ml-1">Full Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => {
                            const val = e.target.value;
                            if (/^[A-Za-z\s]*$/.test(val)) {
                                setName(val);
                            }
                        }}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-slate-700 placeholder-slate-400"
                        placeholder="John Doe"
                        required
                        disabled={loading}
                    />
                </div>
                <div>
                    <label className="block text-slate-700 text-sm font-semibold mb-2 ml-1">Email Address</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 transition-all text-slate-700 placeholder-slate-400 ${email && !emailRegex.test(email)
                            ? 'border-red-300 focus:ring-red-200 focus:border-red-500'
                            : 'border-slate-200 focus:ring-primary-500/20 focus:border-primary-500'
                            }`}
                        placeholder="yourname@gmail.com"
                        required
                        disabled={loading}
                    />
                    {email && !emailRegex.test(email) && (
                        <p className="text-red-500 text-xs mt-2 ml-1 flex items-center">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                            Only letters (a-z), numbers (0-9), and periods (.) allowed
                        </p>
                    )}
                </div>
                <div>
                    <label className="block text-slate-700 text-sm font-semibold mb-2 ml-1">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 transition-all text-slate-700 ${password && !passwordRegex.test(password)
                            ? 'border-red-300 focus:ring-red-200 focus:border-red-500'
                            : 'border-slate-200 focus:ring-primary-500/20 focus:border-primary-500'
                            }`}
                        placeholder="Enter Password"
                        required
                        disabled={loading}
                    />
                    <div className="mt-3 space-y-1 pl-1">
                        <p className={`text-xs flex items-center ${password.length >= 8 ? 'text-green-600' : 'text-slate-400'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full mr-2 ${password.length >= 8 ? 'bg-green-500' : 'bg-slate-300'}`}></span>
                            Minimum 8 characters
                        </p>
                        <p className={`text-xs flex items-center ${/[A-Z]/.test(password) ? 'text-green-600' : 'text-slate-400'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full mr-2 ${/[A-Z]/.test(password) ? 'bg-green-500' : 'bg-slate-300'}`}></span>
                            At least one uppercase letter (A-Z)
                        </p>
                        <p className={`text-xs flex items-center ${/[a-z]/.test(password) ? 'text-green-600' : 'text-slate-400'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full mr-2 ${/[a-z]/.test(password) ? 'bg-green-500' : 'bg-slate-300'}`}></span>
                            At least one lowercase letter (a-z)
                        </p>
                        <p className={`text-xs flex items-center ${/\d/.test(password) ? 'text-green-600' : 'text-slate-400'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full mr-2 ${/\d/.test(password) ? 'bg-green-500' : 'bg-slate-300'}`}></span>
                            At least one number (0-9)
                        </p>
                        <p className={`text-xs flex items-center ${/[@$!%*?&]/.test(password) ? 'text-green-600' : 'text-slate-400'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full mr-2 ${/[@$!%*?&]/.test(password) ? 'bg-green-500' : 'bg-slate-300'}`}></span>
                            At least one special character (@$!%*?&)
                        </p>
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={loading || !name || !emailRegex.test(email) || !passwordRegex.test(password)}
                    className={`w-full py-3.5 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 transform ${(loading || !name || !emailRegex.test(email) || !passwordRegex.test(password))
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                        : 'bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white shadow-primary-500/30 hover:scale-[1.02] active:scale-[0.98]'
                        }`}
                >
                    {loading ? (
                        <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Creating Account...
                        </span>
                    ) : 'Create Account'}
                </button>
            </form>
            <p className="mt-8 text-center text-sm text-slate-500">
                Already have an account? <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold hover:underline">Login here</Link>
            </p>
        </div>
    );
};

export default Register;
