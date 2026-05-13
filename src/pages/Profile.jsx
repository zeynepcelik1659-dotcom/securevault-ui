import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/api';

export default function Profile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('info');
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await userService.updateProfile({ name, email });
      setSuccess('Profil başarıyla güncellendi!');
    } catch (err) {
      setError(err.response?.data?.message || 'Hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (newPassword !== confirmPassword) {
      setError('Yeni şifreler eşleşmiyor');
      return;
    }
    if (newPassword.length < 6) {
      setError('Yeni şifre en az 6 karakter olmalı');
      return;
    }
    setLoading(true);
    try {
      await userService.updatePassword({ currentPassword, newPassword });
      setSuccess('Şifre başarıyla güncellendi!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '12px 16px',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px', color: '#fff',
    fontSize: '14px', outline: 'none',
    boxSizing: 'border-box'
  };

  const labelStyle = {
    color: 'rgba(255,255,255,0.6)',
    fontSize: '13px', fontWeight: '500',
    display: 'block', marginBottom: '8px'
  };

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: '700', marginBottom: '6px' }}>
          Profilim
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '14px' }}>
          Hesap bilgilerinizi güncelleyin
        </p>
      </div>

      <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
        {/* Sol - Profil Kartı */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '16px', padding: '24px',
          width: '220px', minWidth: '220px', textAlign: 'center'
        }}>
          <div style={{
            width: '80px', height: '80px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            borderRadius: '50%', margin: '0 auto 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '32px', fontWeight: '700', color: '#fff',
            boxShadow: '0 8px 24px rgba(99,102,241,0.4)'
          }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div style={{ color: '#fff', fontSize: '16px', fontWeight: '700', marginBottom: '4px' }}>
            {user?.name}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginBottom: '12px' }}>
            {user?.email}
          </div>
          <span style={{
            background: user?.role === 'admin' ? 'rgba(139,92,246,0.2)' : 'rgba(99,102,241,0.2)',
            color: user?.role === 'admin' ? '#a78bfa' : '#818cf8',
            padding: '4px 12px', borderRadius: '20px',
            fontSize: '12px', fontWeight: '600'
          }}>
            {user?.role === 'admin' ? '👑 Admin' : '👤 Kullanıcı'}
          </span>
        </div>

        {/* Sağ - Formlar */}
        <div style={{ flex: 1 }}>
          {/* Tab */}
          <div style={{
            display: 'flex', background: 'rgba(255,255,255,0.05)',
            borderRadius: '12px', padding: '4px', marginBottom: '24px'
          }}>
            {[
              { id: 'info', label: '✏️ Bilgileri Güncelle' },
              { id: 'password', label: '🔑 Şifre Değiştir' }
            ].map(t => (
              <button key={t.id} onClick={() => { setActiveTab(t.id); setError(''); setSuccess(''); }}
                style={{
                  flex: 1, padding: '10px',
                  borderRadius: '10px', border: 'none',
                  background: activeTab === t.id
                    ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                    : 'transparent',
                  color: activeTab === t.id ? '#fff' : 'rgba(255,255,255,0.4)',
                  fontSize: '14px', fontWeight: '600',
                  cursor: 'pointer', transition: 'all 0.2s'
                }}
              >{t.label}</button>
            ))}
          </div>

          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: '10px', padding: '12px', color: '#f87171',
              fontSize: '14px', marginBottom: '16px'
            }}>⚠️ {error}</div>
          )}

          {success && (
            <div style={{
              background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)',
              borderRadius: '10px', padding: '12px', color: '#22c55e',
              fontSize: '14px', marginBottom: '16px'
            }}>✅ {success}</div>
          )}

          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '16px', padding: '24px'
          }}>
            {activeTab === 'info' ? (
              <form onSubmit={handleUpdateProfile}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>İSİM</label>
                  <input value={name} onChange={e => setName(e.target.value)}
                    placeholder="Ad Soyad" required style={inputStyle} />
                </div>
                <div style={{ marginBottom: '24px' }}>
                  <label style={labelStyle}>EMAIL</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="ornek@email.com" required style={inputStyle} />
                </div>
                <button type="submit" disabled={loading} style={{
                  padding: '12px 28px',
                  background: loading ? 'rgba(99,102,241,0.4)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  border: 'none', borderRadius: '10px', color: '#fff',
                  fontSize: '14px', fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: loading ? 'none' : '0 4px 12px rgba(99,102,241,0.4)'
                }}>
                  {loading ? '⏳ Güncelleniyor...' : '💾 Güncelle'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleUpdatePassword}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>MEVCUT ŞİFRE</label>
                  <input type="password" value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    placeholder="••••••••" required style={inputStyle} />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>YENİ ŞİFRE</label>
                  <input type="password" value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="••••••••" required style={inputStyle} />
                </div>
                <div style={{ marginBottom: '24px' }}>
                  <label style={labelStyle}>YENİ ŞİFRE TEKRAR</label>
                  <input type="password" value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="••••••••" required style={inputStyle} />
                </div>
                <button type="submit" disabled={loading} style={{
                  padding: '12px 28px',
                  background: loading ? 'rgba(99,102,241,0.4)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  border: 'none', borderRadius: '10px', color: '#fff',
                  fontSize: '14px', fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: loading ? 'none' : '0 4px 12px rgba(99,102,241,0.4)'
                }}>
                  {loading ? '⏳ Güncelleniyor...' : '🔑 Şifreyi Değiştir'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}