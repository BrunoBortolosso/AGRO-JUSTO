import { useAgro } from '../agroCore.js';

export default function Tabs() {
  const { state, dispatch } = useAgro();
  const tabs = [
    { key: 'inicio', label: 'Inicio' },
    { key: 'precificacao', label: 'Preco Justo' },
    { key: 'produtos', label: 'Produtos' },
    { key: 'maquinas', label: 'Maquinas' },
    { key: 'painel', label: 'Painel' },
    { key: 'perfil', label: 'Perfil' }
  ];

  return (
    <nav className="tabs" aria-label="Navegacao principal">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className={`tab-btn ${state.activeTab === tab.key ? 'active' : ''}`}
          data-tab={tab.key}
          type="button"
          onClick={() => dispatch({ type: 'setTab', tab: tab.key })}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
