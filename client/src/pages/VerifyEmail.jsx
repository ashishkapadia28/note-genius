import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

const VerifyEmail = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('verifying'); // verifying, success, error
    const verifyCalled = useRef(false);

    useEffect(() => {
        const verify = async () => {
            if (verifyCalled.current) return;
            verifyCalled.current = true;

            try {
                console.log("Verifying email with token:", token);
                await api.post('/auth/verify-email', { token });
                setStatus('success');
                toast.success('Email verified! You can now login.');
                setTimeout(() => navigate('/login'), 3000);
            } catch (error) {
                setStatus('error');
                toast.error(error.response?.data?.error || 'Verification failed');
            }
        };
        verify();
    }, [token, navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
            <div className="glass-card p-10 rounded-3xl border border-white/40 shadow-xl text-center max-w-md w-full">
                {status === 'verifying' && (
                    <>
                        <Loader2 className="w-16 h-16 text-primary-500 animate-spin mx-auto mb-6" />
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Verifying Email...</h2>
                        <p className="text-slate-500">Please wait while we verify your email address.</p>
                    </>
                )}
                {status === 'success' && (
                    <>
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Email Verified!</h2>
                        <p className="text-slate-500">Redirecting to login page...</p>
                    </>
                )}
                {status === 'error' && (
                    <>
                        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Verification Failed</h2>
                        <p className="text-slate-500 mb-6">The link may be invalid or expired.</p>
                        <button
                            onClick={() => navigate('/login')}
                            className="bg-primary-500 text-white px-6 py-2 rounded-xl font-semibold hover:bg-primary-600 transition-colors"
                        >
                            Back to Login
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;
