import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Logs from './pages/Logs';
import Users from './pages/Users';
import Documents from './pages/Documents';
import MyDocuments from './pages/MyDocuments';
import Profile from './pages/Profile';
import ApiDocs from './pages/ApiDocs';
import Sidebar from './components/Sidebar';

function AppContent() {
  const { user, loading } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [page, setPage] = useState(
    user?.role === 'admin' ? 'dashboard' : 'mydocuments'
  );
  const [showForgotPassword, setShowForgotPassword] = useState(false);

 const isResetPassword = window.location.pathname === '/reset-password' || window.location.search.includes('token=');

  if (loading) return (
    <div style={{
      minHeight: '100vh', background: '#0a0a1a',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '16px' }}>⏳ Yükleniyor...</div>
    </div>
  );

  if (isResetPassword) {
    return <ResetPassword onSuccess={() => window.location.href = '/'} />;
  }

  if (!user) {
    if (showForgotPassword) {
      return <ForgotPassword onBack={() => setShowForgotPassword(false)} />;
    }
    return <Login onForgotPassword={() => setShowForgotPassword(true)} />;
  }

  const renderPage = () => {
    switch (page) {
      case 'dashboard': return <Dashboard />;
      case 'logs': return <Logs />;
      case 'users': return <Users />;
      case 'documents': return <Documents />;
      case 'mydocuments': return <MyDocuments />;
      case 'profile': return <Profile />;
      case 'apidocs': return <ApiDocs />;
      default: return user.role === 'admin' ? <Dashboard /> : <MyDocuments />;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a1a' }}>
      <Sidebar
        page={page}
        setPage={setPage}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />
      <div style={{
        marginLeft: collapsed ? '72px' : '260px',
        flex: 1, padding: '32px',
        transition: 'margin-left 0.3s ease',
        minHeight: '100vh'
      }}>
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '28px', paddingBottom: '20px',
          borderBottom: '1px solid rgba(255,255,255,0.06)'
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'rgba(34,197,94,0.1)',
            border: '1px solid rgba(34,197,94,0.2)',
            borderRadius: '20px', padding: '6px 14px'
          }}>
            <div style={{
              width: '6px', height: '6px', borderRadius: '50%',
              background: '#22c55e', animation: 'pulse 2s infinite'
            }} />
            <span style={{ color: '#22c55e', fontSize: '12px', fontWeight: '600' }}>
              API Çevrimiçi
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px', height: '32px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              borderRadius: '50%', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: '13px', fontWeight: '700', color: '#fff'
            }}>
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ color: '#fff', fontSize: '13px', fontWeight: '600' }}>{user.name}</div>
              <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px' }}>
                {user.role === 'admin' ? '👑 Admin' : '👤 Kullanıcı'}
              </div>
            </div>
          </div>
        </div>
        {renderPage()}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}