import { Link } from 'react-router-dom';
import type { Concert } from '../../models/event.model';
import { formatConcertDate, getSoldPercent } from '../../models/event.model';

interface HeroSectionProps {
  event: Concert;
}

function HeroSection({ event }: HeroSectionProps) {
  return (
    <section className="hero-card">
      <div className="hero-copy">
        <span className="overline">CONCERTIX EXPERIENCE</span>
        <h1 className="hero-title">{event.tourName}</h1>
        <p className="muted">{event.description}</p>
        <div className="meta-line">
          <span>{formatConcertDate(event.date)}</span>
          <span>
            {event.venue.city} · {event.venue.name}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link to={`/event/${event.id}`} className="primary-btn">
            Comprar Entradas
          </Link>
          <Link to="/checkout" className="ghost-btn">
            Ver carrito
          </Link>
        </div>
      </div>

      <div className="hero-art" style={{ backgroundImage: `url(${event.bannerUrl ?? ''})` }}>
        <span className="hero-badge">{getSoldPercent(event.ticketTypes)}% vendido</span>
      </div>
    </section>
  );
}

export default HeroSection;
