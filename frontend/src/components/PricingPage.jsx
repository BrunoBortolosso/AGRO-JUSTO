import { useState } from 'react';
import { useAgro } from '../agroCore.js';
import { aggregateCosts, addPriceHistory, calculatePrice } from '../agroUtils.js';

export default function PricingPage() {
  const { state, dispatch } = useAgro();
  const [form, setForm] = useState({ produto: state.products[0]?.nome || '', oferta: 1, demanda: 1, transporte: 0, margem: 15 });
  const [costName, setCostName] = useState('');
  const [costValue, setCostValue] = useState(0);

  function calculate() {
    const selected = state.products.find((p) => p.nome === form.produto) || state.products[0];
    if (!selected) return;

    const price = calculatePrice({
      basePrice: Number(selected.preco || 0),
      oferta: Number(form.oferta) || 1,
      demanda: Number(form.demanda) || 1,
      transporte: Number(form.transporte) || 0,
      margem: Number(form.margem) || 0,
      costs: state.costs || []
    });

    const priceEntry = { id: crypto.randomUUID(), produto: selected.nome, preco: price, data: new Date().toISOString(), margem: Number(form.margem) || 0, demanda: Number(form.demanda) || 1, oferta: Number(form.oferta) || 1 };
    dispatch({ type: 'setPricing', pricing: addPriceHistory(state.pricing || [], priceEntry, 20) });
  }

  function addCost(event) {
    event.preventDefault();
    if (!costName.trim()) return;
    const newCost = { id: crypto.randomUUID(), nome: costName, valor: Number(costValue) || 0, categoria: 'Operacao' };
    dispatch({ type: 'setCosts', costs: [...state.costs, newCost] });
    setCostName('');
    setCostValue(0);
  }

  const selectedProduct = state.products.find((p) => p.nome === form.produto) || state.products[0];
  const currentPrice = selectedProduct ? calculatePrice({
    basePrice: Number(selectedProduct.preco || 0),
    oferta: Number(form.oferta) || 1,
    demanda: Number(form.demanda) || 1,
    transporte: Number(form.transporte) || 0,
    margem: Number(form.margem) || 0,
    costs: state.costs || []
  }) : 0;

  return (
    <section className="tab-panel active">
      <article className="card pricing-shell">
        <div className="section-heading pricing-header">
          <div><span className="auth-kicker">Preco Justo</span><h2>Precificação</h2></div>
          <div className="pricing-score">
            <span>Preço sugerido</span>
            <strong>R$ {Number(currentPrice || 0).toFixed(2)}</strong>
          </div>
        </div>

        <div className="pricing-grid">
          <div className="pricing-form panel-card">
            <div className="panel-header compact">
              <div>
                <span className="panel-kicker">Operacional</span>
                <h3>Parâmetros</h3>
              </div>
            </div>

            <label>Produto
              <select value={form.produto} onChange={(e) => setForm({ ...form, produto: e.target.value })}>
                {(state.products || []).map((product) => <option key={product.id} value={product.nome}>{product.nome}</option>)}
              </select>
            </label>
            <label>Oferta<input type="number" value={form.oferta} onChange={(e) => setForm({ ...form, oferta: e.target.value })} /></label>
            <label>Demanda<input type="number" value={form.demanda} onChange={(e) => setForm({ ...form, demanda: e.target.value })} /></label>
            <label>Transporte<input type="number" value={form.transporte} onChange={(e) => setForm({ ...form, transporte: e.target.value })} /></label>
            <label>Margem<input type="number" value={form.margem} onChange={(e) => setForm({ ...form, margem: e.target.value })} /></label>
            <button className="btn" type="button" onClick={calculate}>Calcular preço</button>

            <form className="cost-form" onSubmit={addCost}>
              <label>Custo<input type="text" value={costName} onChange={(e) => setCostName(e.target.value)} placeholder="Nome do custo" required /></label>
              <label>Valor<input type="number" value={costValue} onChange={(e) => setCostValue(Number(e.target.value))} min="0" required /></label>
              <button className="btn secondary" type="submit">Aplicar custo</button>
            </form>
          </div>

          <div className="panel-card cost-panel">
            <div className="panel-header compact">
              <div>
                <span className="panel-kicker">Custos</span>
                <h3>Histórico</h3>
              </div>
            </div>
            <CostHistory costs={state.costs || []} />
          </div>
        </div>
      </article>
    </section>
  );
}

function CostHistory({ costs }) {
  return (
    <div className="cost-history">
      {(costs || []).map((cost) => (
        <div className="history-row" key={cost.id}><span>{cost.nome}</span><strong>R$ {Number(cost.valor || 0).toFixed(2)}</strong></div>
      ))}
      <div className="history-row total"><span>Total</span><strong>R$ {Number(aggregateCosts(costs) || 0).toFixed(2)}</strong></div>
    </div>
  );
}
