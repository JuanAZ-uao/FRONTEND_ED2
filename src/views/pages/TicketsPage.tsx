import { Link } from 'react-router-dom';
import { useTicketsController } from '../../controllers/useTicketsController';
import { formatConcertDate } from '../../models/event.model';
import type { UserTicket } from '../../services/user.service';
import { authService } from '../../services/auth.service';

const STATUS_LABEL: Record<string, string> = {
  AVAILABLE: 'Disponible',
  SOLD: 'Confirmada',
  RESERVED: 'Reservada',
  USED: 'Usada',
  CANCELLED: 'Cancelada',
};

function TicketCard({ ticket }: { ticket: UserTicket }) {
  const concert = ticket.ticketType.concert;
  const qrData = `${window.location.origin}/verify/${ticket.ticketCode}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(qrData)}&bgcolor=0a0a14&color=18e4ff&qzone=2`;

  return (
    <article className="ticket-card">
      <div className="ticket-left">
        <span className="overline">{ticket.ticketType.name}</span>
        <h3 className="event-title" style={{ marginTop: 6 }}>{concert.artist.name}</h3>
        <p className="muted" style={{ marginTop: 4 }}>{concert.tourName}</p>

        <div className="ticket-meta">
          <span>{formatConcertDate(concert.date)}</span>
          <span>{concert.venue.city} · {concert.venue.name}</span>
        </div>

        {ticket.seatLabel && (
          <div className="ticket-meta">
            <span>Asiento: <strong>{ticket.seatLabel}</strong></span>
            {ticket.ticketType.section && <span>{ticket.ticketType.section.name}</span>}
          </div>
        )}

        <div style={{ marginTop: 10, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <span className={`ticket-status ${ticket.status.toLowerCase()}`}>
            {STATUS_LABEL[ticket.status] ?? ticket.status}
          </span>
          <span className="muted" style={{ fontSize: '0.74rem' }}>{ticket.ticketCode}</span>
        </div>

        {ticket.order && (
          <p className="muted" style={{ marginTop: 8, fontSize: '0.76rem' }}>
            Orden #{ticket.order.id} · ${ticket.order.totalAmount.toLocaleString('es-CO')}
          </p>
        )}
      </div>

      <div className="ticket-right">
        <div className="qr-box">
          <img
            src={qrUrl}
            alt={`QR ${ticket.ticketCode}`}
            width={160}
            height={160}
            style={{ borderRadius: 10, display: 'block' }}
          />
          <p className="muted" style={{ marginTop: 6, fontSize: '0.7rem', textAlign: 'center' }}>
            Escanear para verificar
          </p>
        </div>
      </div>
    </article>
  );
}

function TicketsPage() {
  const { session, upcoming, past, loading } = useTicketsController();

  if (!session) {
    return (
      <div className="page-stack" style={{ maxWidth: 640, marginInline: 'auto' }}>
        <section className="panel-card">
          <span className="overline">Mis Boletas</span>
          <h2 className="section-title" style={{ marginTop: 8 }}>Debes iniciar sesion</h2>
          <p className="muted" style={{ marginTop: 8 }}>Inicia sesion para ver tus boletas.</p>
          <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
            <Link to="/auth" className="primary-btn">Ir a login</Link>
            <Link to="/" className="ghost-btn">Ver conciertos</Link>
          </div>
        </section>
      </div>
    );
  }

  const fullName = authService.getUserFullName(session.user);

  return (
    <div className="page-stack">
      <section className="section-card">
        <span className="overline">Mis Boletas</span>
        <h2 className="section-title" style={{ marginTop: 8 }}>Hola, {fullName}</h2>
        <p className="muted" style={{ marginTop: 6 }}>
          Tus entradas para conciertos. Presenta el codigo QR en la entrada del evento.
        </p>
      </section>

      {loading ? (
        <section className="section-card">
          <p className="muted">Cargando tus boletas...</p>
        </section>
      ) : (
        <>
          <section className="section-card">
            <div className="section-head">
              <h2 className="section-title">Proximos eventos</h2>
              <span className="muted">{upcoming.length} boleta{upcoming.length !== 1 ? 's' : ''}</span>
            </div>
            {upcoming.length === 0 ? (
              <div>
                <p className="muted">No tienes boletas para eventos proximos.</p>
                <div style={{ marginTop: 14 }}>
                  <Link to="/" className="primary-btn">Ver conciertos disponibles</Link>
                </div>
              </div>
            ) : (
              <div className="tickets-list">
                {upcoming.map((t) => <TicketCard key={t.id} ticket={t} />)}
              </div>
            )}
          </section>

          {past.length > 0 && (
            <section className="section-card">
              <div className="section-head">
                <h2 className="section-title">Historial</h2>
                <span className="muted">{past.length} boleta{past.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="tickets-list">
                {past.map((t) => <TicketCard key={t.id} ticket={t} />)}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

export default TicketsPage;
