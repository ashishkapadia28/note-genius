import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import api from '../api/axios';
import { ChevronDown, ChevronUp, Calendar, Download } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { jsPDF } from 'jspdf';

const History = () => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await api.get('/notes/history');
                setNotes(res.data);
                setError(null);
            } catch (error) {
                console.error('Error fetching history:', error);
                // Don't show critical error on UI for history fetch to avoid breaking entire page flow
                // just log it. Or set empty.
                // setError('Failed to load history.');
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const downloadPDF = async (note) => {
        const doc = new jsPDF('p', 'pt', 'a4');
        const margin = 30;
        const width = 595.28; // A4 width in pt
        const contentWidth = width - (margin * 2);

        // Create a temporary container for rendering the markdown as HTML
        const tempDiv = document.createElement('div');
        tempDiv.style.width = `${contentWidth}pt`;
        tempDiv.style.padding = '20px';
        tempDiv.style.boxSizing = 'border-box';
        tempDiv.style.fontFamily = 'Arial, sans-serif';
        tempDiv.style.fontSize = '12px';
        tempDiv.style.color = '#000000';
        tempDiv.style.backgroundColor = '#ffffff';
        tempDiv.className = 'pdf-content prose prose-sm max-w-none';

        // Ensure it's IN the viewport for html2canvas capture (fix blank pages), but hidden
        tempDiv.style.position = 'fixed';
        tempDiv.style.left = '0';
        tempDiv.style.top = '0';
        tempDiv.style.zIndex = '-9999';
        tempDiv.style.visibility = 'visible'; // Must be visible for html2canvas

        document.body.appendChild(tempDiv);

        const content = (
            <div className="p-4">
                <h1 style={{ fontSize: '24px', marginBottom: '10px', fontWeight: 'bold' }}>Study Notes</h1>
                <p style={{ marginBottom: '20px', color: '#666' }}>Generated on: {new Date(note.createdAt).toLocaleDateString()}</p>
                <div className="whitespace-pre-wrap text-black">
                    <ReactMarkdown>{note.aiOutput}</ReactMarkdown>
                </div>
            </div>
        );

        const root = createRoot(tempDiv);
        root.render(content);

        // Wait for React to render
        await new Promise(resolve => setTimeout(resolve, 1000)); // Slightly longer wait for safety

        try {
            await doc.html(tempDiv, {
                callback: function (pdf) {
                    pdf.save(`Note_${new Date(note.createdAt).toISOString().split('T')[0]}.pdf`);

                    // Cleanup
                    setTimeout(() => {
                        root.unmount();
                        if (document.body.contains(tempDiv)) {
                            document.body.removeChild(tempDiv);
                        }
                    }, 100);
                },
                x: margin,
                y: margin,
                width: contentWidth,
                windowWidth: 800,
                autoPaging: 'text',
                margin: [margin, margin, margin, margin]
            });
        } catch (err) {
            console.error("PDF generation failed:", err);
            root.unmount();
            if (document.body.contains(tempDiv)) {
                document.body.removeChild(tempDiv);
            }
        }
    };

    if (loading) {
        return <div className="text-center py-10">Loading history...</div>;
    }

    if (error) {
        return <div className="text-center py-10 text-red-500">{error}</div>;
    }

    return (
        <div className="max-w-4xl mx-auto py-4 animate-fade-in">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-slate-800">Your Study History</h2>
                <div className="text-sm font-medium text-slate-500 bg-white/60 px-4 py-2 rounded-full border border-white/40 shadow-sm">
                    {notes.length} saved notes
                </div>
            </div>

            {notes.length === 0 ? (
                <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-3xl border border-dashed border-slate-300">
                    <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Calendar className="w-8 h-8 text-slate-400" />
                    </div>
                    <p className="text-lg text-slate-600 font-medium">No notes generated yet.</p>
                    <p className="text-sm text-slate-400 mt-1">Create your first study note in the Dashboard.</p>
                </div>
            ) : (
                <div className="space-y-5">
                    {notes.map((note) => (
                        <div key={note.id} className="glass-card rounded-2xl border border-white/60 hover:border-primary-200 overflow-hidden transition-all duration-300 hover:shadow-lg group">
                            <div
                                className="p-5 sm:p-6 flex items-center justify-between cursor-pointer"
                                onClick={() => toggleExpand(note.id)}
                            >
                                <div className="flex items-center space-x-5">
                                    <div className="bg-primary-50 text-primary-600 p-3.5 rounded-2xl group-hover:bg-primary-100 group-hover:scale-110 transition-all duration-300 shadow-sm border border-primary-100/50">
                                        <Calendar className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-primary-500 uppercase tracking-wider mb-1">
                                            {new Date(note.createdAt).toLocaleDateString()} • {new Date(note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                        <h3 className="font-bold text-slate-800 text-lg truncate max-w-xs sm:max-w-md md:max-w-lg leading-tight group-hover:text-primary-700 transition-colors">
                                            {note.originalText ? (note.originalText.length > 60 ? note.originalText.slice(0, 60) + "..." : note.originalText) : "PDF Document Upload"}
                                        </h3>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            downloadPDF(note);
                                        }}
                                        className="p-2.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all border border-transparent hover:border-primary-100"
                                        title="Download PDF"
                                    >
                                        <Download className="w-5 h-5" />
                                    </button>
                                    <div className={`p-2 rounded-full transition-transform duration-300 ${expandedId === note.id ? 'bg-primary-50 text-primary-600 rotate-180' : 'text-slate-400'}`}>
                                        <ChevronDown className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>

                            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${expandedId === note.id ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className="p-6 sm:p-8 border-t border-slate-100 bg-slate-50/50">
                                    <div className="flex items-center mb-4">
                                        <div className="w-1 h-6 bg-primary-500 rounded-full mr-3"></div>
                                        <h4 className="font-bold text-slate-800 text-lg">Detailed Notes</h4>
                                    </div>
                                    <div className="prose prose-indigo max-w-none text-slate-600 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
                                        <ReactMarkdown>
                                            {note.aiOutput}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default History;
