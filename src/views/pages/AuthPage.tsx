import { Link } from 'react-router-dom';
import { useAuthController } from '../../controllers/useAuthController';
import { COLOMBIA_LOCATIONS } from '../../data/colombiaLocations';

const GENDERS = ['Masculino', 'Femenino', 'No binario', 'Prefiero no decir', 'Otro'];

function StepDot({ n, current }: { n: number; current: number }) {
  const done = current > n;
  const active = current === n;
  return (
    <div style={{
      width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '0.78rem', fontWeight: 700,
      background: done || active ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.08)',
      border: !done && !active ? '2px solid var(--line)' : 'none',
      color: done || active ? '#000' : 'var(--text-muted)',
    }}>
      {done ? '✓' : n}
    </div>
  );
}

function AuthPage() {
  const {
    mode, step, step1, step2,
    loading, feedback,
    onChangeStep1, onChangeStep2,
    toggleMode, advanceToStep2, backToStep1, submit,
  } = useAuthController();

  const availableCities =
    COLOMBIA_LOCATIONS.find((item) => item.department === step2.department)?.cities ?? [];

  return (
    <div className="auth-wrap">
      <section className="auth-card">

        {/* ── LEFT VISUAL PANEL ── */}
        <aside className="auth-panel auth-visual">
          {mode === 'register' && step === 2 ? (
            <>
              <span className="overline">Un paso más</span>
              <div style={{
                marginTop: 18, width: 84, height: 84, borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(24,228,255,0.25), rgba(255,92,122,0.25))',
                border: '1px solid var(--line)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '2rem', color: 'var(--accent-cyan)',
              }}>
                ♪
              </div>
              <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '2rem', lineHeight: 1.1, marginTop: 16 }}>
                Un paso más para{' '}
                <span style={{ color: 'var(--accent-cyan)' }}>tu próximo concierto.</span>
              </h2>
              <p className="muted" style={{ marginTop: 10, fontSize: '0.83rem' }}>
                Accede a miles de conciertos, compra al instante y vive la mejor experiencia musical.
              </p>
              <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                {[['50K+', 'Eventos'], ['2M+', 'Usuarios'], ['98%', 'Satisfacción']].map(([v, l]) => (
                  <div key={l} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: '10px 6px', textAlign: 'center' }}>
                    <div style={{ fontFamily: 'Bebas Neue', fontSize: '1.45rem', color: 'var(--accent-cyan)' }}>{v}</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{l}</div>
                  </div>
                ))}
              </div>
              <ul style={{ marginTop: 16, listStyle: 'none', padding: 0, display: 'grid', gap: 7 }}>
                {['Conciertos en vivo', '200+ venues Colombia', 'Entradas digitales', 'Compra en segundos'].map((i) => (
                  <li key={i} style={{ fontSize: '0.81rem', color: 'var(--text-muted)', display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ color: 'var(--accent-cyan)', fontSize: '0.9rem' }}>✓</span>{i}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <>
              <span className="overline">CONCERTIX ACCESS</span>
              <h1 className="hero-title" style={{ marginTop: 14 }}>
                Vive conciertos<br />sin friccion
              </h1>
              <p className="muted" style={{ marginTop: 16 }}>
                Ingresa para gestionar reservas, revisar tus ordenes y acceder a preventas exclusivas.
              </p>
              <div style={{ marginTop: 24 }}>
                <Link to="/" className="ghost-btn" style={{ display: 'inline-block' }}>← Volver al inicio</Link>
              </div>
            </>
          )}
        </aside>

        {/* ── RIGHT FORM PANEL ── */}
        <section className="auth-panel">

          {mode === 'register' ? (
            <>
              {/* Step progress bar */}
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 22 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <StepDot n={1} current={step} />
                  <span style={{ fontSize: '0.73rem', color: step === 1 ? 'var(--text-main)' : 'var(--text-muted)' }}>Datos de cuenta</span>
                </div>
                <div style={{ flex: 1, height: 2, background: step > 1 ? 'var(--accent-cyan)' : 'var(--line)', margin: '0 10px', borderRadius: 2 }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <StepDot n={2} current={step} />
                  <span style={{ fontSize: '0.73rem', color: step === 2 ? 'var(--text-main)' : 'var(--text-muted)' }}>Datos personales</span>
                </div>
              </div>

              {step === 1 ? (
                <>
                  <h2 className="section-title">Registro</h2>
                  <p className="muted" style={{ marginTop: 6, marginBottom: 16 }}>Crea una cuenta para comprar y gestionar tus tickets.</p>
                  <form className="form-grid" onSubmit={(e) => { e.preventDefault(); advanceToStep2(); }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <label>
                        Nombre
                        <input value={step1.firstName} onChange={(e) => onChangeStep1('firstName', e.target.value)} autoComplete="given-name" />
                      </label>
                      <label>
                        Apellido
                        <input value={step1.lastName} onChange={(e) => onChangeStep1('lastName', e.target.value)} autoComplete="family-name" />
                      </label>
                    </div>
                    <label>
                      Correo
                      <input type="email" value={step1.email} onChange={(e) => onChangeStep1('email', e.target.value)} placeholder="correo@ejemplo.com" autoComplete="email" />
                    </label>
                    <label>
                      Contraseña
                      <input type="password" value={step1.password} onChange={(e) => onChangeStep1('password', e.target.value)} placeholder="••••••••" autoComplete="new-password" />
                    </label>
                    <button type="submit" className="primary-btn">Siguiente paso →</button>
                  </form>
                </>
              ) : (
                <>
                  <h2 className="section-title">Datos personales</h2>
                  <p className="muted" style={{ marginTop: 6, marginBottom: 16 }}>Paso 2 de 2 · Completa tu perfil</p>
                  <form className="form-grid" onSubmit={(e) => { e.preventDefault(); void submit(); }}>
                    <label>
                      Teléfono
                      <input value={step2.phone} onChange={(e) => onChangeStep2('phone', e.target.value)} placeholder="+57 300 000 0000" type="tel" />
                    </label>
                    <label>
                      Departamento
                      <select value={step2.department} onChange={(e) => onChangeStep2('department', e.target.value)}>
                        <option value="">Seleccionar departamento...</option>
                        {COLOMBIA_LOCATIONS.map((item) => (
                          <option key={item.department} value={item.department}>{item.department}</option>
                        ))}
                      </select>
                    </label>
                    <label>
                      Ciudad
                      <select value={step2.city} onChange={(e) => onChangeStep2('city', e.target.value)} disabled={!step2.department}>
                        <option value="">
                          {step2.department ? 'Seleccionar ciudad...' : 'Primero selecciona departamento'}
                        </option>
                        {availableCities.map((city) => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                    </label>
                    <label>
                      Fecha de nacimiento
                      <input type="date" value={step2.birthDate} onChange={(e) => onChangeStep2('birthDate', e.target.value)} />
                    </label>
                    <label>
                      Género
                      <select value={step2.gender} onChange={(e) => onChangeStep2('gender', e.target.value)}>
                        <option value="">Seleccionar...</option>
                        {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </label>
                    <button type="submit" className="primary-btn" disabled={loading}>
                      {loading ? 'Creando cuenta...' : 'Crear mi cuenta'}
                    </button>
                  </form>
                  <div style={{ marginTop: 14, textAlign: 'center' }}>
                    <button type="button" onClick={backToStep1}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-cyan)', fontSize: '0.84rem' }}>
                      ← Volver al paso anterior
                    </button>
                  </div>
                  <div style={{ marginTop: 10, textAlign: 'center' }}>
                    <span style={{
                      display: 'inline-block', fontSize: '0.73rem', borderRadius: 999,
                      padding: '5px 12px', border: '1px solid rgba(23,198,127,0.4)',
                      background: 'rgba(23,198,127,0.1)', color: '#b4f9d6',
                    }}>
                      Conexión segura SSL
                    </span>
                  </div>
                </>
              )}

              <div style={{ marginTop: 16, textAlign: 'center' }}>
                <button type="button" className="ghost-btn" onClick={toggleMode} style={{ fontSize: '0.8rem' }}>
                  ¿Ya tienes cuenta? Inicia sesión
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className="section-title">Login</h2>
              <p className="muted" style={{ marginTop: 6, marginBottom: 16 }}>Ingresa con tu cuenta de Concertix.</p>
              <form className="form-grid" onSubmit={(e) => { e.preventDefault(); void submit(); }}>
                <label>
                  Correo
                  <input type="email" value={step1.email} onChange={(e) => onChangeStep1('email', e.target.value)} placeholder="correo@ejemplo.com" autoComplete="email" />
                </label>
                <label>
                  Password
                  <input type="password" value={step1.password} onChange={(e) => onChangeStep1('password', e.target.value)} placeholder="••••••••" autoComplete="current-password" />
                </label>
                <button type="submit" className="primary-btn" disabled={loading}>
                  {loading ? 'Procesando...' : 'Entrar'}
                </button>
              </form>
              <div style={{ marginTop: 14, display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                <button type="button" className="ghost-btn" onClick={toggleMode}>Ir a registro</button>
                <Link to="/forgot-password" className="ghost-link">Olvide mi password</Link>
              </div>
            </>
          )}

          {feedback && (
            <p className={`feedback-alert ${feedback.toLowerCase().includes('bienvenido') || feedback.toLowerCase().includes('creada') ? 'success' : 'error'}`} style={{ marginTop: 14 }}>
              {feedback}
            </p>
          )}
        </section>
      </section>
    </div>
  );
}

export default AuthPage;
