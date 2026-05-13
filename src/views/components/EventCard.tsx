import { Link } from 'react-router-dom';
import type { EventModel } from '../../models/event.model';

interface EventCardProps {
  event: EventModel;
}

function EventCard({ event }: EventCardProps) {
  const basePrice = event.ticketTiers[0]?.price ?? 0;

  return (
    <article className="event-card">
      <div className="event-thumb" style={{ backgroundImage: `url(${event.posterImage})` }} />
      <div className="event-body">
        <h3 className="event-title">{event.artist}</h3>
        <p className="muted">{event.title}</p>
        <div className="meta-line">
          <span>{event.dateLabel}</span>
          <span>{event.genre}</span>
        </div>
        <div className="meta-line">
          <span>Desde ${basePrice.toLocaleString('es-CO')}</span>
          <Link to={`/event/${event.slug}`} className="ghost-link">
            Ver detalle
          </Link>
        </div>
      </div>
    </article>
  );
}

export default EventCard;
