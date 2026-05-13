import { useState, useEffect } from 'react';
import { adminService } from '../services/api';

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    adminService.getAllDocuments()
      .then(res => setDocuments(res.data.documents))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = documents.filter(doc =>
    doc.title?.toLowerCase().includes(search.toLowerCase()) ||
    doc.ownerId?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const getFileIcon = (fileType) => {
    if (!fileType) return '📄';
    if (fileType.includes('pdf')) return '📕';
    if (fileType.includes('word')) return '📘';
    if (fileType.includes('text')) return '📝';
    if (fileType.includes('image')) return '🖼️';
    return '📄';
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '400px' }}>
      <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '16px' }}>⏳ Yükleniyor...</div>
    </div>
  );

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: '700', marginBottom: '6px' }}>
          Tüm Dokümanlar
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '14px' }}>
          Toplam {documents.length} doküman
        </p>
      </div>

      <input
        placeholder="🔍 Başlık veya kullanıcı ara..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{
          width: '300px', padding: '10px 16px',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '10px', color: '#fff',
          fontSize: '14px', outline: 'none',
          marginBottom: '24px', boxSizing: 'border-box'
        }}
      />

      {filtered.length === 0 ? (
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '16px', padding: '60px', textAlign: 'center'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '16px' }}>Henüz doküman yok</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '16px'
        }}>
          {filtered.map(doc => (
            <div key={doc._id} style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '16px', padding: '20px',
              transition: 'transform 0.2s'
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{
                  width: '40px', height: '40px',
                  background: 'rgba(99,102,241,0.15)',
                  borderRadius: '10px', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontSize: '20px'
                }}>{getFileIcon(doc.fileType)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#fff', fontSize: '15px', fontWeight: '600' }}>{doc.title}</div>
                  <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px' }}>
                    {new Date(doc.createdAt).toLocaleDateString('tr-TR')}
                  </div>
                </div>
                {doc.isSensitive && (
                  <span style={{
                    background: 'rgba(239,68,68,0.15)', color: '#ef4444',
                    padding: '3px 8px', borderRadius: '20px',
                    fontSize: '10px', fontWeight: '600'
                  }}>🔒 Gizli</span>
                )}
              </div>

              {doc.content && (
                <p style={{
                  color: 'rgba(255,255,255,0.4)', fontSize: '13px',
                  lineHeight: '1.5', marginBottom: '12px',
                  overflow: 'hidden', display: '-webkit-box',
                  WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'
                }}>{doc.content}</p>
              )}

              {doc.fileName && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '8px 12px', background: 'rgba(99,102,241,0.1)',
                  borderRadius: '8px', marginBottom: '12px'
                }}>
                  <span style={{ fontSize: '16px' }}>{getFileIcon(doc.fileType)}</span>
                  <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>{doc.fileName}</span>
                </div>
              )}

              {doc.fileUrl && (
                <a href={doc.fileUrl} target="_blank" rel="noreferrer" style={{
                  display: 'inline-block', padding: '6px 14px',
                  background: 'rgba(99,102,241,0.1)',
                  border: '1px solid rgba(99,102,241,0.2)',
                  borderRadius: '8px', color: '#818cf8',
                  fontSize: '12px', textDecoration: 'none',
                  marginBottom: '12px'
                }}>
                  📥 Dosyayı Aç
                </a>
              )}

              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '8px 12px', background: 'rgba(255,255,255,0.03)',
                borderRadius: '8px'
              }}>
                <div style={{
                  width: '24px', height: '24px',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  borderRadius: '50%', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', fontWeight: '700', color: '#fff'
                }}>
                  {doc.ownerId?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>{doc.ownerId?.name}</div>
                  <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px' }}>{doc.ownerId?.email}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}