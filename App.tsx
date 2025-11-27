import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import PublicDashboard from './pages/PublicDashboard';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import Navbar from './components/Navbar';
import { supabase } from './lib/supabaseClient'; // PERBAIKAN: Menggunakan ./ bukan ../
import { Session } from '@supabase/supabase-js';

const App = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);

  useEffect(() => {
    // 1. Cek sesi saat ini
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };

    getSession();

    // 2. Dengarkan perubahan auth
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsRecoveryMode(true);
      }
      
      setSession(session);
      setLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsRecoveryMode(false);
  };

  const handlePasswordUpdated = () => {
    setIsRecoveryMode(false);
  };

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <div className="text-slate-500 font-medium">Memuat Aplikasi...</div>
        </div>
    );
  }

  if (isRecoveryMode) {
    return <ResetPasswordPage onSuccess={handlePasswordUpdated} />;
  }

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <main className="flex-1 relative">
          <Routes>
            <Route path="/" element={<PublicDashboard />} />
            <Route 
              path="/admin" 
              element={
                session ? (
                  <AdminDashboard onLogout={handleLogout} />
                ) : (
                  <LoginPage />
                )
              } 
            />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;
