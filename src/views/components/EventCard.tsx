import { Link } from 'react-router-dom';
import type { Concert } from '../../models/event.model';
import { formatConcertDate } from '../../models/event.model';

interface EventCardProps {
  event: Concert;
}

function EventCard({ event }: EventCardProps) {
  const basePrice = event.ticketTypes[0]?.price ?? 0;

  return (
    <article className="event-card">
      <div className="event-thumb" style={{ backgroundImage: `url(${event.imageUrl ?? ''})` }} />
      <div className="event-body">
        <h3 className="event-title">{event.artist.name}</h3>
        <p className="muted">{event.tourName}</p>
        <div className="meta-line">
          <span>{formatConcertDate(event.date)}</span>
          <span>{event.genres[0] ?? ''}</span>
        </div>
        <div className="meta-line">
          <span>Desde ${basePrice.toLocaleString('es-CO')}</span>
          <Link to={`/event/${event.id}`} className="ghost-link">
            Ver detalle
          </Link>
        </div>
      </div>
    </article>
  );
}

export default EventCard;
