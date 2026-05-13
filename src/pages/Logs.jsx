import { useState, useEffect } from 'react';
import { adminService } from '../services/api';

const actionColors = {
  LOGIN_SUCCESS: '#22c55e',
  LOGIN_FAILED: '#ef4444',
  REGISTER: '#6366f1',
  LOGOUT: '#f59e0b',
  TOKEN_REJECTED: '#ef4444',
  TOKEN_REFRESHED: '#06b6d4',
  ADMIN_ACCESS_DENIED: '#ec4899',
  ADMIN_ACCESS_GRANTED: '#22c55e',
  DOCUMENT_ACCESSED: '#8b5cf6',
};

const actionLabels = {
  LOGIN_SUCCESS: 'Başarılı Giriş',
  LOGIN_FAILED: 'Başarısız Giriş',
  REGISTER: 'Kayıt',
  LOGOUT: 'Çıkış',
  TOKEN_REJECTED: 'Token Reddedildi',
  TOKEN_REFRESHED: 'Token Yenilendi',
  ADMIN_ACCESS_DENIED: 'Admin Engeli',
  ADMIN_ACCESS_GRANTED: 'Admin Erişimi',
  DOCUMENT_ACCESSED: 'Doküman Erişimi',
};

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  useEffect(() => {
    adminService.getLogs()
      .then(res => setLogs(res.data.logs))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filters = ['ALL', 'LOGIN_SUCCESS', 'LOGIN_FAILED', 'REGISTER', 'ADMIN_ACCESS_DENIED', 'TOKEN_REJECTED'];

  const filteredLogs = logs
    .filter(l => filter === 'ALL' || l.action === filter)
    .filter(l => search === '' ||
      l.userId?.email?.includes(search) ||
      l.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      l.endpoint?.includes(search)
    );

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '400px' }}>
      <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '16px' }}>⏳ Yükleniyor...</div>
    </div>
  );

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: '700', marginBottom: '6px' }}>
          Güvenlik Logları
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '14px' }}>
          Toplam {logs.length} kayıt · Filtrelenen {filteredLogs.length} kayıt
        </p>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          placeholder="🔍 Kullanıcı veya endpoint ara..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            padding: '10px 16px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '10px',
            color: '#fff',
            fontSize: '14px',
            outline: 'none',
            width: '280px'
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '7px 14px',
              borderRadius: '20px',
              border: 'none',
              background: filter === f
                ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                : 'rgba(255,255,255,0.06)',
              color: '#fff',
              fontSize: '12px',
              cursor: 'pointer',
              fontWeight: filter === f ? '600' : '400',
              transition: 'all 0.2s'
            }}
          >
            {f === 'ALL' ? 'Tümü' : actionLabels[f]}
          </button>
        ))}
      </div>

      <div style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '16px',
        overflow: 'hidden'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.04)' }}>
              {['Kullanıcı', 'İşlem', 'Durum', 'IP Adresi', 'Endpoint', 'Tarih'].map(h => (
                <th key={h} style={{
                  padding: '14px 16px',
                  color: 'rgba(255,255,255,0.4)',
                  fontSize: '11px',
                  fontWeight: '600',
                  textAlign: 'left',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log, i) => (
              <tr key={log._id} style={{
                borderTop: '1px solid rgba(255,255,255,0.04)',
                background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                transition: 'background 0.2s'
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.05)'}
                onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)'}
              >
                <td style={{ padding: '12px 16px' }}>
                  {log.userId ? (
                    <div>
                      <div style={{ color: '#fff', fontSize: '13px', fontWeight: '500' }}>{log.userId.name}</div>
                      <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px' }}>{log.userId.email}</div>
                    </div>
                  ) : <span style={{ color: 'rgba(255,255,255,0.2)' }}>—</span>}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    background: `${actionColors[log.action]}18`,
                    color: actionColors[log.action],
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: '600',
                    border: `1px solid ${actionColors[log.action]}33`
                  }}>
                    {actionLabels[log.action] || log.action}
                  </span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    background: log.status === 'SUCCESS' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                    color: log.status === 'SUCCESS' ? '#22c55e' : '#ef4444',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: '600',
                    border: `1px solid ${log.status === 'SUCCESS' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`
                  }}>
                    {log.status === 'SUCCESS' ? '✓ Başarılı' : '✗ Başarısız'}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>
                  {log.ipAddress || '—'}
                </td>
                <td style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>
                  {log.endpoint || '—'}
                </td>
                <td style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.3)', fontSize: '11px' }}>
                  {new Date(log.createdAt).toLocaleString('tr-TR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}