import { useState, useEffect } from 'react';
import { adminService } from '../services/api';

export default function Users() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getLogs()
      .then(res => {
        const uniqueUsers = [];
        const seen = new Set();
        res.data.logs.forEach(log => {
          if (log.userId && !seen.has(log.userId._id)) {
            seen.add(log.userId._id);
            uniqueUsers.push(log.userId);
          }
        });
        setLogs(uniqueUsers);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '400px' }}>
      <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '16px' }}>⏳ Yükleniyor...</div>
    </div>
  );

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: '700', marginBottom: '6px' }}>
          Kullanıcılar
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '14px' }}>
          Sistemde {logs.length} kullanıcı bulundu
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '16px'
      }}>
        {logs.map(user => (
          <div key={user._id} style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '16px',
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            transition: 'transform 0.2s, box-shadow 0.2s'
          }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(99,102,241,0.15)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{
              width: '48px', height: '48px', minWidth: '48px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '18px', fontWeight: '700', color: '#fff'
            }}>
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: '#fff', fontSize: '15px', fontWeight: '600', marginBottom: '4px' }}>
                {user.name}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginBottom: '8px' }}>
                {user.email}
              </div>
              <span style={{
                background: user.role === 'admin' ? 'rgba(139,92,246,0.15)' : 'rgba(99,102,241,0.15)',
                color: user.role === 'admin' ? '#a78bfa' : '#818cf8',
                padding: '3px 10px',
                borderRadius: '20px',
                fontSize: '11px',
                fontWeight: '600',
                border: `1px solid ${user.role === 'admin' ? 'rgba(139,92,246,0.3)' : 'rgba(99,102,241,0.3)'}`
              }}>
                {user.role === 'admin' ? '👑 Admin' : '👤 User'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}