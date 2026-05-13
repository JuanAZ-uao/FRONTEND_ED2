import { Link } from 'react-router-dom';
import { useCheckoutController } from '../../controllers/useCheckoutController';
import { formatConcertDate } from '../../models/event.model';

function CheckoutPage() {
  const {
    event,
    selectedTierId,
    setSelectedTierId,
    selectedTier,
    seatMap,
    selectedSeats,
    toggleSeatSelection,
    quantity,
    increaseQty,
    decreaseQty,
    card,
    updateCardField,
    queueState,
    queuePosition,
    queueEtaSeconds,
    turnSecondsLeft,
    summary,
    submitPayment,
    status,
    statusType,
    loading,
  } = useCheckoutController();

  if (!event || !selectedTier) {
    return (
      <div className="page-stack" style={{ maxWidth: 760, marginInline: 'auto' }}>
        <section className="panel-card">
          <span className="overline">Compra de Entradas</span>
          <h2 className="section-title" style={{ marginTop: 8 }}>
            Sin concierto seleccionado
          </h2>
          <p className="muted" style={{ marginTop: 8 }}>
            Esta pagina permanece vacia hasta que elijas un concierto desde su vista de detalle.
          </p>
          <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
            <Link to="/" className="primary-btn">
              Ver conciertos
            </Link>
            <Link to="/" className="ghost-btn">
              Ir al inicio
            </Link>
          </div>
        </section>
      </div>
    );
  }

  const queueIsWaiting = queueState !== 'granted';
  const queueIsGranted = queueState === 'granted';

  const formatRemaining = (seconds: number) => {
    const safeSeconds = Math.max(0, seconds);
    const minutes = Math.floor(safeSeconds / 60)
      .toString()
      .padStart(2, '0');
    const secs = (safeSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${secs}`;
  };

  return (
    <div className="page-stack">
      <section className={`queue-banner ${queueState}`}>
        <div>
          <p className="queue-title">Cola de compra en tiempo real</p>
          {queueIsWaiting ? (
            <p className="muted">
              Validando tu turno de compra...
              {queuePosition > 0 ? ` Posicion #${queuePosition}.` : ''}
              {queueEtaSeconds > 0 ? ` Tiempo estimado ${queueEtaSeconds}s.` : ''}
            </p>
          ) : (
            <p className="muted">
              Turno habilitado. Tiempo restante: <strong>{formatRemaining(turnSecondsLeft)}</strong>.
            </p>
          )}
        </div>
        <span className={`queue-pill ${queueIsWaiting ? 'waiting' : 'granted'}`}>
          {queueIsWaiting ? 'Sin turno' : 'Turno activo'}
        </span>
      </section>

      <div className="split">
        <section className="panel-card">
          <span className="overline">Compra de Entradas</span>
          <h2 className="section-title" style={{ marginTop: 8 }}>
            {event.artist.name}
          </h2>
          <p className="muted" style={{ marginTop: 8 }}>
            {event.tourName} · {formatConcertDate(event.date)}
          </p>

          <div className="form-grid" style={{ marginTop: 16 }}>
            <label>
              Localidad
              <select
                value={selectedTierId}
                onChange={(event) => setSelectedTierId(event.target.value)}
                disabled={loading || queueIsWaiting}
              >
                {event.ticketTypes.map((tier) => (
                  <option key={tier.id} value={String(tier.id)}>
                    {tier.name} - ${tier.price.toLocaleString('es-CO')}
                  </option>
                ))}
              </select>
            </label>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="muted">Cantidad</span>
              <div className="qty-box">
                <button type="button" onClick={decreaseQty} disabled={loading || queueIsWaiting}>
                  -
                </button>
                <span>{quantity}</span>
                <button type="button" onClick={increaseQty} disabled={loading || queueIsWaiting}>
                  +
                </button>
              </div>
            </div>

            <div className="meta-line">
              <span>{selectedTier.name}</span>
              <span>{selectedTier.availableQuantity} disponibles</span>
            </div>
          </div>

          <section className="seat-map-card">
            <h3 className="seat-map-title">Mapa de Asientos</h3>
            <div className="seat-stage">ESCENARIO</div>

            <div className="seat-grid-wrap">
              {seatMap.length === 0 ? (
                <p className="muted" style={{ textAlign: 'center', padding: '16px 0' }}>Cargando mapa de asientos...</p>
              ) : (
                seatMap.map((row, rowIndex) => (
                  <div key={`seat-row-${rowIndex}`} className="seat-row">
                    {row.map((seat) => (
                      <button
                        key={seat.id}
                        type="button"
                        className={`seat-dot ${seat.status}`}
                        title={seat.label}
                        onClick={() => toggleSeatSelection(seat)}
                        disabled={
                          loading || queueIsWaiting || seat.status === 'blocked' || seat.status === 'reserved'
                        }
                      />
                    ))}
                  </div>
                ))
              )}
            </div>

            <div className="seat-legend">
              <span className="legend-item">
                <i className="seat-dot available" /> Disponible
              </span>
              <span className="legend-item">
                <i className="seat-dot selected" /> Seleccionado
              </span>
              <span className="legend-item">
                <i className="seat-dot reserved" /> Reservado
              </span>
              <span className="legend-item">
                <i className="seat-dot blocked" /> Pasillo
              </span>
            </div>

            <p className="muted" style={{ marginTop: 10 }}>
              Seleccionados ({selectedSeats.length}/{quantity}):{' '}
              {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'Ninguno'}
            </p>
          </section>
        </section>

        <section className="panel-card">
          <h2 className="section-title">Pago con Tarjeta</h2>

          <form
            className="form-grid"
            style={{ marginTop: 14 }}
            onSubmit={(event) => {
              event.preventDefault();
              void submitPayment();
            }}
          >
            <label>
              Nombre en la tarjeta
              <input
                value={card.holderName}
                onChange={(event) => updateCardField('holderName', event.target.value)}
                placeholder="Nombre Apellido"
                autoComplete="cc-name"
                disabled={loading || queueIsWaiting}
              />
            </label>

            <label>
              Numero de tarjeta
              <input
                value={card.cardNumber}
                onChange={(event) => updateCardField('cardNumber', event.target.value)}
                placeholder="4242 4242 4242 4242"
                inputMode="numeric"
                maxLength={19}
                autoComplete="cc-number"
                disabled={loading || queueIsWaiting}
              />
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <label>
                Expiracion
                <input
                  value={card.expiry}
                  onChange={(event) => updateCardField('expiry', event.target.value)}
                  placeholder="MM/AA"
                  inputMode="numeric"
                  maxLength={5}
                  autoComplete="cc-exp"
                  disabled={loading || queueIsWaiting}
                />
              </label>

              <label>
                CVC
                <input
                  value={card.cvc}
                  onChange={(event) => updateCardField('cvc', event.target.value)}
                  placeholder="123"
                  inputMode="numeric"
                  maxLength={3}
                  autoComplete="cc-csc"
                  disabled={loading || queueIsWaiting}
                />
              </label>
            </div>

            <div className="meta-line">
              <span>Subtotal</span>
              <span>${summary.subtotal.toLocaleString('es-CO')}</span>
            </div>
            <div className="meta-line">
              <span>Servicio</span>
              <span>${summary.serviceFee.toLocaleString('es-CO')}</span>
            </div>
            <div className="meta-line">
              <span>Seguro</span>
              <span>${summary.insurance.toLocaleString('es-CO')}</span>
            </div>
            <div className="meta-line" style={{ fontSize: '1rem' }}>
              <strong>Total</strong>
              <strong>${summary.total.toLocaleString('es-CO')}</strong>
            </div>

            <button
              className="primary-btn"
              type="submit"
              disabled={loading || !queueIsGranted || selectedSeats.length !== quantity || turnSecondsLeft <= 0}
            >
              {queueIsWaiting
                ? 'Sin turno activo'
                : loading
                  ? 'Procesando pago...'
                  : 'Confirmar y pagar'}
            </button>
          </form>

          {status && <p className={`feedback-alert ${statusType}`}>{status}</p>}
        </section>
      </div>
    </div>
  );
}

export default CheckoutPage;
