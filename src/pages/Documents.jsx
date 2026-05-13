import { useState, useEffect } from 'react';
import { documentService } from '../services/api';

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    documentService.getMyDocuments()
      .then(res => setDocuments(res.data.documents))
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
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: '700', marginBottom: '6px' }}>
            Dokümanlar
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '14px' }}>
            Toplam {documents.length} doküman
          </p>
        </div>
      </div>

      {documents.length === 0 ? (
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '16px',
          padding: '60px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '16px', marginBottom: '8px' }}>
            Henüz doküman yok
          </p>
          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '13px' }}>
            API üzerinden doküman ekleyebilirsiniz
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '16px'
        }}>
          {documents.map(doc => (
            <div key={doc._id} style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '16px',
              padding: '20px',
              transition: 'transform 0.2s'
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{
                  width: '40px', height: '40px',
                  background: 'rgba(99,102,241,0.15)',
                  borderRadius: '10px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '20px'
                }}>📄</div>
                <div>
                  <div style={{ color: '#fff', fontSize: '15px', fontWeight: '600' }}>{doc.title}</div>
                  <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px' }}>
                    {new Date(doc.createdAt).toLocaleDateString('tr-TR')}
                  </div>
                </div>
                {doc.isSensitive && (
                  <span style={{
                    marginLeft: 'auto',
                    background: 'rgba(239,68,68,0.15)',
                    color: '#ef4444',
                    padding: '3px 8px',
                    borderRadius: '20px',
                    fontSize: '10px',
                    fontWeight: '600'
                  }}>🔒 Gizli</span>
                )}
              </div>
              <p style={{
                color: 'rgba(255,255,255,0.4)',
                fontSize: '13px',
                lineHeight: '1.5',
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical'
              }}>
                {doc.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 