import EventCard from '../components/EventCard';
import FilterChips from '../components/FilterChips';
import HeroSection from '../components/HeroSection';
import { useHomeController } from '../../controllers/useHomeController';

function HomePage() {
  const { featured, genres, activeGenre, setActiveGenre, events, preferredGenres, preferredEvents } =
    useHomeController();

  return (
    <div className="page-stack">
      <HeroSection event={featured} />

      {preferredGenres.length > 0 && (
        <section className="section-card">
          <div className="section-head">
            <h2 className="section-title">Segun tus preferencias</h2>
          </div>

          <div className="chip-row" style={{ marginBottom: 14 }}>
            {preferredGenres.map((genre) => (
              <span key={genre} className="chip active">
                {genre}
              </span>
            ))}
          </div>

          {preferredEvents.length === 0 ? (
            <p className="muted">
              Aun no tenemos eventos publicados para esas preferencias. Prueba marcando mas generos.
            </p>
          ) : (
            <div className="card-grid">
              {preferredEvents.map((event) => (
                <EventCard key={`pref-${event.id}`} event={event} />
              ))}
            </div>
          )}
        </section>
      )}

      <section className="section-card">
        <div className="section-head">
          <h2 className="section-title">Eventos Populares</h2>
          <span className="ghost-link">Ver todos →</span>
        </div>

        <FilterChips genres={genres} active={activeGenre} onSelect={setActiveGenre} />

        <div className="card-grid">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default HomePage;
