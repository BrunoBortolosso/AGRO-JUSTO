import { useAgro, storageKeys } from '../agroCore.js';

export default function Header() {
  const { state, dispatch } = useAgro();

  function logout() {
    dispatch({ type: 'logout' });
    localStorage.removeItem(storageKeys.auth);
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
        <span className="user-chip">{state.profile?.nome || 'Visitante'}</span>
        <button className="btn ghost" type="button">Editar perfil</button>
        <button className="btn ghost" type="button" onClick={logout}>Sair</button>
      </div>
    </header>
  );
}
