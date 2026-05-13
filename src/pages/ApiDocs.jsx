const endpoints = [
  { method: 'POST', path: '/api/auth/register', desc: 'Kullanici kaydi' },
  { method: 'POST', path: '/api/auth/login', desc: 'Giris yap' },
  { method: 'POST', path: '/api/auth/refresh', desc: 'Token yenile' },
  { method: 'POST', path: '/api/auth/logout', desc: 'Cikis yap' },
  { method: 'GET', path: '/api/users/me', desc: 'Kullanici bilgisi' },
  { method: 'GET', path: '/api/documents/my', desc: 'Dokumanlarin' },
  { method: 'GET', path: '/api/admin/dashboard', desc: 'Admin dashboard' },
  { method: 'GET', path: '/api/admin/logs', desc: 'Guvenlik loglari' },
  { method: 'GET', path: '/api/health', desc: 'Sistem durumu' },
];

const getMethodStyle = (method) => {
  if (method === 'POST') {
    return { bg: 'rgba(99,102,241,0.2)', color: '#818cf8' };
  }
  return { bg: 'rgba(34,197,94,0.2)', color: '#22c55e' };
};

export default function ApiDocs() {
  return (
    <div className="fade-in">
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: '700', marginBottom: '6px' }}>
          API Dokumantasyonu
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '14px' }}>
          Tum endpointleri Swagger UI uzerinden test edebilirsiniz
        </p>
      </div>

      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '16px',
        padding: '40px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>📡</div>
        <h3 style={{ color: '#fff', fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>
          Swagger UI
        </h3>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginBottom: '28px' }}>
          API dokumantasyonunu yeni sekmede acmak icin tiklayin.
        </p>
        
          <a href="https://securevault-api-o0tw.onrender.com/api/docs"
          target="_blank"
          rel="noreferrer"
          style={{
            display: 'inline-block',
            padding: '14px 32px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            borderRadius: '12px',
            color: '#fff',
            fontSize: '15px',
            fontWeight: '600',
            textDecoration: 'none',
            boxShadow: '0 8px 24px rgba(99,102,241,0.4)'
          }}
        >
          Swagger UI Ac
        </a>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginTop: '40px'
        }}>
          {endpoints.map((ep, i) => {
            const style = getMethodStyle(ep.method);
            return (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '12px',
                padding: '16px',
                textAlign: 'left'
              }}>
                <span style={{
                  background: style.bg,
                  color: style.color,
                  padding: '2px 8px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: '700',
                  display: 'inline-block',
                  marginBottom: '8px'
                }}>{ep.method}</span>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', marginBottom: '4px', fontFamily: 'monospace' }}>
                  {ep.path}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>
                  {ep.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}