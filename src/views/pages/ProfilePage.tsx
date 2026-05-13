import { Link } from 'react-router-dom';
import { useProfileController, type ProfileSection } from '../../controllers/useProfileController';
import { CONCERT_GENRES, type Genre, formatConcertDate } from '../../models/event.model';
import { preferencesService } from '../../services/preferences.service';
import { useState, useEffect } from 'react';
import type { PaymentMethod, NotifPrefs, UserTicket } from '../../services/user.service';

const GENDERS = ['Masculino', 'Femenino', 'No binario', 'Prefiero no decir', 'Otro'];
const BRAND_GRADIENT: Record<string, string> = {
  VISA: 'linear-gradient(135deg,#6b21e8,#3b82f6)',
  MASTERCARD: 'linear-gradient(135deg,#ea4c2a,#f97316)',
  AMEX: 'linear-gradient(135deg,#0f766e,#0ea5e9)',
};

const STATUS_LABEL: Record<string, string> = { SOLD: 'Válida', RESERVED: 'Reservada', USED: 'Usada', CANCELLED: 'Cancelada', AVAILABLE: 'Disponible' };
const STATUS_CLASS: Record<string, string> = { SOLD: 'sold', RESERVED: 'reserved', USED: 'used', CANCELLED: 'cancelled', AVAILABLE: 'available' };

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button className={`toggle-switch${on ? ' on' : ''}`} onClick={onToggle} type="button" aria-checked={on} />
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="panel-card" style={{ marginBottom: 16 }}>
      <h3 style={{ fontSize: '1.1rem', fontFamily: 'Sora', fontWeight: 600, marginBottom: 16, letterSpacing: 0 }}>{title}</h3>
      {children}
    </div>
  );
}

function NotifRow({ label, on, onToggle }: { label: string; on: boolean; onToggle: () => void }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--line)' }}>
      <span style={{ fontSize: '0.88rem' }}>{label}</span>
      <Toggle on={on} onToggle={onToggle} />
    </div>
  );
}

