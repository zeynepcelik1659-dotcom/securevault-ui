import { useState } from 'react';
import { authService } from '../services/api';

export default function ResetPassword({ onSuccess }) {
  const token = new URLSearchParams(window.location.search).get('token');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (newPassword !== confirmPassword) {
      setError('Şifreler eşleşmiyor');
      return;
    }
    if (newPassword.length < 6) {
      setError('Şifre en az 6 karakter olmalı');
      return;
    }
    setLoading(true);
    try {
      await authService.resetPassword(token, newPassword);
      setSuccess('Şifreniz başarıyla sıfırlandı!');
      setTimeout(() => onSuccess(), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div style={{
        minHeight: '100vh', background: '#0a0a1a',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <div style={{ color: '#f87171', fontSize: '18px' }}>⚠️ Geçersiz sıfırlama linki</div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 50%, #0a1a2e 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute', top: '20%', left: '15%',
        width: '300px', height: '300px',
        background: 'rgba(99,102,241,0.15)',
        borderRadius: '50%', filter: 'blur(80px)'
      }} />

      <div className="fade-in" style={{
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '24px', padding: '48px 40px',
        width: '100%', maxWidth: '420px',
        boxShadow: '0 32px 64px rgba(0,0,0,0.4)',
        position: 'relative', zIndex: 1
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '72px', height: '72px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            borderRadius: '20px', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: '32px', margin: '0 auto 16px',
            boxShadow: '0 8px 32px rgba(99,102,241,0.4)'
          }}>🔐</div>
          <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: '700', marginBottom: '6px' }}>
            Yeni Şifre Belirle
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>
            Yeni şifrenizi girin
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: '12px', padding: '14px 16px', color: '#f87171',
            fontSize: '14px', marginBottom: '20px', textAlign: 'center'
          }}>⚠️ {error}</div>
        )}

        {success && (
          <div style={{
            background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)',
            borderRadius: '12px', padding: '14px 16px', color: '#22c55e',
            fontSize: '14px', marginBottom: '20px', textAlign: 'center'
          }}>✅ {success}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              color: 'rgba(255,255,255,0.6)', fontSize: '13px',
              fontWeight: '500', display: 'block', marginBottom: '8px'
            }}>YENİ ŞİFRE</label>
            <input
              type="password" value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              placeholder="••••••••" required
              style={{
                width: '100%', padding: '14px 16px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px', color: '#fff',
                fontSize: '15px', outline: 'none', boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '28px' }}>
            <label style={{
              color: 'rgba(255,255,255,0.6)', fontSize: '13px',
              fontWeight: '500', display: 'block', marginBottom: '8px'
            }}>YENİ ŞİFRE TEKRAR</label>
            <input
              type="password" value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="••••••••" required
              style={{
                width: '100%', padding: '14px 16px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px', color: '#fff',
                fontSize: '15px', outline: 'none', boxSizing: 'border-box'
              }}
            />
          </div>

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '15px',
            background: loading ? 'rgba(99,102,241,0.4)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            border: 'none', borderRadius: '12px', color: '#fff',
            fontSize: '16px', fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: loading ? 'none' : '0 8px 24px rgba(99,102,241,0.4)'
          }}>
            {loading ? '⏳ Sıfırlanıyor...' : '🔐 Şifremi Sıfırla'}
          </button>
        </form>
      </div>
    </div>
  );
}