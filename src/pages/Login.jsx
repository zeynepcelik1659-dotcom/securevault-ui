import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
    } catch (err) {
      setError(err.response?.data?.message || 'Giriş başarısız');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 50%, #0a1a2e 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute', top: '20%', left: '15%',
        width: '300px', height: '300px',
        background: 'rgba(99,102,241,0.15)',
        borderRadius: '50%', filter: 'blur(80px)'
      }} />
      <div style={{
        position: 'absolute', bottom: '20%', right: '15%',
        width: '250px', height: '250px',
        background: 'rgba(139,92,246,0.15)',
        borderRadius: '50%', filter: 'blur(80px)'
      }} />

      <div className="fade-in" style={{
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '24px',
        padding: '48px 40px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 32px 64px rgba(0,0,0,0.4)',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{
            width: '72px', height: '72px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            borderRadius: '20px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '32px', margin: '0 auto 16px',
            boxShadow: '0 8px 32px rgba(99,102,241,0.4)'
          }}>🔐</div>
          <h1 style={{ color: '#fff', fontSize: '26px', fontWeight: '700', marginBottom: '6px' }}>
            SecureVault
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>
            JWT Tabanlı API Güvenlik Sistemi
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: '12px',
            padding: '14px 16px',
            color: '#f87171',
            fontSize: '14px',
            marginBottom: '24px',
            textAlign: 'center'
          }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              color: 'rgba(255,255,255,0.6)',
              fontSize: '13px',
              fontWeight: '500',
              display: 'block',
              marginBottom: '8px',
              letterSpacing: '0.3px'
            }}>
              EMAIL ADRESİ
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@test.com"
              required
              style={{
                width: '100%',
                padding: '14px 16px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '15px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '28px' }}>
            <label style={{
              color: 'rgba(255,255,255,0.6)',
              fontSize: '13px',
              fontWeight: '500',
              display: 'block',
              marginBottom: '8px',
              letterSpacing: '0.3px'
            }}>
              ŞİFRE
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: '100%',
                padding: '14px 16px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '15px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '15px',
              background: loading
                ? 'rgba(99,102,241,0.4)'
                : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              border: 'none',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 8px 24px rgba(99,102,241,0.4)',
              transition: 'all 0.3s'
            }}
          >
            {loading ? '⏳ Giriş yapılıyor...' : '🔓 Giriş Yap'}
          </button>
        </form>

        <div style={{
          marginTop: '24px',
          padding: '16px',
          background: 'rgba(99,102,241,0.08)',
          borderRadius: '12px',
          border: '1px solid rgba(99,102,241,0.15)'
        }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', textAlign: 'center', marginBottom: '8px' }}>
            Test Hesabı
          </p>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', textAlign: 'center' }}>
            admin@test.com / Admin1234!
          </p>
        </div>
      </div>
    </div>
  );
}