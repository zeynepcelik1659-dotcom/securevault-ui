import { useState, useEffect } from 'react';
import { documentService } from '../services/api';

export default function MyDocuments() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSensitive, setIsSensitive] = useState(false);
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchDocuments = () => {
    setLoading(true);
    documentService.getMyDocuments()
      .then(res => setDocuments(res.data.documents))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchDocuments(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('isSensitive', isSensitive);
      if (file) formData.append('file', file);

      await documentService.createDocument(formData);
      setTitle(''); setContent(''); setIsSensitive(false); setFile(null);
      setShowForm(false);
      fetchDocuments();
    } catch (err) {
      setError(err.response?.data?.message || 'Hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Dokümanı silmek istediğinize emin misiniz?')) return;
    try {
      await documentService.deleteDocument(id);
      fetchDocuments();
    } catch (err) {
      console.error(err);
    }
  };

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
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: '700', marginBottom: '6px' }}>Dokümanlarım</h2>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '14px' }}>Toplam {documents.length} doküman</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{
          padding: '10px 20px',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          border: 'none', borderRadius: '10px',
          color: '#fff', fontSize: '14px', fontWeight: '600',
          cursor: 'pointer', boxShadow: '0 4px 12px rgba(99,102,241,0.4)'
        }}>+ Yeni Doküman</button>
      </div>

      {showForm && (
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(99,102,241,0.3)',
          borderRadius: '16px', padding: '24px', marginBottom: '24px'
        }}>
          <h3 style={{ color: '#fff', fontSize: '16px', fontWeight: '600', marginBottom: '20px' }}>
            Yeni Doküman Oluştur
          </h3>

          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: '10px', padding: '12px', color: '#f87171',
              fontSize: '14px', marginBottom: '16px'
            }}>⚠️ {error}</div>
          )}

          <form onSubmit={handleCreate}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', display: 'block', marginBottom: '8px' }}>
                BAŞLIK *
              </label>
              <input value={title} onChange={e => setTitle(e.target.value)}
                placeholder="Doküman başlığı" required
                style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', display: 'block', marginBottom: '8px' }}>
                İÇERİK
              </label>
              <textarea value={content} onChange={e => setContent(e.target.value)}
                placeholder="Doküman içeriği..." rows={3}
                style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box', resize: 'vertical', fontFamily: 'Segoe UI, sans-serif' }} />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', display: 'block', marginBottom: '8px' }}>
                DOSYA EKLE (PDF, Word, TXT, Resim - max 5MB)
              </label>
              <div style={{
                border: '2px dashed rgba(99,102,241,0.3)',
                borderRadius: '10px', padding: '20px',
                textAlign: 'center', cursor: 'pointer',
                background: file ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.03)',
                transition: 'all 0.2s'
              }}
                onClick={() => document.getElementById('fileInput').click()}
              >
                {file ? (
                  <div>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>✅</div>
                    <div style={{ color: '#fff', fontSize: '14px', fontWeight: '600' }}>{file.name}</div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>📁</div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>
                      Dosya seçmek için tıklayın
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', marginTop: '4px' }}>
                      PDF, Word, TXT, JPG, PNG
                    </div>
                  </div>
                )}
                <input
                  id="fileInput"
                  type="file"
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                  onChange={e => setFile(e.target.files[0])}
                  style={{ display: 'none' }}
                />
              </div>
              {file && (
                <button type="button" onClick={() => setFile(null)}
                  style={{ marginTop: '8px', padding: '4px 12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '6px', color: '#f87171', fontSize: '12px', cursor: 'pointer' }}>
                  ✕ Dosyayı Kaldır
                </button>
              )}
            </div>

            <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input type="checkbox" id="sensitive" checked={isSensitive}
                onChange={e => setIsSensitive(e.target.checked)}
                style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
              <label htmlFor="sensitive" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', cursor: 'pointer' }}>
                🔒 Gizli doküman
              </label>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="submit" disabled={saving} style={{
                padding: '10px 24px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                border: 'none', borderRadius: '10px', color: '#fff',
                fontSize: '14px', fontWeight: '600', cursor: saving ? 'not-allowed' : 'pointer'
              }}>{saving ? '⏳ Kaydediliyor...' : '💾 Kaydet'}</button>
              <button type="button" onClick={() => { setShowForm(false); setFile(null); }} style={{
                padding: '10px 24px', background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px',
                color: 'rgba(255,255,255,0.6)', fontSize: '14px', cursor: 'pointer'
              }}>İptal</button>
            </div>
          </form>
        </div>
      )}

      {documents.length === 0 ? (
        <div style={{
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '16px', padding: '60px', textAlign: 'center'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '16px', marginBottom: '8px' }}>Henüz doküman yok</p>
          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '13px' }}>Yeni doküman eklemek için butona tıklayın</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
          {documents.map(doc => (
            <div key={doc._id} style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '16px', padding: '20px', transition: 'transform 0.2s'
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{
                  width: '40px', height: '40px', background: 'rgba(99,102,241,0.15)',
                  borderRadius: '10px', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '20px'
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
                    padding: '3px 8px', borderRadius: '20px', fontSize: '10px', fontWeight: '600'
                  }}>🔒 Gizli</span>
                )}
              </div>

              {doc.content && (
                <p style={{
                  color: 'rgba(255,255,255,0.4)', fontSize: '13px', lineHeight: '1.5',
                  marginBottom: '12px', overflow: 'hidden', display: '-webkit-box',
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

              <div style={{ display: 'flex', gap: '8px' }}>
                {doc.fileUrl && (
                  <a href={doc.fileUrl} target="_blank" rel="noreferrer" style={{
                    display: 'inline-block', padding: '6px 14px',
                    background: 'rgba(99,102,241,0.1)',
                    border: '1px solid rgba(99,102,241,0.2)',
                    borderRadius: '8px', color: '#818cf8',
                    fontSize: '12px', textDecoration: 'none'
                  }}>
                    📥 Dosyayı Aç
                  </a>
                )}
                <button onClick={() => handleDelete(doc._id)} style={{
                  padding: '6px 14px', background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px',
                  color: '#f87171', fontSize: '12px', cursor: 'pointer'
                }}>🗑️ Sil</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}