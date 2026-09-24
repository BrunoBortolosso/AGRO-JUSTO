import { useState } from 'react';
import { useAgro } from '../agroCore.js';

export default function ProfilePage() {
  const { state, dispatch } = useAgro();
  const [profileForm, setProfileForm] = useState({
    nome: state.profile?.nome || '',
    regiao: state.profile?.regiao || '',
    bio: state.profile?.bio || ''
  });

  function saveProfile(event) {
    event.preventDefault();
    dispatch({
      type: 'setProfile',
      profile: {
        ...state.profile,
        nome: profileForm.nome,
        regiao: profileForm.regiao,
        bio: profileForm.bio
      }
    });
  }

  return (
    <section className="tab-panel active">
      <article className="card">
        <div className="section-heading">
          <div>
            <span className="auth-kicker">Perfil</span>
            <h2>Editar perfil</h2>
          </div>
        </div>

        <form onSubmit={saveProfile} className="profile-form">
          <label>
            Nome
            <input
              type="text"
              value={profileForm.nome}
              onChange={(event) => setProfileForm({ ...profileForm, nome: event.target.value })}
              required
            />
          </label>

          <label>
            Região
            <input
              type="text"
              value={profileForm.regiao}
              onChange={(event) => setProfileForm({ ...profileForm, regiao: event.target.value })}
            />
          </label>

          <label>
            Bio
            <textarea
              value={profileForm.bio}
              onChange={(event) => setProfileForm({ ...profileForm, bio: event.target.value })}
            />
          </label>

          <div className="dialog-actions">
            <button className="btn" type="submit">Salvar perfil</button>
          </div>
        </form>
      </article>
    </section>
  );
}
