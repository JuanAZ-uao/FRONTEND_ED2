import { Link } from 'react-router-dom';
import { useHomeController } from '../../controllers/useHomeController';

function MobileHomePage() {
  const { featured, events } = useHomeController();
  const topEvents = events.slice(0, 3);

  return (
    <section className="mobile-center">
      <div className="mobile-mock">
        <div className="mobile-screen">
          <div className="hero-art" style={{ backgroundImage: `url(${featured.heroImage})` }}>
            <span className="hero-badge">HOME MOBILE</span>
          </div>

          <div style={{ padding: 14, display: 'grid', gap: 12 }}>
            <h2 className="section-title" style={{ fontSize: '1.7rem' }}>
              Eventos Top
            </h2>
            {topEvents.map((event) => (
              <article key={event.id} className="tier-item" style={{ padding: 10 }}>
                <span>
                  <strong>{event.artist}</strong>
                  <br />
                  <small>{event.dateLabel}</small>
                </span>
                <Link to={`/event/${event.slug}`} className="ghost-link">
                  Ver
                </Link>
              </article>
            ))}

            <Link to="/" className="primary-btn" style={{ textAlign: 'center' }}>
              Volver a desktop
            </Link>
          </div>
        </div>
        <p className="foot-note">06 · Home Mobile adaptado</p>
      </div>
    </section>
  );
}

export default MobileHomePage;
