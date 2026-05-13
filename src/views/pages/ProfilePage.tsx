import { Link } from 'react-router-dom';
import { useDashboardController } from '../../controllers/useDashboardController';
import type { Genre } from '../../models/event.model';
import { authService } from '../../services/auth.service';

const availableGenres: Genre[] = ['Pop', 'Rock', 'Urban', 'Alternative', 'Electronic'];

function ProfilePage() {
  const { profile, savePreferredGenres } = useDashboardController();
  const session = authService.getSession();

  const togglePreference = (genre: Genre) => {
    if (!profile) return;

    const alreadySelected = profile.preferredGenres.includes(genre);
    const nextGenres = alreadySelected
      ? profile.preferredGenres.filter((item) => item !== genre)
      : [...profile.preferredGenres, genre];

    savePreferredGenres(nextGenres);
  };

  if (!session || !profile) {
    return (
      <div className="page-stack" style={{ maxWidth: 700, marginInline: 'auto' }}>
        <section className="panel-card">
          <span className="overline">10 · Perfil</span>
          <h2 className="section-title" style={{ marginTop: 8 }}>
            Debes iniciar sesion
          </h2>
          <p className="muted" style={{ marginTop: 8 }}>
            El perfil es privado. Inicia sesion para ver tu informacion personal.
          </p>
          <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
            <Link to="/auth" className="primary-btn">
              Ir a login
            </Link>
            <Link to="/" className="ghost-btn">
              Volver al inicio
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="page-stack" style={{ maxWidth: 860, marginInline: 'auto' }}>
      <section className="section-card">
        <span className="overline">10 · Perfil</span>
        <h2 className="section-title" style={{ marginTop: 8 }}>
          {profile.fullName}
        </h2>
        <p className="muted" style={{ marginTop: 8 }}>
          Miembro desde {profile.memberSince} · {profile.city}
        </p>

        <div className="split" style={{ marginTop: 18 }}>
          <article className="panel-card">
            <h3 style={{ fontSize: '1.6rem' }}>Datos personales</h3>
            <div className="form-grid" style={{ marginTop: 12 }}>
              <label>
                Nombre
                <input value={profile.fullName} readOnly />
              </label>
              <label>
                Email
                <input value={profile.email} readOnly />
              </label>
              <label>
                Ciudad
                <input value={profile.city} readOnly />
              </label>
            </div>
          </article>

          <article className="panel-card">
            <h3 style={{ fontSize: '1.6rem' }}>Preferencias</h3>
            <p className="muted" style={{ marginTop: 12 }}>
              Tus generos favoritos
            </p>
            <div className="chip-row" style={{ marginTop: 12 }}>
              {availableGenres.map((genre) => (
                <button
                  key={genre}
                  type="button"
                  className={`chip ${profile.preferredGenres.includes(genre) ? 'active' : ''}`}
                  onClick={() => togglePreference(genre)}
                >
                  {genre}
                </button>
              ))}
            </div>
            <p className="muted" style={{ marginTop: 10 }}>
              Selecciona tus preferencias para personalizar lo que ves en inicio.
            </p>
          </article>
        </div>
      </section>
    </div>
  );
}

export default ProfilePage;
