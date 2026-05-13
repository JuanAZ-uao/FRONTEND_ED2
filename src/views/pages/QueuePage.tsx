import { Link } from 'react-router-dom';
import { useQueueController } from '../../controllers/useQueueController';

const formatEta = (totalSeconds: number) => {
  const safe = Math.max(0, totalSeconds);
  const minutes = Math.floor(safe / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (safe % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
};

function QueuePage() {
  const {
    eventId,
    tierId,
    quantity,
    isPayloadValid,
    phase,
    status,
    queuePosition,
    queueEtaSeconds,
    queueLength,
    cancelQueue,
  } = useQueueController();

  if (!isPayloadValid) {
    return (
      <div className="page-stack" style={{ maxWidth: 760, marginInline: 'auto' }}>
        <section className="panel-card">
          <span className="overline">Sala de Espera</span>
          <h2 className="section-title" style={{ marginTop: 8 }}>
            No hay compra activa
          </h2>
          <p className="muted" style={{ marginTop: 8 }}>
            Selecciona un concierto y una localidad antes de entrar a la cola.
          </p>
          <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
            <Link to="/" className="primary-btn">
              Ver conciertos
            </Link>
            <Link to="/tickets" className="ghost-btn">
              Ir a tickets
            </Link>
          </div>
        </section>
      </div>
    );
  }

  const isWaiting = phase === 'joining' || phase === 'waiting';

  return (
    <div className="page-stack" style={{ maxWidth: 860, marginInline: 'auto' }}>
      <section className="queue-room-card">
        <span className="overline">Sala de Espera de Compra</span>
        <h2 className="section-title" style={{ marginTop: 8 }}>
          {isWaiting ? 'Procesando tu turno...' : phase === 'redirecting' ? 'Turno confirmado' : 'Estado de la cola'}
        </h2>

        <p className="muted" style={{ marginTop: 10 }}>
          {status}
        </p>

        <div className="queue-loader-wrap" style={{ marginTop: 18 }}>
          <div className="queue-loader" aria-hidden="true" />
          <div className="queue-progress-track" role="progressbar" aria-valuemin={0} aria-valuemax={100}>
            <div className="queue-progress-bar" />
          </div>
        </div>

        <div className="queue-meta-grid" style={{ marginTop: 18 }}>
          <article className="stat-card">
            <p className="muted">Posicion</p>
            <h3>{queuePosition > 0 ? `#${queuePosition}` : isWaiting ? 'Asignando...' : 'N/A'}</h3>
          </article>

          <article className="stat-card">
            <p className="muted">Tiempo estimado</p>
            <h3>{isWaiting ? formatEta(queueEtaSeconds) : '00:00'}</h3>
          </article>

          <article className="stat-card">
            <p className="muted">Usuarios en cola</p>
            <h3>{queueLength > 0 ? queueLength : isWaiting ? 1 : 0}</h3>
          </article>
        </div>

        <div className="meta-line" style={{ marginTop: 16 }}>
          <span>Evento #{eventId}</span>
          <span>Localidad {tierId} · {quantity} ticket(s)</span>
        </div>

        <div style={{ marginTop: 18, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button type="button" className="ghost-btn" onClick={cancelQueue}>
            Salir de la cola
          </button>
          <Link to="/" className="ghost-btn">
            Volver al inicio
          </Link>
        </div>
      </section>
    </div>
  );
}

export default QueuePage;
