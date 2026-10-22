import { useState } from 'react';
import { useAgro } from '../agroCore.js';
import { apiClient, normalizeApiError } from '../apiClient.js';
import agroLogo from '../assets/LOGO.png';

export default function ProfilePage() {
  const { state, dispatch } = useAgro();
  const [profileForm, setProfileForm] = useState({
    nome: state.auth?.nome || state.profile?.nome || '',
    regiao: state.auth?.regiao || state.profile?.regiao || '',
    bio: state.auth?.bio || state.profile?.bio || ''
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  async function saveProfile(event) {
    event.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const updatedUser = state.token === 'demo-token'
        ? {
          ...state.auth,
          nome: profileForm.nome.trim(),
          regiao: profileForm.regiao.trim() || null,
          bio: profileForm.bio.trim()
        }
        : await apiClient.patch('/me', {
          nome: profileForm.nome.trim(),
          regiao: profileForm.regiao.trim() || null,
          bio: profileForm.bio.trim()
        }).then((response) => response.user);

      dispatch({
        type: 'setProfile',
        profile: {
          ...state.profile,
          nome: updatedUser.nome,
          regiao: updatedUser.regiao || '',
          bio: updatedUser.bio || ''
        }
      });
      setProfileForm({
        nome: updatedUser.nome,
        regiao: updatedUser.regiao || '',
        bio: updatedUser.bio || ''
      });
      setMessage(state.token === 'demo-token'
        ? 'Perfil atualizado no modo demonstração; não foi salvo no banco de dados.'
        : 'Perfil salvo com sucesso.');
    } catch (error) {
      const normalized = normalizeApiError(error, 'Não foi possível salvar o perfil.');
      setMessage(normalized.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="tab-panel active">
      <article className="card">
        <div className="section-heading">
          <div>
            <span className="auth-kicker">Perfil</span>
            <h2>Editar perfil</h2>
          </div>
          <img src={agroLogo} alt="AgroJusto" className="profile-logo" />
        </div>

        <form onSubmit={saveProfile} className="profile-form">
          {message && <p className="status-message" role="status">{message}</p>}
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
            <button className="btn" type="submit" disabled={saving}>{saving ? 'Salvando...' : 'Salvar perfil'}</button>
          </div>
        </form>
      </article>
    </section>
  );
}
