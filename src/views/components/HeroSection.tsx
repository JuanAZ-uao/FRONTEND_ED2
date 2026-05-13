import { Link } from 'react-router-dom';
import type { EventModel } from '../../models/event.model';

interface HeroSectionProps {
  event: EventModel;
}

function HeroSection({ event }: HeroSectionProps) {
  return (
    <section className="hero-card">
      <div className="hero-copy">
        <span className="overline">CONCERTIX EXPERIENCE</span>
        <h1 className="hero-title">{event.title}</h1>
        <p className="muted">{event.description}</p>
        <div className="meta-line">
          <span>{event.dateLabel}</span>
          <span>
            {event.city} · {event.venue}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link to={`/event/${event.slug}`} className="primary-btn">
            Comprar Entradas
          </Link>
          <Link to="/checkout" className="ghost-btn">
            Ver carrito
          </Link>
        </div>
      </div>

      <div className="hero-art" style={{ backgroundImage: `url(${event.heroImage})` }}>
        <span className="hero-badge">{event.soldPercent}% vendido</span>
      </div>
    </section>
  );
}

export default HeroSection;
