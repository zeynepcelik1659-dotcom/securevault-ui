import { useAuth } from '../context/AuthContext';

const menuItems = [
  { id: 'dashboard', icon: '📊', label: 'Dashboard' },
  { id: 'users', icon: '👥', label: 'Kullanıcılar' },
  { id: 'documents', icon: '📄', label: 'Dokümanlar' },
  { id: 'logs', icon: '📋', label: 'Güvenlik Logları' },
  { id: 'apidocs', icon: '📡', label: 'API Docs' },
];

export default function Sidebar({ page, setPage, collapsed, setCollapsed }) {
  const { user, logout } = useAuth();

  return (
    <div style={{
      width: collapsed ? '72px' : '260px',
      background: 'rgba(255,255,255,0.02)',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      height: '100vh',
      zIndex: 100,
      transition: 'width 0.3s ease',
      overflow: 'hidden'
    }}>
      {/* Logo */}
      <div style={{
        padding: '24px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        minHeight: '80px'
      }}>
        <div style={{
          width: '36px', height: '36px', minWidth: '36px',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          borderRadius: '10px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '18px',
          boxShadow: '0 4px 12px rgba(99,102,241,0.4)'
        }}>🔐</div>
        {!collapsed && (
          <div style={{ flex: 1 }}>
            <div style={{ color: '#fff', fontWeight: '700', fontSize: '15px' }}>SecureVault</div>
            <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px' }}>Admin Panel</div>
          </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)} style={{
          background: 'none', border: 'none',
          color: 'rgba(255,255,255,0.3)',
          cursor: 'pointer', fontSize: '16px',
          padding: '4px', borderRadius: '6px',
          minWidth: '24px'
        }}>
          {collapsed ? '▶' : '◀'}
        </button>
      </div>

      {/* User Info */}
      {!collapsed && user && (
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', gap: '12px'
        }}>
          <div style={{
            width: '36px', height: '36px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '14px', fontWeight: '700', color: '#fff'
          }}>
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ color: '#fff', fontSize: '13px', fontWeight: '600' }}>{user.name}</div>
            <div style={{
              color: user.role === 'admin' ? '#a78bfa' : 'rgba(255,255,255,0.4)',
              fontSize: '11px', fontWeight: '500'
            }}>
              {user.role === 'admin' ? '👑 Admin' : '👤 User'}
            </div>
          </div>
        </div>
      )}

      {/* Menu */}
      <nav style={{ padding: '12px', flex: 1 }}>
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => setPage(item.id)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: collapsed ? '12px' : '11px 14px',
              borderRadius: '10px',
              border: 'none',
              background: page === item.id
                ? 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(139,92,246,0.25))'
                : 'transparent',
              color: page === item.id ? '#fff' : 'rgba(255,255,255,0.45)',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: page === item.id ? '600' : '400',
              marginBottom: '2px',
              textAlign: 'left',
              borderLeft: page === item.id ? '3px solid #6366f1' : '3px solid transparent',
              transition: 'all 0.2s',
              justifyContent: collapsed ? 'center' : 'flex-start'
            }}
            title={collapsed ? item.label : ''}
          >
            <span style={{ fontSize: '18px', minWidth: '20px', textAlign: 'center' }}>
              {item.icon}
            </span>
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <button
          onClick={logout}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: collapsed ? '12px' : '11px 14px',
            borderRadius: '10px',
            border: 'none',
            background: 'rgba(239,68,68,0.08)',
            color: '#f87171',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            justifyContent: collapsed ? 'center' : 'flex-start',
            transition: 'all 0.2s'
          }}
          title={collapsed ? 'Çıkış Yap' : ''}
        >
          <span style={{ fontSize: '18px', minWidth: '20px', textAlign: 'center' }}>🚪</span>
          {!collapsed && 'Çıkış Yap'}
        </button>
      </div>
    </div>
  );
}