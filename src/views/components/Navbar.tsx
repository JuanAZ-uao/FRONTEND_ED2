import { Link, NavLink, useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth.service';

const navItems = [
  { to: '/', label: 'Inicio' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/checkout', label: 'Compra' },
  { to: '/profile', label: 'Perfil' },
  { to: '/mobile', label: 'Mobile' },
];

function Navbar() {
  const navigate = useNavigate();
  const session = authService.getSession();

  const handleLogout = () => {
    authService.clearSession();
    navigate('/auth');
  };

  return (
    <header className="nav-wrap">
      <div className="nav-inner">
        <Link to="/" className="brand">
          <span className="brand-dot" />
          CONCERTIX
        </Link>

        <nav className="nav-links">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="nav-actions">
          {session ? (
            <>
              <span className="muted">{session.user.fullName}</span>
              <button type="button" className="ghost-btn" onClick={handleLogout}>
                Salir
              </button>
            </>
          ) : (
            <>
              <Link to="/auth?mode=login" className="ghost-btn">
                Login
              </Link>
              <Link to="/auth?mode=register" className="primary-btn small">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
