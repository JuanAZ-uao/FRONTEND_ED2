import { Link } from 'react-router-dom';
import { useAuthController } from '../../controllers/useAuthController';

function AuthPage() {
  const { mode, form, loading, feedback, onChange, toggleMode, submit } = useAuthController();

  return (
    <div className="auth-wrap">
      <section className="auth-card">
        <aside className="auth-panel auth-visual">
          <span className="overline">CONCERTIX ACCESS</span>
          <h1 className="hero-title" style={{ marginTop: 14 }}>
            Vive conciertos
            <br />
            sin friccion
          </h1>
          <p className="muted" style={{ marginTop: 16 }}>
            Ingresa para gestionar reservas, revisar tus ordenes y acceder a preventas exclusivas.
          </p>
          <div style={{ marginTop: 24 }}>
            <Link to="/" className="ghost-btn" style={{ display: 'inline-block' }}>
              ← Volver al inicio
            </Link>
          </div>
        </aside>

        <section className="auth-panel">
          <h2 className="section-title">{mode === 'login' ? 'Login' : 'Registro'}</h2>
          <p className="muted" style={{ marginTop: 6, marginBottom: 16 }}>
            {mode === 'login'
              ? 'Ingresa con tu cuenta de Concertix.'
              : 'Crea una cuenta para comprar y gestionar tus tickets.'}
          </p>

          <form
            className="form-grid"
            onSubmit={(event) => {
              event.preventDefault();
              void submit();
            }}
          >
            {mode === 'register' && (
              <label>
                Nombre completo
                <input
                  value={form.fullName}
                  onChange={(event) => onChange('fullName', event.target.value)}
                  placeholder="Tu nombre"
                />
              </label>
            )}

            <label>
              Correo
              <input
                type="email"
                value={form.email}
                onChange={(event) => onChange('email', event.target.value)}
                placeholder="correo@ejemplo.com"
              />
            </label>

            <label>
              Password
              <input
                type="password"
                value={form.password}
                onChange={(event) => onChange('password', event.target.value)}
                placeholder="••••••••"
              />
            </label>

            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? 'Procesando...' : mode === 'login' ? 'Entrar' : 'Crear cuenta'}
            </button>
          </form>

          <div style={{ marginTop: 14, display: 'flex', justifyContent: 'space-between', gap: 10 }}>
            <button type="button" className="ghost-btn" onClick={toggleMode}>
              {mode === 'login' ? 'Ir a registro' : 'Ir a login'}
            </button>
            <Link to="/forgot-password" className="ghost-link">
              Olvide mi password
            </Link>
          </div>

          {feedback && (
            <p className="muted" style={{ marginTop: 14 }}>
              {feedback}
            </p>
          )}
        </section>
      </section>
    </div>
  );
}

export default AuthPage;
