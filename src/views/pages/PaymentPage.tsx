import { useCheckoutController } from '../../controllers/useCheckoutController';

function PaymentPage() {
  const { card, updateCardField, summary, submitPayment, status, statusType, loading } =
    useCheckoutController();

  return (
    <div className="page-stack" style={{ maxWidth: 700, marginInline: 'auto' }}>
      <section className="panel-card">
        <span className="overline">07 · Pago con Tarjeta</span>
        <h2 className="section-title" style={{ marginTop: 8 }}>
          Finaliza tu compra
        </h2>

        <form
          className="form-grid"
          style={{ marginTop: 16 }}
          onSubmit={(event) => {
            event.preventDefault();
            void submitPayment();
          }}
        >
          <label>
            Nombre titular
            <input
              value={card.holderName}
              onChange={(event) => updateCardField('holderName', event.target.value)}
              placeholder="Nombre Apellido"
              autoComplete="cc-name"
            />
          </label>
          <label>
            Numero tarjeta
            <input
              value={card.cardNumber}
              onChange={(event) => updateCardField('cardNumber', event.target.value)}
              placeholder="4242 4242 4242 4242"
              inputMode="numeric"
              maxLength={19}
              autoComplete="cc-number"
            />
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <label>
              Expira
              <input
                value={card.expiry}
                onChange={(event) => updateCardField('expiry', event.target.value)}
                placeholder="MM/AA"
                inputMode="numeric"
                maxLength={5}
                autoComplete="cc-exp"
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
              />
            </label>
          </div>

          <div className="meta-line" style={{ fontSize: '1rem' }}>
            <strong>Total a pagar</strong>
            <strong>${summary.total.toLocaleString('es-CO')}</strong>
          </div>

          <button className="primary-btn" type="submit" disabled={loading}>
            {loading ? 'Procesando...' : 'Pagar ahora'}
          </button>
        </form>

        {status && <p className={`feedback-alert ${statusType}`}>{status}</p>}
      </section>
    </div>
  );
}

export default PaymentPage;
