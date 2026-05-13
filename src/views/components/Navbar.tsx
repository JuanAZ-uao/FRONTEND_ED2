import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import { notificationService, type AppNotification } from '../../services/notification.service';

const navItems = [
  { to: '/', label: 'Inicio' },
  { to: '/tickets', label: 'Mis Boletas' },
  { to: '/checkout', label: 'Compra' },
];

const TYPE_ICON: Record<string, string> = {
  PURCHASE: '✓',
  DISCOUNT: '%',
  REMINDER: '!',
  SECURITY: '⚠',
  INFO: 'i',
};

const TYPE_COLOR: Record<string, string> = {
  PURCHASE: 'var(--accent-cyan)',
  DISCOUNT: 'var(--accent-gold)',
  REMINDER: 'var(--accent-gold)',
  SECURITY: 'var(--accent-coral)',
  INFO: 'var(--text-muted)',
};

function timeAgo(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'Ahora';
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

function ProfileIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function Navbar() {
  const navigate = useNavigate();
  const session = authService.getSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notifRef = useRef<HTMLDivElement>(null);

  const fullName = session ? authService.getUserFullName(session.user) : '';

  // Fetch notifications on mount and every 60s
  useEffect(() => {
    if (!session) return;
    const load = () => {
      notificationService.getAll()
        .then(({ notifications: n, unreadCount: c }) => { setNotifications(n); setUnreadCount(c); })
        .catch(() => {});
    };
    load();
    const interval = setInterval(load, 60000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    authService.clearSession();
    setMenuOpen(false);
    setNotifOpen(false);
    navigate('/auth');
  };

  const openNotif = (n: AppNotification) => {
    if (!n.read) {
      notificationService.markRead(n.id).catch(() => {});
      setNotifications((prev) => prev.map((x) => x.id === n.id ? { ...x, read: true } : x));
      setUnreadCount((c) => Math.max(0, c - 1));
    }
    setNotifOpen(false);
    if (n.link) navigate(n.link);
  };

  const markAll = () => {
    notificationService.markAllRead().catch(() => {});
    setNotifications((prev) => prev.map((x) => ({ ...x, read: true })));
    setUnreadCount(0);
  };

  return (
    <header className="nav-wrap">
      <div className="nav-inner">
        <Link to="/" className="brand" onClick={() => setMenuOpen(false)}>
          <span className="brand-dot" />
          CONCERTIX
        </Link>

        <nav className="nav-links">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="nav-actions">
          {session ? (
            <>
              <span className="muted nav-username">{fullName}</span>

              {/* Bell */}
              <div ref={notifRef} style={{ position: 'relative' }}>
                <button type="button" className="nav-icon-btn"
                  onClick={() => setNotifOpen((v) => !v)} aria-label="Notificaciones">
                  <BellIcon />
                  {unreadCount > 0 && (
                    <span className="notif-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
                  )}
                </button>

                {notifOpen && (
                  <div className="notif-dropdown">
                    <div className="notif-header">
                      <span style={{ fontFamily: 'Bebas Neue', fontSize: '1.1rem', letterSpacing: '0.04em' }}>Notificaciones</span>
                      {unreadCount > 0 && (
                        <button type="button" onClick={markAll}
                          style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', cursor: 'pointer', fontSize: '0.76rem' }}>
                          Marcar todo leído
                        </button>
                      )}
                    </div>

                    <div className="notif-list">
                      {notifications.length === 0 ? (
                        <div className="notif-empty">Sin notificaciones</div>
                      ) : (
                        notifications.map((n) => (
                          <div key={n.id} className={`notif-item${n.read ? '' : ' unread'}`}
                            onClick={() => openNotif(n)}>
                            <div style={{
                              width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              background: `${TYPE_COLOR[n.type] ?? 'var(--text-muted)'}22`,
                              color: TYPE_COLOR[n.type] ?? 'var(--text-muted)',
                              fontSize: '0.78rem', fontWeight: 700,
                            }}>
                              {TYPE_ICON[n.type] ?? 'i'}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: '0.84rem', fontWeight: n.read ? 400 : 600, lineHeight: 1.3 }}>{n.title}</div>
                              <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: 2, lineHeight: 1.4 }}>{n.message}</div>
                            </div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', flexShrink: 0, alignSelf: 'flex-start', paddingTop: 2 }}>
                              {timeAgo(n.createdAt)}
                            </div>
                            {!n.read && <div className="notif-unread-dot" />}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              <Link to="/profile" className="nav-icon-btn" title="Mi perfil">
                <ProfileIcon />
              </Link>
              <button type="button" className="ghost-btn" onClick={handleLogout}>Salir</button>
            </>
          ) : (
            <>
              <Link to="/auth?mode=login" className="ghost-btn">Login</Link>
              <Link to="/auth?mode=register" className="primary-btn small">Registro</Link>
            </>
          )}

          <button type="button" className="nav-icon-btn mobile-menu-btn"
            onClick={() => setMenuOpen((v) => !v)} aria-label="Menu">
            <MenuIcon />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="mobile-nav-dropdown">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'}
              className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}>
              {item.label}
            </NavLink>
          ))}
          {session ? (
            <>
              <Link to="/profile" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>Mi Perfil</Link>
              <button type="button" className="mobile-nav-link" onClick={handleLogout}>Cerrar sesion</button>
            </>
          ) : (
            <>
              <Link to="/auth?mode=login" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/auth?mode=register" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>Registro</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}

export default Navbar;
