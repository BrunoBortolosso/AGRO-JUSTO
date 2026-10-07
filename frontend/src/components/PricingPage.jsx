import { useState } from 'react';
import { useAgro } from '../agroCore.js';
import { aggregateCosts, addPriceHistory, calculateFairPrice, calculatePrice, validateFairPriceForm } from '../agroUtils.js';

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const defaultForm = {
  semente: '',
  veneno: '',
  adubo: '',
  irrigacao: '',
  plantacaoAluguel: '',
  plantacaoCombustivel: '',
  plantacaoDiaria: '',
  plantacaoDias: '',
  colheitaAluguel: '',
  colheitaCombustivel: '',
  colheitaDiaria: '',
  colheitaDias: '',
  frete: '',
  quantidadeSacas: '',
  lucroDesejado: '',
};

export default function PricingPage() {
  const { state, dispatch } = useAgro();
  const [form, setForm] = useState(defaultForm);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [costName, setCostName] = useState('');
  const [costValue, setCostValue] = useState(0);

  function updateForm(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function addCost(event) {
    event.preventDefault();
    if (!costName.trim()) return;
    const newCost = { id: crypto.randomUUID(), nome: costName, valor: Number(costValue) || 0, categoria: 'Operacao' };
    dispatch({ type: 'setCosts', costs: [...state.costs, newCost] });
    setCostName('');
    setCostValue(0);
  }

  function calculate() {
    const validation = validateFairPriceForm(form);

    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    const values = validation.values;
    const nextResult = calculateFairPrice(values);
    setResult(nextResult);
    setError('');

    const priceEntry = {
      id: crypto.randomUUID(),
      produto: 'Preço Justo',
      preco: nextResult.valorFinalSaca,
      data: new Date().toISOString(),
      margem: values.lucroDesejado,
      demanda: 1,
      oferta: 1,
    };

    dispatch({ type: 'setPricing', pricing: addPriceHistory(state.pricing || [], priceEntry, 20) });
  }

  const currentPrice = result ? result.valorFinalSaca : 0;

  return (
    <section className="tab-panel active">
      <article className="card pricing-shell">
        <div className="section-heading pricing-header">
          <div>
            <span className="auth-kicker">Preco Justo</span>
            <h2>Precificação</h2>
          </div>
          <div className="pricing-score">
            <span>Preço justo por saca</span>
            <strong>{currencyFormatter.format(Number(currentPrice || 0))}</strong>
          </div>
        </div>

        <div className="pricing-grid">
          <div className="pricing-form panel-card">
            <div className="panel-header compact">
              <div>
                <span className="panel-kicker">Cálculo</span>
                <h3>Estrutura do custo</h3>
              </div>
            </div>

            <div className="calc-section">
              <div className="section-title-row">
                <span className="section-icon">🌱</span>
                <h4>Insumos</h4>
              </div>
              <div className="field-grid">
                <label>
                  <span>Semente <em>obrigatório</em></span>
                  <input type="number" min="0" step="0.01" value={form.semente} onChange={(e) => updateForm('semente', e.target.value)} placeholder="R$ 0,00" />
                </label>
                <label>
                  <span>Veneno/Defensivo <em>obrigatório</em></span>
                  <input type="number" min="0" step="0.01" value={form.veneno} onChange={(e) => updateForm('veneno', e.target.value)} placeholder="R$ 0,00" />
                </label>
                <label>
                  <span>Adubo <em>obrigatório</em></span>
                  <input type="number" min="0" step="0.01" value={form.adubo} onChange={(e) => updateForm('adubo', e.target.value)} placeholder="R$ 0,00" />
                </label>
                <label>
                  <span>Irrigação</span>
                  <input type="number" min="0" step="0.01" value={form.irrigacao} onChange={(e) => updateForm('irrigacao', e.target.value)} placeholder="R$ 0,00" />
                </label>
              </div>
            </div>

            <div className="calc-section">
              <div className="section-title-row">
                <span className="section-icon">🚜</span>
                <h4>Plantação</h4>
              </div>
              <div className="field-grid">
                <label>
                  <span>Aluguel de máquina</span>
                  <input type="number" min="0" step="0.01" value={form.plantacaoAluguel} onChange={(e) => updateForm('plantacaoAluguel', e.target.value)} placeholder="R$ 0,00" />
                </label>
                <label>
                  <span>Combustível</span>
                  <input type="number" min="0" step="0.01" value={form.plantacaoCombustivel} onChange={(e) => updateForm('plantacaoCombustivel', e.target.value)} placeholder="R$ 0,00" />
                </label>
                <label>
                  <span>Valor da diária</span>
                  <input type="number" min="0" step="0.01" value={form.plantacaoDiaria} onChange={(e) => updateForm('plantacaoDiaria', e.target.value)} placeholder="R$ 0,00" />
                </label>
                <label>
                  <span>Quantidade de dias</span>
                  <input type="number" min="0" step="1" value={form.plantacaoDias} onChange={(e) => updateForm('plantacaoDias', e.target.value)} placeholder="0" />
                </label>
              </div>
            </div>

            <div className="calc-section">
              <div className="section-title-row">
                <span className="section-icon">🌾</span>
                <h4>Colheita</h4>
              </div>
              <div className="field-grid">
                <label>
                  <span>Aluguel de máquina</span>
                  <input type="number" min="0" step="0.01" value={form.colheitaAluguel} onChange={(e) => updateForm('colheitaAluguel', e.target.value)} placeholder="R$ 0,00" />
                </label>
                <label>
                  <span>Combustível</span>
                  <input type="number" min="0" step="0.01" value={form.colheitaCombustivel} onChange={(e) => updateForm('colheitaCombustivel', e.target.value)} placeholder="R$ 0,00" />
                </label>
                <label>
                  <span>Valor da diária</span>
                  <input type="number" min="0" step="0.01" value={form.colheitaDiaria} onChange={(e) => updateForm('colheitaDiaria', e.target.value)} placeholder="R$ 0,00" />
                </label>
                <label>
                  <span>Quantidade de dias</span>
                  <input type="number" min="0" step="1" value={form.colheitaDias} onChange={(e) => updateForm('colheitaDias', e.target.value)} placeholder="0" />
                </label>
                <label className="full-width">
                  <span>Frete <em>obrigatório</em></span>
                  <input type="number" min="0" step="0.01" value={form.frete} onChange={(e) => updateForm('frete', e.target.value)} placeholder="R$ 0,00" />
                </label>
              </div>
            </div>

            <div className="calc-section">
              <div className="section-title-row">
                <span className="section-icon">📦</span>
                <h4>Produção</h4>
              </div>
              <div className="field-grid compact-grid">
                <label>
                  <span>Quantidade de sacas <em>obrigatório</em></span>
                  <input type="number" min="1" step="1" value={form.quantidadeSacas} onChange={(e) => updateForm('quantidadeSacas', e.target.value)} placeholder="0" />
                </label>
                <label>
                  <span>Lucro desejado <em>obrigatório</em></span>
                  <input type="number" min="0" max="100" step="0.01" value={form.lucroDesejado} onChange={(e) => updateForm('lucroDesejado', e.target.value)} placeholder="20%" />
                </label>
              </div>
            </div>

            {error && <div className="error-box">{error}</div>}

            <button className="btn" type="button" onClick={calculate}>Calcular preço justo</button>
          </div>

          <div className="panel-card cost-panel result-panel">
            <div className="panel-header compact">
              <div>
                <span className="panel-kicker">Resultado</span>
                <h3>Preço Justo</h3>
              </div>
            </div>

            {result ? (
              <>
                <div className="result-card highlight">
                  <span className="result-label">💰 Preço Justo por Saca</span>
                  <strong className="result-price">{currencyFormatter.format(result.valorFinalSaca)}</strong>
                </div>

                <div className="result-list">
                  <div className="result-item"><span>📦 Quantidade de sacas</span><strong>{Number(form.quantidadeSacas || 0).toLocaleString('pt-BR')} sacas</strong></div>
                  <div className="result-item"><span>📊 Custo total de produção</span><strong>{currencyFormatter.format(result.prodTotal)}</strong></div>
                  <div className="result-item"><span>📈 Lucro desejado</span><strong>{Number(form.lucroDesejado || 0).toFixed(2)}%</strong></div>
                  <div className="result-item"><span>💵 Rendimento total estimado</span><strong>{currencyFormatter.format(result.rendimentoTotal)}</strong></div>
                </div>
              </>
            ) : (
              <div className="empty-result">
                <p>Preencha os campos obrigatórios e clique em calcular para visualizar o preço justo.</p>
              </div>
            )}

            <div className="panel-header compact result-subheader">
              <div>
                <span className="panel-kicker">Custos</span>
                <h3>Registrados</h3>
              </div>
            </div>
            <CostHistory costs={state.costs || []} />

            <form className="cost-form" onSubmit={addCost}>
              <label>
                Custo
                <input type="text" value={costName} onChange={(e) => setCostName(e.target.value)} placeholder="Nome do custo" required />
              </label>
              <label>
                Valor
                <input type="number" value={costValue} onChange={(e) => setCostValue(Number(e.target.value))} min="0" required />
              </label>
              <button className="btn secondary" type="submit">Aplicar custo</button>
            </form>
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
        <div className="history-row" key={cost.id}><span>{cost.nome}</span><strong>{currencyFormatter.format(Number(cost.valor || 0))}</strong></div>
      ))}
      <div className="history-row total"><span>Total</span><strong>{currencyFormatter.format(Number(aggregateCosts(costs) || 0))}</strong></div>
    </div>
  );
}