// ── PERFIL SECTION ───────────────────────────────────────────────────────────
function PerfilSection({ ctrl, session }: { ctrl: ReturnType<typeof useProfileController>; session: NonNullable<ReturnType<typeof useProfileController>['session']> }) {
  const { form, saving, feedback, feedbackType, onChange, save, loading, loadError } = ctrl;
  const [preferredGenres, setPreferredGenres] = useState<Genre[]>([]);

  useEffect(() => {
    setPreferredGenres(preferencesService.getPreferencesByUser(session.user.email));
  }, [session]);

  const toggleGenre = (genre: Genre) => {
    const next = preferredGenres.includes(genre)
      ? preferredGenres.filter((g) => g !== genre)
      : [...preferredGenres, genre];
    preferencesService.savePreferencesByUser(session.user.email, next);
    setPreferredGenres(next);
  };

  if (loading) return <div className="panel-card"><p className="muted">Cargando...</p></div>;

  if (loadError || !form) {
    return (
      <div className="panel-card">
        <p style={{ color: 'var(--accent-coral)', marginBottom: 12 }}>{loadError || 'Error'}</p>
        <button className="ghost-btn" onClick={() => window.location.reload()}>Reintentar</button>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <SectionCard title="Datos Personales">
        <form className="form-grid" onSubmit={(e) => { e.preventDefault(); void save(); }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <label>Nombre<input value={form.firstName} onChange={(e) => onChange('firstName', e.target.value)} /></label>
            <label>Apellido<input value={form.lastName} onChange={(e) => onChange('lastName', e.target.value)} /></label>
          </div>
          <label>Teléfono<input value={form.phone} onChange={(e) => onChange('phone', e.target.value)} type="tel" placeholder="3001234567" /></label>
          <label>Fecha de nacimiento<input type="date" value={form.birthDate} onChange={(e) => onChange('birthDate', e.target.value)} /></label>
          <label>
            Género
            <select value={form.gender} onChange={(e) => onChange('gender', e.target.value)}>
              <option value="">Seleccionar...</option>
              {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </label>
          <label>Ciudad<input value={form.city} onChange={(e) => onChange('city', e.target.value)} placeholder="Bogotá" /></label>
          <label>Documento<input value={form.document} onChange={(e) => onChange('document', e.target.value)} /></label>
          <label>Bio<input value={form.bio} onChange={(e) => onChange('bio', e.target.value)} placeholder="Cuéntanos algo de ti..." /></label>
          <label>
            URL de avatar
            <input value={form.avatarUrl} onChange={(e) => onChange('avatarUrl', e.target.value)} placeholder="https://..." type="url" />
          </label>
          {form.avatarUrl && (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <img src={form.avatarUrl} alt="Avatar" style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-cyan)' }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            </div>
          )}
          <button type="submit" className="primary-btn" disabled={saving}>{saving ? 'Guardando...' : 'Guardar cambios'}</button>
        </form>
        {feedback && <p className={`feedback-alert ${feedbackType}`} style={{ marginTop: 10 }}>{feedback}</p>}
      </SectionCard>

      <SectionCard title="Géneros Favoritos">
        <p className="muted" style={{ marginBottom: 14, fontSize: '0.84rem' }}>Personaliza tu inicio según tus gustos.</p>
        <div className="chip-row">
          {CONCERT_GENRES.map((g) => (
            <button key={g} type="button" className={`chip ${preferredGenres.includes(g) ? 'active' : ''}`} onClick={() => toggleGenre(g)}>{g}</button>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

// ── ENTRADAS SECTION ─────────────────────────────────────────────────────────
function EntradasSection({ ctrl }: { ctrl: ReturnType<typeof useProfileController> }) {
  const { tickets, ticketsLoading, qrTicket, setQrTicket, ticketTab, setTicketTab, session } = ctrl;

  const qrData = qrTicket
    ? `${window.location.origin}/verify/${qrTicket.ticketCode}`
    : '';

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', gap: 0, borderBottom: '1px solid var(--line)' }}>
        {(['all', 'upcoming', 'past'] as const).map((tab) => {
          const labels = { all: 'Todas', upcoming: 'Próximas', past: 'Pasadas' };
          return (
            <button key={tab} type="button" onClick={() => setTicketTab(tab)}
              style={{
                padding: '10px 18px', border: 'none', background: 'transparent', cursor: 'pointer',
                fontSize: '0.88rem', fontFamily: 'Sora',
                color: ticketTab === tab ? 'var(--accent-cyan)' : 'var(--text-muted)',
                borderBottom: ticketTab === tab ? '2px solid var(--accent-cyan)' : '2px solid transparent',
                marginBottom: -1,
              }}
            >{labels[tab]}</button>
          );
        })}
      </div>

      {ticketsLoading && <p className="muted">Cargando entradas...</p>}

      {!ticketsLoading && tickets.length === 0 && (
        <div className="panel-card" style={{ textAlign: 'center', padding: 32 }}>
          <p className="muted">No tienes entradas en esta sección.</p>
          <Link to="/" className="primary-btn" style={{ display: 'inline-block', marginTop: 14 }}>Ver conciertos</Link>
        </div>
      )}

      <div style={{ display: 'grid', gap: 10 }}>
        {tickets.map((t) => {
          const c = t.ticketType.concert;
          const isUpcoming = new Date(c.date) >= new Date() && t.status !== 'CANCELLED';
          return (
            <div key={t.id} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              border: '1px solid var(--line)', borderRadius: 14,
              background: 'rgba(255,255,255,0.02)', padding: '14px 16px',
              transition: 'border-color 200ms',
            }}>
              <div style={{ width: 4, height: 52, borderRadius: 4, background: isUpcoming ? 'var(--accent-cyan)' : 'var(--text-muted)', flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'Bebas Neue', fontSize: '1.15rem', letterSpacing: '0.04em' }}>{c.artist.name}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>
                  {c.venue.city} · {formatConcertDate(c.date)}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: 1 }}>
                  {c.venue.name} · <span style={{ fontFamily: 'monospace' }}>{t.ticketCode}</span>
                </div>
              </div>
              <span className={`ticket-status ${STATUS_CLASS[t.status] ?? 'used'}`}>
                {STATUS_LABEL[t.status] ?? t.status}
              </span>
              <button type="button" className="ghost-btn" style={{ fontSize: '0.78rem', whiteSpace: 'nowrap', padding: '7px 12px' }}
                onClick={() => setQrTicket(t)}>
                Ver QR
              </button>
            </div>
          );
        })}
      </div>

      {session && <p className="muted" style={{ fontSize: '0.75rem', marginTop: 16, textAlign: 'center' }}>Historial completo disponible en la app</p>}

      {/* QR Modal */}
      {qrTicket && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 999, padding: 20,
        }} onClick={() => setQrTicket(null)}>
          <div style={{
            background: 'var(--bg-soft)', border: '1px solid var(--line)',
            borderRadius: 24, padding: 28, maxWidth: 320, width: '100%',
            textAlign: 'center',
          }} onClick={(e) => e.stopPropagation()}>
            <p className="overline" style={{ marginBottom: 8 }}>Código QR</p>
            <p style={{ fontFamily: 'Bebas Neue', fontSize: '1.4rem' }}>{qrTicket.ticketType.concert.artist.name}</p>
            <p className="muted" style={{ fontSize: '0.8rem', marginBottom: 14 }}>{qrTicket.ticketType.concert.tourName}</p>
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}&bgcolor=0a0a14&color=18e4ff&qzone=2`}
              alt="QR" style={{ width: 200, height: 200, borderRadius: 12 }}
            />
            <p style={{ fontFamily: 'monospace', fontSize: '0.8rem', marginTop: 10, color: 'var(--text-muted)' }}>{qrTicket.ticketCode}</p>
            <button type="button" className="ghost-btn" style={{ marginTop: 14, width: '100%' }} onClick={() => setQrTicket(null)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── PAGOS SECTION ─────────────────────────────────────────────────────────────
function PagosSection({ ctrl }: { ctrl: ReturnType<typeof useProfileController> }) {
  const { paymentMethods, pmLoading, showAddCard, setShowAddCard, newCard, onCardField, addCard, removeCard, pmFeedback, pmFeedbackType, profile } = ctrl;
  const holderName = profile ? `${profile.firstName} ${profile.lastName}` : '—';

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <SectionCard title="Tarjetas guardadas">
        {pmLoading && <p className="muted">Cargando...</p>}
        {!pmLoading && paymentMethods.length === 0 && (
          <p className="muted" style={{ fontSize: '0.86rem' }}>No tienes tarjetas guardadas.</p>
        )}
        <div className="payment-cards-wrap">
          {paymentMethods.map((m) => (
            <div key={m.id} className="payment-card-visual" style={{ background: BRAND_GRADIENT[m.brand] ?? BRAND_GRADIENT.VISA }}>
              {m.isPrimary && (
                <span className="pm-badge-primary">Principal</span>
              )}
              <button type="button" className="pm-delete-btn" onClick={() => void removeCard(m.id)}>Eliminar</button>
              <div style={{ letterSpacing: '0.2em', fontSize: '1.05rem', marginTop: 36 }}>
                •••• •••• •••• {m.lastFour}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', opacity: 0.7, marginBottom: 2 }}>TITULAR</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>{holderName}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.72rem', opacity: 0.7, marginBottom: 2 }}>VENCE</div>
                  <div style={{ fontSize: '0.88rem' }}>
                    {String(m.expiryMonth).padStart(2, '0')}/{String(m.expiryYear).slice(-2)}
                  </div>
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.06em', opacity: 0.85 }}>{m.brand}</div>
              </div>
            </div>
          ))}
        </div>

        {!showAddCard ? (
          <button type="button" className="primary-btn" style={{ marginTop: 16, width: '100%' }} onClick={() => setShowAddCard(true)}>
            + Agregar nuevo método de pago
          </button>
        ) : (
          <div style={{ marginTop: 16, border: '1px solid var(--line)', borderRadius: 14, padding: 16 }}>
            <h4 style={{ fontFamily: 'Sora', fontWeight: 600, fontSize: '0.9rem', marginBottom: 12 }}>Nueva tarjeta</h4>
            <div className="form-grid">
              <label>
                Número de tarjeta
                <input
                  value={newCard.number} placeholder="1234 5678 9012 3456"
                  onChange={(e) => onCardField('number', e.target.value.replace(/\D/g, '').slice(0, 16))}
                />
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                <label>
                  Mes
                  <input value={newCard.expiryMonth} placeholder="MM" maxLength={2}
                    onChange={(e) => onCardField('expiryMonth', e.target.value.replace(/\D/g, ''))} />
                </label>
                <label>
                  Año
                  <input value={newCard.expiryYear} placeholder="AAAA" maxLength={4}
                    onChange={(e) => onCardField('expiryYear', e.target.value.replace(/\D/g, ''))} />
                </label>
                <label>
                  Marca
                  <select value={newCard.brand} onChange={(e) => onCardField('brand', e.target.value)}>
                    {['VISA', 'MASTERCARD', 'AMEX'].map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </label>
              </div>
              <label style={{ flexDirection: 'row', alignItems: 'center', gap: 10, display: 'flex', textTransform: 'none', letterSpacing: 0 }}>
                <input type="checkbox" checked={newCard.isPrimary} onChange={(e) => onCardField('isPrimary', e.target.checked)}
                  style={{ width: 'auto' }} />
                Establecer como principal
              </label>
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="button" className="primary-btn" style={{ flex: 1 }} onClick={() => void addCard()}>Guardar</button>
                <button type="button" className="ghost-btn" onClick={() => setShowAddCard(false)}>Cancelar</button>
              </div>
            </div>
          </div>
        )}

        {pmFeedback && (
          <p className={`feedback-alert ${pmFeedbackType}`} style={{ marginTop: 10 }}>{pmFeedback}</p>
        )}

        <div style={{ marginTop: 14 }}>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Tu información está protegida con cifrado SSL de 256 bits</span>
        </div>
      </SectionCard>
    </div>
  );
}

// ── SEGURIDAD SECTION ─────────────────────────────────────────────────────────
function SeguridadSection({ ctrl }: { ctrl: ReturnType<typeof useProfileController> }) {
  const { pwForm, pwSaving, pwFeedback, pwFeedbackType, onPwField, changePassword } = ctrl;

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <SectionCard title="Cambiar contraseña">
        <div className="form-grid">
          <label>
            Contraseña actual
            <input type="password" value={pwForm.current} onChange={(e) => onPwField('current', e.target.value)} placeholder="••••••••••••" />
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <label>
              Nueva contraseña
              <input type="password" value={pwForm.newPw} onChange={(e) => onPwField('newPw', e.target.value)} placeholder="Nueva contraseña" />
            </label>
            <label>
              Confirmar nueva
              <input type="password" value={pwForm.confirm} onChange={(e) => onPwField('confirm', e.target.value)} placeholder="Repite la contraseña" />
            </label>
          </div>
          <button type="button" className="primary-btn" style={{ width: 'fit-content' }} disabled={pwSaving} onClick={() => void changePassword()}>
            {pwSaving ? 'Actualizando...' : 'Actualizar'}
          </button>
        </div>
        {pwFeedback && <p className={`feedback-alert ${pwFeedbackType}`} style={{ marginTop: 10 }}>{pwFeedback}</p>}
      </SectionCard>

      <SectionCard title="Autenticación en 2 pasos">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: '0.88rem', marginBottom: 4 }}>Agrega una capa extra de seguridad</p>
            <p className="muted" style={{ fontSize: '0.78rem' }}>Próximamente disponible</p>
          </div>
          <button className="toggle-switch" type="button" disabled style={{ opacity: 0.4, cursor: 'not-allowed' }} />
        </div>
      </SectionCard>

      <SectionCard title="Sesiones activas">
        {[
          { browser: 'Chrome', os: 'Windows 11', city: 'Bogotá, Colombia', current: true },
        ].map((s, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--line)' }}>
            <div>
              <p style={{ fontSize: '0.88rem', fontWeight: 500 }}>{s.browser} · {s.os}</p>
              <p className="muted" style={{ fontSize: '0.76rem', marginTop: 2 }}>{s.city}</p>
            </div>
            {s.current
              ? <span style={{ background: 'rgba(23,198,127,0.15)', border: '1px solid rgba(23,198,127,0.4)', color: '#b4f9d6', borderRadius: 999, padding: '4px 10px', fontSize: '0.74rem' }}>Actual</span>
              : <button type="button" className="ghost-btn" style={{ fontSize: '0.78rem', padding: '6px 12px', borderColor: 'rgba(255,92,122,0.4)', color: 'var(--accent-coral)' }}>Cerrar</button>
            }
          </div>
        ))}
      </SectionCard>

      <div style={{ border: '1px solid rgba(255,92,122,0.35)', borderRadius: 14, padding: 18, background: 'rgba(255,92,122,0.06)' }}>
        <h3 style={{ fontFamily: 'Sora', fontWeight: 600, fontSize: '0.95rem', color: 'var(--accent-coral)', marginBottom: 6 }}>Zona de peligro</h3>
        <p className="muted" style={{ fontSize: '0.82rem', marginBottom: 14 }}>Eliminar cuenta — esta acción no se puede deshacer</p>
        <button type="button" style={{
          padding: '9px 18px', borderRadius: 999, border: '1px solid var(--accent-coral)',
          background: 'rgba(255,92,122,0.15)', color: 'var(--accent-coral)', cursor: 'pointer', fontSize: '0.84rem',
        }}>
          Eliminar cuenta
        </button>
      </div>
    </div>
  );
}

// ── NOTIFICACIONES SECTION ────────────────────────────────────────────────────
function NotificacionesSection({ ctrl }: { ctrl: ReturnType<typeof useProfileController> }) {
  const { notifPrefs, notifLoading, notifSaving, notifFeedback, toggleNotif, saveNotifs } = ctrl;

  if (notifLoading || !notifPrefs) return <div className="panel-card"><p className="muted">{notifLoading ? 'Cargando...' : 'Sin datos'}</p></div>;

  const emailRows: { label: string; field: keyof NotifPrefs }[] = [
    { label: 'Conciertos cercanos a ti', field: 'emailConcertsNearby' },
    { label: 'Confirmación de compra', field: 'emailPurchaseConfirm' },
    { label: 'Recordatorios de eventos', field: 'emailEventReminders' },
    { label: 'Ofertas y descuentos', field: 'emailOffers' },
  ];
  const pushRows: { label: string; field: keyof NotifPrefs }[] = [
    { label: 'Actualizaciones de mis entradas', field: 'pushTicketUpdates' },
    { label: 'Alertas de nuevos precios', field: 'pushPriceAlerts' },
  ];
  const smsRows: { label: string; field: keyof NotifPrefs }[] = [
    { label: 'Solo confirmaciones de compra', field: 'smsPurchaseConfirm' },
    { label: 'Alertas de seguridad', field: 'smsSecurityAlerts' },
  ];

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      {[['Por Email', emailRows], ['Push (App)', pushRows], ['SMS', smsRows]].map(([title, rows]) => (
        <SectionCard key={title as string} title={title as string}>
          {(rows as { label: string; field: keyof NotifPrefs }[]).map((r) => (
            <NotifRow key={r.field} label={r.label} on={!!notifPrefs[r.field]} onToggle={() => toggleNotif(r.field)} />
          ))}
        </SectionCard>
      ))}
      <button type="button" className="primary-btn" style={{ width: 'fit-content' }} disabled={notifSaving} onClick={() => void saveNotifs()}>
        {notifSaving ? 'Guardando...' : 'Guardar preferencias'}
      </button>
      {notifFeedback && <p className="feedback-alert success">{notifFeedback}</p>}
    </div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────
function ProfilePage() {
  const ctrl = useProfileController();
  const { session, activeSection, setActiveSection, profile, logout } = ctrl;

  if (!session) {
    return (
      <div className="page-stack" style={{ maxWidth: 480, marginInline: 'auto' }}>
        <section className="panel-card" style={{ textAlign: 'center', padding: 36 }}>
          <h2 className="section-title">Debes iniciar sesión</h2>
          <div style={{ marginTop: 16 }}>
            <Link to="/auth" className="primary-btn">Ir a login</Link>
          </div>
        </section>
      </div>
    );
  }

  const initials = `${session.user.firstName?.[0] ?? ''}${session.user.lastName?.[0] ?? ''}`.toUpperCase();
  const avatarUrl = profile?.avatarUrl ?? session.user.avatarUrl;

  const navItems: { key: ProfileSection; label: string }[] = [
    { key: 'perfil', label: 'Mi Perfil' },
    { key: 'entradas', label: 'Mis Entradas' },
    { key: 'pagos', label: 'Métodos de Pago' },
    { key: 'seguridad', label: 'Seguridad' },
    { key: 'notificaciones', label: 'Notificaciones' },
  ];

  return (
    <div className="profile-layout">
      {/* SIDEBAR */}
      <aside className="profile-sidebar">
        <div style={{ textAlign: 'center', paddingBottom: 16, borderBottom: '1px solid var(--line)', marginBottom: 12 }}>
          <div className="profile-avatar-circle">
            {avatarUrl
              ? <img src={avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              : initials}
          </div>
          <div style={{ fontFamily: 'Bebas Neue', fontSize: '1.2rem', marginTop: 10, letterSpacing: '0.04em' }}>
            {session.user.firstName} {session.user.lastName}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2, wordBreak: 'break-all' }}>
            {session.user.email}
          </div>
        </div>

        {navItems.map(({ key, label }) => (
          <button key={key} type="button"
            className={`profile-nav-item${activeSection === key ? ' active' : ''}`}
            onClick={() => setActiveSection(key)}>
            {label}
          </button>
        ))}

        <button type="button" className="profile-logout-btn" onClick={logout} style={{ marginTop: 8 }}>
          Cerrar Sesión
        </button>
      </aside>

      {/* CONTENT */}
      <main style={{ minWidth: 0 }}>
        <div style={{ marginBottom: 20 }}>
          <h2 className="section-title">{navItems.find((n) => n.key === activeSection)?.label}</h2>
          {activeSection === 'entradas' && (
            <p className="muted" style={{ marginTop: 4 }}>{session.user.firstName} {session.user.lastName}</p>
          )}
        </div>

        {activeSection === 'perfil' && <PerfilSection ctrl={ctrl} session={session} />}
        {activeSection === 'entradas' && <EntradasSection ctrl={ctrl} />}
        {activeSection === 'pagos' && <PagosSection ctrl={ctrl} />}
        {activeSection === 'seguridad' && <SeguridadSection ctrl={ctrl} />}
        {activeSection === 'notificaciones' && <NotificacionesSection ctrl={ctrl} />}
      </main>
    </div>
  );
}

export default ProfilePage;
