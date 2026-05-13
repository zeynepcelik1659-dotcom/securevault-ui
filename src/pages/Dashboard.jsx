import { useState, useEffect } from 'react';
import { adminService } from '../services/api';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const StatCard = ({ title, value, icon, color, desc }) => (
  <div className="fade-in" style={{
    background: 'rgba(255,255,255,0.03)',
    border: `1px solid ${color}22`,
    borderRadius: '16px',
    padding: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'default'
  }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = `0 12px 32px ${color}22`;
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'none';
    }}
  >
    <div style={{
      width: '52px', height: '52px', minWidth: '52px',
      borderRadius: '14px',
      background: `${color}18`,
      border: `1px solid ${color}33`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '24px'
    }}>
      {icon}
    </div>
    <div>
      <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '12px', margin: '0 0 4px', fontWeight: '500', letterSpacing: '0.3px' }}>
        {title}
      </p>
      <p style={{ color: '#fff', fontSize: '28px', fontWeight: '700', margin: '0 0 2px' }}>
        {value}
      </p>
      {desc && <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', margin: 0 }}>{desc}</p>}
    </div>
  </div>
);

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getDashboard()
      .then(res => setMetrics(res.data.metrics))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '400px' }}>
      <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '16px' }}>⏳ Yükleniyor...</div>
    </div>
  );

  const pieData = [
    { name: 'Başarılı', value: metrics?.totalLogs - metrics?.failedLogins || 0 },
    { name: 'Başarısız', value: metrics?.failedLogins || 0 },
  ];

  const COLORS = ['#6366f1', '#ef4444'];

  const areaData = [
    { name: 'Kullanıcılar', value: metrics?.totalUsers || 0 },
    { name: 'Dokümanlar', value: metrics?.totalDocuments || 0 },
    { name: 'Loglar', value: metrics?.totalLogs || 0 },
    { name: 'Başarısız', value: metrics?.failedLogins || 0 },
    { name: 'Engellenen', value: metrics?.adminAccessDenied || 0 },
  ];

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: '700', marginBottom: '6px' }}>
          Dashboard
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '14px' }}>
          API güvenlik metrikleri ve istatistikler
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        marginBottom: '28px'
      }}>
        <StatCard title="TOPLAM KULLANICI" value={metrics?.totalUsers ?? 0} icon="👥" color="#6366f1" desc="Kayıtlı kullanıcı" />
        <StatCard title="TOPLAM DOKÜMAN" value={metrics?.totalDocuments ?? 0} icon="📄" color="#8b5cf6" desc="Sistemdeki doküman" />
        <StatCard title="TOPLAM LOG" value={metrics?.totalLogs ?? 0} icon="📋" color="#06b6d4" desc="Güvenlik kaydı" />
        <StatCard title="BAŞARISIZ GİRİŞ" value={metrics?.failedLogins ?? 0} icon="🚫" color="#ef4444" desc="Başarısız deneme" />
        <StatCard title="REDDEDİLEN TOKEN" value={metrics?.rejectedTokens ?? 0} icon="🔒" color="#f59e0b" desc="Geçersiz token" />
        <StatCard title="ADMİN ENGELİ" value={metrics?.adminAccessDenied ?? 0} icon="⛔" color="#ec4899" desc="Yetkisiz erişim" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '16px',
          padding: '24px'
        }}>
          <h3 style={{ color: '#fff', fontSize: '15px', fontWeight: '600', marginBottom: '20px' }}>
            📈 Sistem Metrikleri
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={areaData}>
              <defs>
                <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={11} />
              <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} />
              <Tooltip
                contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
              />
              <Area type="monotone" dataKey="value" stroke="#6366f1" fill="url(#colorVal)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '16px',
          padding: '24px'
        }}>
          <h3 style={{ color: '#fff', fontSize: '15px', fontWeight: '600', marginBottom: '20px' }}>
            🔐 Güvenlik Dağılımı
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#6366f1' }} />
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>Başarılı</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>Başarısız</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}