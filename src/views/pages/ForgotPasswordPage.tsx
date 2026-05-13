import { useState } from 'react';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  return (
    <div className="page-stack" style={{ maxWidth: 620, marginInline: 'auto' }}>
      <section className="panel-card">
        <span className="overline">Olvido de Contraseña</span>
        <h2 className="section-title" style={{ marginTop: 8 }}>
          Recupera el acceso
        </h2>
        <p className="muted" style={{ marginTop: 8 }}>
          Te enviaremos un enlace para restablecer tu password.
        </p>

        <form
          className="form-grid"
          style={{ marginTop: 16 }}
          onSubmit={(event) => {
            event.preventDefault();
            setMessage(`Si ${email} existe, se envio un correo de recuperacion.`);
          }}
        >
          <label>
            Correo registrado
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="correo@ejemplo.com"
            />
          </label>

          <button className="primary-btn" type="submit">
            Enviar enlace
          </button>
        </form>

        {message && (
          <p className="muted" style={{ marginTop: 12 }}>
            {message}
          </p>
        )}
      </section>
    </div>
  );
}

export default ForgotPasswordPage;
