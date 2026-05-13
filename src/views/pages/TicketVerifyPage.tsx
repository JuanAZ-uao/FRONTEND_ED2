import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { apiFetch } from '../../services/api.service';
import { formatConcertDate } from '../../models/event.model';

interface VerifyTicket {
  id: number;
  ticketCode: string;
  seatLabel: string | null;
  row: string | null;
  status: string;
  user: { firstName: string; lastName: string; city: string | null } | null;
  ticketType: {
    name: string;
    price: number;
    concert: {
      tourName: string;
      date: string;
      artist: { name: string };
      venue: { name: string; city: string };
    };
    section: { name: string; color: string | null } | null;
  };
  order: { id: number; totalAmount: number; createdAt: string } | null;
}

const STATUS_COLOR: Record<string, string> = {
  SOLD: '#18e4ff',
  AVAILABLE: '#17c67f',
  RESERVED: '#f7c45d',
  USED: '#a7afc7',
  CANCELLED: '#ff5c7a',
};

const STATUS_LABEL: Record<string, string> = {
  SOLD: 'Confirmada',
  AVAILABLE: 'Disponible',
  RESERVED: 'Reservada',
  USED: 'Usada',
  CANCELLED: 'Cancelada',
};

function TicketVerifyPage() {
  const { code } = useParams<{ code: string }>();
  const [ticket, setTicket] = useState<VerifyTicket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!code) return;
    setLoading(true);
    apiFetch<VerifyTicket>(`/tickets/verify/${code}`)
      .then(setTicket)
      .catch((err: Error) => setError(err.message ?? 'Boleta no encontrada'))
      .finally(() => setLoading(false));
  }, [code]);

  if (loading) {
    return (
      <div className="verify-wrap">
        <div className="verify-card">
          <span className="overline">Verificando...</span>
        </div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="verify-wrap">
        <div className="verify-card">
          <span className="overline" style={{ color: 'var(--accent-coral)' }}>Error</span>
          <h2 className="section-title" style={{ marginTop: 10 }}>Boleta no encontrada</h2>
          <p className="muted" style={{ marginTop: 8 }}>{error || 'El codigo no existe o fue cancelado.'}</p>
          <div style={{ marginTop: 16 }}>
            <Link to="/" className="ghost-btn">Volver al inicio</Link>
          </div>
        </div>
      </div>
    );
  }

  const concert = ticket.ticketType.concert;
  const statusColor = STATUS_COLOR[ticket.status] ?? '#a7afc7';
  const isValid = ticket.status === 'SOLD' || ticket.status === 'AVAILABLE';

  return (
    <div className="verify-wrap">
      <div className="verify-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <span className="overline">Verificacion de Boleta</span>
          <span
            style={{
              background: `${statusColor}22`,
              border: `1px solid ${statusColor}88`,
              color: statusColor,
              borderRadius: 999,
              padding: '5px 12px',
              fontSize: '0.8rem',
            }}
          >
            {STATUS_LABEL[ticket.status] ?? ticket.status}
          </span>
        </div>

        <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: '50%',
              background: isValid ? 'rgba(24,228,255,0.15)' : 'rgba(255,92,122,0.15)',
              border: `2px solid ${isValid ? 'var(--accent-cyan)' : 'var(--accent-coral)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.6rem',
            }}
          >
            {isValid ? '✓' : '✗'}
          </div>
          <div>
            <h2 className="section-title">{concert.artist.name}</h2>
            <p className="muted">{concert.tourName}</p>
          </div>
        </div>

        <div className="verify-grid">
          <div className="verify-field">
            <span className="overline" style={{ fontSize: '0.65rem' }}>Fecha</span>
            <span>{formatConcertDate(concert.date)}</span>
          </div>
          <div className="verify-field">
            <span className="overline" style={{ fontSize: '0.65rem' }}>Sede</span>
            <span>{concert.venue.name} · {concert.venue.city}</span>
          </div>
          <div className="verify-field">
            <span className="overline" style={{ fontSize: '0.65rem' }}>Localidad</span>
            <span>{ticket.ticketType.name}{ticket.ticketType.section ? ` – ${ticket.ticketType.section.name}` : ''}</span>
          </div>
          {ticket.seatLabel && (
            <div className="verify-field">
              <span className="overline" style={{ fontSize: '0.65rem' }}>Asiento</span>
              <span>{ticket.seatLabel}</span>
            </div>
          )}
          {ticket.user && (
            <div className="verify-field">
              <span className="overline" style={{ fontSize: '0.65rem' }}>Titular</span>
              <span>{ticket.user.firstName} {ticket.user.lastName}</span>
            </div>
          )}
          <div className="verify-field">
            <span className="overline" style={{ fontSize: '0.65rem' }}>Codigo</span>
            <span style={{ fontFamily: 'monospace', letterSpacing: '0.08em' }}>{ticket.ticketCode}</span>
          </div>
        </div>

        <div style={{ marginTop: 20, borderTop: '1px solid var(--line)', paddingTop: 16 }}>
          <Link to="/" className="ghost-btn" style={{ display: 'inline-block' }}>← Volver</Link>
        </div>
      </div>
    </div>
  );
}

export default TicketVerifyPage;
