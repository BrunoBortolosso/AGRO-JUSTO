import { useAgro } from '../agroCore.js';
import { apiClient, normalizeApiError, TOKEN_STORAGE_KEY } from '../apiClient.js';

export default function Header() {
  const { state, dispatch } = useAgro();

  function openProfileTab() {
    dispatch({ type: 'setTab', tab: 'perfil' });
  }

  async function logout() {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      const normalized = normalizeApiError(error, 'Não foi possível finalizar a sessão no servidor.');
      console.warn(normalized.message);
    } finally {
      sessionStorage.removeItem(TOKEN_STORAGE_KEY);
      dispatch({ type: 'clearSession' });
    }
  }

  return (
    <header className="topbar">
      <div className="brand">
        <i className="fa-solid fa-seedling"></i>
        <div>
          <h1>AgroJusto</h1>
          <p>Preco justo para quem produz</p>
        </div>
      </div>
      <div className="top-actions">
        <span className="user-chip">{state.auth?.nome || state.profile?.nome || 'Visitante'}</span>
        <button className="btn ghost" type="button" onClick={openProfileTab}>Editar perfil</button>
        <button className="btn ghost" type="button" onClick={logout}>Sair</button>
      </div>
    </header>
  );
}
