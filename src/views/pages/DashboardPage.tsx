import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDashboardController } from '../../controllers/useDashboardController';

function DashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { session, profile, reservations, stats } = useDashboardController();
  const [purchaseToast, setPurchaseToast] = useState('');

  useEffect(() => {
    const message = (location.state as { purchaseSuccess?: string } | null)?.purchaseSuccess;
    if (!message) return;

    setPurchaseToast(message);
    navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, location.state, navigate]);

  useEffect(() => {
    if (!purchaseToast) return;

    const timer = setTimeout(() => setPurchaseToast(''), 3500);
    return () => clearTimeout(timer);
  }, [purchaseToast]);

  if (!session || !profile) {
    return (
      <div className="page-stack" style={{ maxWidth: 760, marginInline: 'auto' }}>
        <section className="panel-card">
          <span className="overline">Dashboard Usuario</span>
          <h2 className="section-title" style={{ marginTop: 8 }}>
            Debes iniciar sesion
          </h2>
          <p className="muted" style={{ marginTop: 8 }}>
            El dashboard es privado. Inicia sesion para ver tus compras y reservas.
          </p>
          <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
            <Link to="/auth" className="primary-btn">
              Ir a login
            </Link>
            <Link to="/" className="ghost-btn">
              Volver al inicio
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="page-stack">
      {purchaseToast && (
        <div className="feedback-toast success">
          <span>{purchaseToast}</span>
          <button type="button" className="ghost-btn" onClick={() => setPurchaseToast('')}>
            Cerrar
          </button>
        </div>
      )}

      <section className="section-card">
        <span className="overline">Dashboard Usuario</span>
        <h2 className="section-title" style={{ marginTop: 8 }}>
          Hola, {profile.fullName}
        </h2>
        <p className="muted" style={{ marginTop: 8 }}>
          Administra tus tickets, metodos de pago y preferencias de eventos.
        </p>

        <div className="stats-grid" style={{ marginTop: 16 }}>
          <article className="stat-card">
            <p className="muted">Tickets comprados</p>
            <h3>{stats.totalTickets}</h3>
          </article>
          <article className="stat-card">
            <p className="muted">Reservas confirmadas</p>
            <h3>{stats.confirmed}</h3>
          </article>
          <article className="stat-card">
            <p className="muted">Total invertido</p>
            <h3>${stats.totalSpent.toLocaleString('es-CO')}</h3>
          </article>
        </div>
      </section>

      <section className="section-card">
        <div className="section-head">
          <h2 className="section-title">Mis reservas</h2>
        </div>
        {reservations.length === 0 ? (
          <p className="muted">No has realizado compras de tickets todavia.</p>
        ) : (
          <div className="form-grid">
            {reservations.map((reservation) => (
              <article key={reservation.id} className="tier-item">
                <span>
                  <strong>{reservation.eventName}</strong>
                  <br />
                  <small>
                    {reservation.eventDate} · {reservation.venue}
                  </small>
                  {reservation.seats && reservation.seats.length > 0 && (
                    <>
                      <br />
                      <small>Asientos: {reservation.seats.join(', ')}</small>
                    </>
                  )}
                </span>
                <span style={{ textAlign: 'right' }}>
                  <strong>${reservation.amountPaid.toLocaleString('es-CO')}</strong>
                  <br />
                  <small>{reservation.status}</small>
                </span>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default DashboardPage;
