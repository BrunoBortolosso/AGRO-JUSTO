import { jsPDF } from 'jspdf';
import { useAgro } from '../agroCore.js';
import DashboardCharts from './DashboardCharts.jsx';

export default function DashboardPage() {
  const { state, dispatch } = useAgro();
  const products = state.products || [];
  const machines = state.machines || [];
  const costs = state.costs || [];

  const totalCosts = costs.reduce((sum, cost) => sum + Number(cost.valor || 0), 0);
  const totalProductValue = products.reduce((sum, product) => sum + Number(product.quantidade || 0) * Number(product.preco || 0), 0);
  const avgPrice = products.length ? totalProductValue / products.length : 0;
  const availableMachines = machines.filter((machine) => machine.status !== 'alugada').length;
  const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

  function exportPdf() {
    const doc = new jsPDF();
    doc.text('AgroJusto - Relatorio', 14, 14);
    doc.text(`Produtos: ${products.length}`, 14, 30);
    doc.text(`Maquinas: ${machines.length}`, 14, 40);
    doc.text(`Custos: ${currency.format(totalCosts)}`, 14, 50);
    doc.save('agrojusto-relatorio.pdf');
  }

  const metricCards = [
    { label: 'Produtos', value: products.length, hint: 'cadastros ativos', icon: '🌱' },
    { label: 'Máquinas', value: machines.length, hint: `${availableMachines} disponíveis`, icon: '🚜' },
    { label: 'Custos', value: currency.format(totalCosts), hint: 'totais registrados', icon: '💰' },
    { label: 'Média', value: currency.format(avgPrice), hint: 'por produto', icon: '📊' }
  ];

  const trendCards = [
    { label: 'Produtividade', value: '+12,4%', tone: 'positive', detail: 'vs. mês anterior' },
    { label: 'Custos', value: '-8,1%', tone: 'negative', detail: 'redução operacional' },
    { label: 'Utilização', value: '76%', tone: 'positive', detail: 'de frota disponível' }
  ];

  return (
    <section className="tab-panel active">
      <article className="card dashboard-shell">
        <div className="dashboard-header">
          <div className="dashboard-branding">
            <span className="auth-kicker">Painel</span>
            <h2>Dashboard</h2>
          </div>
          <div className="dashboard-actions">
            <button className="btn ghost" type="button" onClick={() => dispatch({ type: 'setTab', tab: 'perfil' })}>Editar perfil</button>
            <button className="btn secondary" type="button" onClick={exportPdf}>Exportar PDF</button>
          </div>
        </div>

        <div className="dashboard-summary">
          {metricCards.map((card) => (
            <div className="dashboard-card" key={card.label}>
              <div className="metric-icon">{card.icon}</div>
              <div className="metric-content">
                <span className="metric-label">{card.label}</span>
                <strong>{card.value}</strong>
                <small>{card.hint}</small>
              </div>
            </div>
          ))}
        </div>

        <div className="trend-grid">
          {trendCards.map((trend) => (
            <div className={`trend-card ${trend.tone}`} key={trend.label}>
              <span className="trend-label">{trend.label}</span>
              <div className="trend-row">
                <strong>{trend.value}</strong>
                <span className="trend-badge">{trend.tone === 'positive' ? '▲' : '▼'}</span>
              </div>
              <small>{trend.detail}</small>
            </div>
          ))}
        </div>

        <div className="dashboard-grid">
          <div className="panel-card chart-panel">
            <div className="panel-header">
              <div>
                <span className="panel-kicker">Produção</span>
                <h3>Volume por produto</h3>
              </div>
            </div>
            <DashboardCharts products={products} />
          </div>

          <div className="panel-card insight-panel">
            <div className="panel-header">
              <div>
                <span className="panel-kicker">Resumo</span>
                <h3>Operação</h3>
              </div>
            </div>
            <div className="profile-mini-card">
              <div className="profile-mini-avatar">{(state.profile?.nome || 'P').charAt(0).toUpperCase()}</div>
              <div>
                <strong>{state.profile?.nome || 'Produtor AgroJusto'}</strong>
                <span>{state.profile?.regiao || 'Região não informada'}</span>
              </div>
            </div>

            <ul className="insight-list">
              <li>
                <span>Valor total em produtos</span>
                <strong>{currency.format(totalProductValue)}</strong>
              </li>
              <li>
                <span>Máquinas em uso</span>
                <strong>{machines.length - availableMachines}</strong>
              </li>
              <li>
                <span>Perfil</span>
                <strong>{state.profile?.bio ? 'Atualizado' : 'Pendente'}</strong>
              </li>
            </ul>
          </div>
        </div>
      </article>
    </section>
  );
}
