import { Link, useParams } from 'react-router-dom';
import { useEventDetailController } from '../../controllers/useEventDetailController';

function EventDetailPage() {
  const { id } = useParams();
  const {
    event,
    loading,
    selectedTier,
    selectedTierId,
    setSelectedTierId,
    quantity,
    increaseQty,
    decreaseQty,
    subtotal,
  } = useEventDetailController(id);

  if (loading) {
    return (
      <section className="section-card">
        <p className="muted">Cargando concierto...</p>
      </section>
    );
  }

  if (!event) {
    return (
      <section className="section-card">
        <h2 className="section-title">Evento no encontrado</h2>
        <p className="muted">Revisa la URL o vuelve al inicio para elegir otro show.</p>
        <div style={{ marginTop: 14 }}>
          <Link to="/" className="primary-btn">
            Ir a inicio
          </Link>
        </div>
      </section>
    );
  }

  return (
    <div className="page-stack split">
      <section className="panel-card">
        <div
          className="event-thumb"
          style={{ backgroundImage: `url(${event.imageUrl ?? ''})`, borderRadius: 16 }}
        />
        <div style={{ marginTop: 16, display: 'grid', gap: 10 }}>
          <span className="overline">{event.artist.name}</span>
          <h2 className="section-title">{event.tourName}</h2>
          <p className="muted">{event.description}</p>
          <div className="meta-line">
            <span>{new Date(event.date).toLocaleString('es-CO', { dateStyle: 'long', timeStyle: 'short' })}</span>
            <span>
              {event.venue.city} · {event.venue.name}
            </span>
          </div>
          <div className="chip-row" style={{ marginBottom: 0 }}>
            {event.genres.map((tag) => (
              <span key={tag} className="chip active">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="panel-card">
        <h2 className="section-title">Compra de Entradas</h2>
        <p className="muted" style={{ marginTop: 8 }}>
          Selecciona una localidad y confirma la cantidad.
        </p>

        <div className="tier-list">
          {event.ticketTypes.map((tier) => (
            <button
              key={tier.id}
              type="button"
              className={`tier-item ${selectedTierId === String(tier.id) ? 'active' : ''}`}
              onClick={() => setSelectedTierId(String(tier.id))}
              disabled={tier.availableQuantity === 0}
            >
              <span>
                <strong>{tier.name}</strong>
                <br />
                <small>{tier.availableQuantity} disponibles</small>
              </span>
              <span>${tier.price.toLocaleString('es-CO')}</span>
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
          <span className="muted">Cantidad</span>
          <div className="qty-box">
            <button type="button" onClick={decreaseQty}>
              -
            </button>
            <span>{quantity}</span>
            <button type="button" onClick={increaseQty}>
              +
            </button>
          </div>
        </div>

        <div className="meta-line" style={{ marginTop: 14 }}>
          <span>{selectedTier?.name ?? 'Selecciona una localidad'}</span>
          <strong>${subtotal.toLocaleString('es-CO')}</strong>
        </div>

        <div style={{ marginTop: 16 }}>
          <Link
            to={`/checkout?event=${event.id}&tier=${selectedTierId}&qty=${quantity}`}
            className="primary-btn"
            style={{ display: 'inline-block' }}
          >
            Continuar al pago
          </Link>
        </div>
      </section>
    </div>
  );
}

export default EventDetailPage;
