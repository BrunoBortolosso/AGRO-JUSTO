import { useAgro } from "../agroCore.js";

export default function Tabs() {
  const { state, dispatch } = useAgro();
  const tabs = [
    { key: "inicio", label: "Inicio" },
    { key: "painel", label: "Painel" },
    { key: "precificacao", label: "Preço Justo" },
    { key: "produtos", label: "Produtos" },
    { key: "maquinas", label: "Máquinas" }
  ];

  return (
    <nav className="tabs" aria-label="Navegação principal">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className={`tab-btn ${state.activeTab === tab.key ? "active" : ""}`}
          data-tab={tab.key}
          aria-current={state.activeTab === tab.key ? "page" : undefined}
          type="button"
          onClick={() => dispatch({ type: "setTab", tab: tab.key })}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
