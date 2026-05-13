import { useState, useEffect } from 'react';
import { adminService } from '../services/api';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchUsers = () => {
    setLoading(true);
    adminService.getAllUsers()
      .then(res => setUsers(res.data.users))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await adminService.createUser({ name, email, password, role });
      setSuccess('Kullanıcı başarıyla oluşturuldu!');
      setName(''); setEmail(''); setPassword(''); setRole('user');
      setShowForm(false);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminService.updateUserRole(userId, newRole);
      setSuccess('Rol güncellendi!');
      fetchUsers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Hata oluştu');
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '400px' }}>
      <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '16px' }}>⏳ Yükleniyor...</div>
    </div>
  );

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: '700', marginBottom: '6px' }}>Kullanıcılar</h2>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '14px' }}>Toplam {users.length} kullanıcı</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{
          padding: '10px 20px',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          border: 'none', borderRadius: '10px',
          color: '#fff', fontSize: '14px', fontWeight: '600',
          cursor: 'pointer', boxShadow: '0 4px 12px rgba(99,102,241,0.4)'
        }}>+ Yeni Kullanıcı</button>
      </div>

      {success && (
        <div style={{
          background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)',
          borderRadius: '12px', padding: '14px 16px', color: '#22c55e',
          fontSize: '14px', marginBottom: '20px'
        }}>✅ {success}</div>
      )}

      {error && (
        <div style={{
          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: '12px', padding: '14px 16px', color: '#f87171',
          fontSize: '14px', marginBottom: '20px'
        }}>⚠️ {error}</div>
      )}

      {showForm && (
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(99,102,241,0.3)',
          borderRadius: '16px', padding: '24px', marginBottom: '24px'
        }}>
          <h3 style={{ color: '#fff', fontSize: '16px', fontWeight: '600', marginBottom: '20px' }}>
            Yeni Kullanıcı Oluştur
          </h3>
          <form onSubmit={handleCreate}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', display: 'block', marginBottom: '8px' }}>İSİM</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Ad Soyad" required
                  style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', display: 'block', marginBottom: '8px' }}>EMAIL</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="ornek@email.com" required
                  style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', display: 'block', marginBottom: '8px' }}>ŞİFRE</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required
                  style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', display: 'block', marginBottom: '8px' }}>ROL</label>
                <select value={role} onChange={e => setRole(e.target.value)}
                  style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box', cursor: 'pointer' }}>
                  <option value="user" style={{ background: '#1a1a2e' }}>👤 Kullanıcı</option>
                  <option value="admin" style={{ background: '#1a1a2e' }}>👑 Admin</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="submit" disabled={saving} style={{
                padding: '10px 24px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                border: 'none', borderRadius: '10px', color: '#fff', fontSize: '14px',
                fontWeight: '600', cursor: saving ? 'not-allowed' : 'pointer'
              }}>{saving ? '⏳ Kaydediliyor...' : '💾 Kaydet'}</button>
              <button type="button" onClick={() => setShowForm(false)} style={{
                padding: '10px 24px', background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px',
                color: 'rgba(255,255,255,0.6)', fontSize: '14px', cursor: 'pointer'
              }}>İptal</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
        {users.map(user => (
          <div key={user._id} style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '16px', padding: '20px',
            transition: 'transform 0.2s'
          }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div style={{
                width: '48px', height: '48px', minWidth: '48px',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                borderRadius: '50%', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '18px', fontWeight: '700', color: '#fff'
              }}>
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: '#fff', fontSize: '15px', fontWeight: '600', marginBottom: '4px' }}>{user.name}</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>{user.email}</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => handleRoleChange(user._id, 'user')}
                style={{
                  flex: 1, padding: '8px',
                  background: user.role === 'user' ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${user.role === 'user' ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: '8px', color: user.role === 'user' ? '#818cf8' : 'rgba(255,255,255,0.4)',
                  fontSize: '12px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s'
                }}
              >👤 Kullanıcı</button>
              <button
                onClick={() => handleRoleChange(user._id, 'admin')}
                style={{
                  flex: 1, padding: '8px',
                  background: user.role === 'admin' ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${user.role === 'admin' ? 'rgba(139,92,246,0.5)' : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: '8px', color: user.role === 'admin' ? '#a78bfa' : 'rgba(255,255,255,0.4)',
                  fontSize: '12px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s'
                }}
              >👑 Admin</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}