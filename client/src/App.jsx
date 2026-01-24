import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import { useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <div className="min-h-screen bg-slate-50 relative selection:bg-primary-500 selection:text-white">
      {/* Background Decor */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-100/40 via-slate-50 to-slate-50"></div>
      <div className="fixed top-0 left-0 right-0 h-96 bg-gradient-to-b from-primary-50/40 to-transparent -z-10 pointer-events-none"></div>

      <Navbar />
      <div className="container mx-auto px-4 py-8 relative z-10">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={<Dashboard />}
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
      <Toaster
        position="top-center"
        toastOptions={{
          className: '!bg-white/90 !backdrop-blur-md !shadow-lg !border !border-slate-100 !text-slate-800 !font-medium',
          duration: 4000,
        }}
      />
    </div>
  );
}

export default App;
