import { useAgro } from '../agroCore.js';
import { apiClient, normalizeApiError, TOKEN_STORAGE_KEY } from '../apiClient.js';
import agroLogo from '../assets/LOGO.png';

export default function Header() {
  const { state, dispatch } = useAgro();
  const showProfileButton = state.activeTab !== 'painel';

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
      <div className="brand" aria-label="AgroJusto">
        <img src={agroLogo} alt="Logo AgroJusto" className="brand-logo" />
      </div>
      <div className="top-actions">
        <span className="user-chip">{state.auth?.nome || state.profile?.nome || 'Visitante'}</span>
        {showProfileButton && (
          <button className="btn ghost" type="button" onClick={openProfileTab}>Editar perfil</button>
        )}
        <button className="btn ghost" type="button" onClick={logout}>Sair</button>
      </div>
    </header>
  );
}
