import { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Upload, FileText, Loader2, Save } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleGenerate = async () => {
        if (!user) {
            toast.error('Please login to generate notes');
            navigate('/login');
            return;
        }

        if (!file) {
            toast.error('Please upload a PDF');
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await api.post('/notes/analyze', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setResult(response.data);
            toast.success('Notes generated and saved!');
        } catch (error) {
            toast.error('Failed to generate notes');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-10 animate-fade-in">
            {/* Input Section */}
            <div className={`glass-card rounded-3xl p-1 border border-white/40 shadow-xl transition-all duration-500 ${result ? 'scale-95 opacity-80 hover:opacity-100 hover:scale-100' : 'scale-100'}`}>
                <div className="bg-white/50 backdrop-blur-sm rounded-[1.4rem] p-8 sm:p-10">
                    <div className="text-center mb-10">
                        <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-500 mb-3">
                            Generate Study Notes
                        </h2>
                        <p className="text-slate-500 text-lg">Upload your PDF document to get instant summary & notes.</p>
                    </div>

                    <div className="space-y-8 max-w-2xl mx-auto">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-3 ml-1 uppercase tracking-wider text-xs text-center">Upload PDF Document</label>
                            <div className="group relative">
                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={(e) => setFile(e.target.files[0])}
                                    disabled={loading}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
                                />
                                <div className={`flex items-center justify-center p-12 border-2 border-dashed rounded-2xl transition-all duration-300 ${file ? 'border-primary-500 bg-primary-50/50' : 'border-slate-300 bg-slate-50 hover:bg-white group-hover:border-primary-400'}`}>
                                    <div className="text-center">
                                        {file ? (
                                            <div className="flex flex-col items-center text-primary-600">
                                                <div className="p-4 bg-white rounded-full shadow-md mb-4 animate-fade-in">
                                                    <FileText className="w-10 h-10" />
                                                </div>
                                                <span className="font-semibold text-xl mb-1">{file.name}</span>
                                                <span className="text-sm text-primary-400">Click to change file</span>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center text-slate-500 group-hover:text-primary-500 transition-colors">
                                                <div className="p-4 bg-white rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform">
                                                    <Upload className="w-10 h-10" />
                                                </div>
                                                <span className="font-semibold text-xl mb-2">Drop PDF here or Click to Upload</span>
                                                <span className="text-sm text-slate-400">Maximum file size 10MB</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {file && (
                                    <button
                                        onClick={() => setFile(null)}
                                        className="absolute top-4 right-4 z-20 p-2 bg-white rounded-full shadow-sm text-slate-400 hover:text-red-500 transition-colors"
                                        title="Remove file"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={handleGenerate}
                            disabled={loading || !file}
                            className={`w-full flex items-center justify-center py-4 rounded-xl text-lg font-bold shadow-lg transition-all duration-300 transform ${loading || !file
                                ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                                : 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-primary-500/30 hover:shadow-primary-500/50 hover:from-primary-700 hover:to-primary-600 hover:scale-[1.01] active:scale-[0.99]'
                                }`}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                                    Analyzing PDF...
                                </>
                            ) : (
                                <>
                                    <FileText className="w-6 h-6 mr-3" />
                                    Generate & Save Notes
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Results Section */}
            {result && (
                <div className="glass-card rounded-3xl p-1 border border-primary-100 shadow-2xl animate-fade-in ring-4 ring-primary-50/50">
                    <div className="bg-white/70 backdrop-blur-md rounded-[1.4rem] p-8 sm:p-12">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 border-b border-primary-100 pb-6 gap-4">
                            <div>
                                <h3 className="text-2xl font-bold text-slate-800 flex items-center">
                                    <span className="w-2 h-8 bg-primary-500 rounded-full mr-3"></span>
                                    Summary & Key Points
                                </h3>
                                <p className="text-slate-500 ml-5 mt-1">Generated by NoteGenius AI</p>
                            </div>
                            <span className="self-start sm:self-center px-4 py-2 bg-green-50 text-green-700 text-sm font-semibold rounded-full flex items-center border border-green-200/50 shadow-sm">
                                <Save className="w-4 h-4 mr-2" />
                                Saved to History
                            </span>
                        </div>

                        <div className="prose prose-lg prose-indigo max-w-none text-slate-700"> {/* Note: prose-indigo is a specific plugin class, might default or we keep as is if no primary alternative */}
                            <div className="bg-white/50 rounded-2xl p-6 sm:p-8 border border-white/60 shadow-inner">
                                <ReactMarkdown
                                    components={{
                                        h1: ({ node, ...props }) => <h1 className="text-2xl font-bold text-primary-900 mb-4" {...props} />,
                                        h2: ({ node, ...props }) => <h2 className="text-xl font-bold text-primary-800 mt-6 mb-3" {...props} />,
                                        ul: ({ node, ...props }) => <ul className="list-disc pl-5 space-y-2 mb-4 text-slate-700" {...props} />,
                                        li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                                        strong: ({ node, ...props }) => <strong className="font-bold text-slate-900" {...props} />,
                                    }}
                                >
                                    {result.aiOutput}
                                </ReactMarkdown>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
