import { useState } from 'react';
import { useAgro } from '../agroCore.js';
import { addPriceHistory, calculateFairPrice, validateFairPriceForm } from '../agroUtils.js';

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

const costCategories = [
  { value: 'INSUMO', label: 'Insumos' },
  { value: 'MAO_DE_OBRA', label: 'Mão de obra' },
  { value: 'TRANSPORTE', label: 'Transporte' },
  { value: 'MANUTENCAO', label: 'Manutenção' },
  { value: 'OUTRO', label: 'Outro' },
];

function parseCostAmount(value) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : Number.NaN;
  const normalized = String(value ?? '').trim().replace(/\s|R\$/gi, '');
  if (!normalized) return Number.NaN;
  const decimalNormalized = normalized.includes(',')
    ? normalized.replace(/\./g, '').replace(',', '.')
    : normalized;
  const amount = Number(decimalNormalized);
  return Number.isFinite(amount) ? amount : Number.NaN;
}

function getCostCategoryLabel(category) {
  const knownCategory = costCategories.find((item) => item.value === category);
  if (knownCategory) return knownCategory.label;
  const legacyLabels = { Operacao: 'Operação', Logistica: 'Logística' };
  return legacyLabels[category] || category || 'Outro';
}

export default function PricingPage() {
  const { state, dispatch } = useAgro();
  const [form, setForm] = useState(defaultForm);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [costName, setCostName] = useState('');
  const [costCategory, setCostCategory] = useState('OUTRO');
  const [costValue, setCostValue] = useState('');
  const [costError, setCostError] = useState('');
  const [editingCostId, setEditingCostId] = useState('');

  function updateForm(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function addCost(event) {
    event.preventDefault();
    const amount = parseCostAmount(costValue);
    if (!costName.trim() || !Number.isFinite(amount) || amount < 0) {
      setCostError('Informe o nome do custo e um valor válido.');
      return;
    }
    const currentCosts = Array.isArray(state.costs) ? state.costs : [];
    const nextCost = {
      id: editingCostId || crypto.randomUUID(),
      nome: costName.trim(),
      valor: amount,
      categoria: costCategory,
    };
    const nextCosts = editingCostId
      ? currentCosts.map((cost) => (cost.id === editingCostId ? nextCost : cost))
      : [...currentCosts, nextCost];
    dispatch({ type: 'setCosts', costs: nextCosts });
    resetCostForm();
  }

  function startEditingCost(cost) {
    setEditingCostId(cost.id);
    setCostName(cost.nome || '');
    setCostCategory(cost.categoria || 'OUTRO');
    setCostValue(String(cost.valor ?? ''));
    setCostError('');
  }

  function deleteCost(costId) {
    const confirmed = window.confirm('Deseja excluir este custo?');
    if (!confirmed) return;
    const currentCosts = Array.isArray(state.costs) ? state.costs : [];
    dispatch({ type: 'setCosts', costs: currentCosts.filter((cost) => cost.id !== costId) });
    if (editingCostId === costId) resetCostForm();
  }

  function resetCostForm() {
    setEditingCostId('');
    setCostName('');
    setCostCategory('OUTRO');
    setCostValue('');
    setCostError('');
  }

  function calculate() {
    const validation = validateFairPriceForm(form);

    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    const values = validation.values;
    const nextResult = calculateFairPrice({
      ...values,
      custosRegistrados: getCostsTotal(state.costs),
    });
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
  const quantitySacas = Number(form.quantidadeSacas || 0);
  const custoPorUnidade = result && quantitySacas > 0 ? result.prodTotal / quantitySacas : 0;
  const precoMinimoPorUnidade = result ? result.precoSaca : 0;
  const precoIdealPorUnidade = result ? result.valorFinalSaca : 0;
  const lucroEstimadoTotal = result ? result.rendimentoTotal - result.prodTotal : 0;
  const lucroEstimadoPorUnidade = result && quantitySacas > 0 ? lucroEstimadoTotal / quantitySacas : 0;

  const resultMessages = result ? [
    'Este é o custo estimado para produzir cada unidade do seu produto.',
    quantitySacas > 0 ? `Com ${Number(quantitySacas).toLocaleString('pt-BR')} sacas produzidas, o custo por unidade fica em ${currencyFormatter.format(custoPorUnidade)}.` : 'A quantidade produzida precisa ser informada para detalhar o custo por unidade.',
    `Vender abaixo de ${currencyFormatter.format(precoMinimoPorUnidade)} por saca pode causar prejuízo, considerando os custos informados.`,
    `Este é o preço sugerido para cobrir os custos e alcançar a margem de lucro configurada: ${currencyFormatter.format(precoIdealPorUnidade)} por saca.`,
    'Confira os preços praticados na sua região antes de definir o valor final de venda.',
  ] : [];

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
                  <span className="result-subtext">Valor sugerido para venda considerando os custos e a margem informada.</span>
                </div>

                <div className="result-metric-grid">
                  <div className="result-metric-card">
                    <span className="result-metric-label">Custo de produção</span>
                    <strong>{currencyFormatter.format(result.prodTotal)}</strong>
                    <small>Total incluindo os custos registrados</small>
                  </div>
                  {result.custosRegistrados > 0 && (
                    <div className="result-metric-card">
                      <span className="result-metric-label">Custos registrados</span>
                      <strong>{currencyFormatter.format(result.custosRegistrados)}</strong>
                      <small>incluídos no cálculo</small>
                    </div>
                  )}
                  <div className="result-metric-card success">
                    <span className="result-metric-label">Preço mínimo</span>
                    <strong>{currencyFormatter.format(precoMinimoPorUnidade)}</strong>
                    <small>por saca</small>
                  </div>
                  <div className="result-metric-card accent">
                    <span className="result-metric-label">Preço ideal</span>
                    <strong>{currencyFormatter.format(precoIdealPorUnidade)}</strong>
                    <small>por saca</small>
                  </div>
                  <div className="result-metric-card warn">
                    <span className="result-metric-label">Lucro estimado</span>
                    <strong>{currencyFormatter.format(lucroEstimadoTotal)}</strong>
                    <small>no total da produção</small>
                  </div>
                </div>

                <div className="result-summary-box">
                  <h4>O que esse resultado significa?</h4>
                  <ul className="meaning-list">
                    {resultMessages.map((message) => (
                      <li key={message}>{message}</li>
                    ))}
                  </ul>
                </div>

                <div className="scenario-box">
                  <h4>Exemplo prático da simulação</h4>
                  <div className="scenario-grid">
                    <div className="scenario-item">
                      <span>Produto calculado</span>
                      <strong>Produção atual</strong>
                    </div>
                    <div className="scenario-item">
                      <span>Quantidade produzida</span>
                      <strong>{Number(quantitySacas || 0).toLocaleString('pt-BR')} sacas</strong>
                    </div>
                    <div className="scenario-item">
                      <span>Custo por unidade</span>
                      <strong>{currencyFormatter.format(custoPorUnidade)}</strong>
                    </div>
                    <div className="scenario-item">
                      <span>Preço mínimo por unidade</span>
                      <strong>{currencyFormatter.format(precoMinimoPorUnidade)}</strong>
                    </div>
                    <div className="scenario-item">
                      <span>Preço ideal por unidade</span>
                      <strong>{currencyFormatter.format(precoIdealPorUnidade)}</strong>
                    </div>
                    <div className="scenario-item">
                      <span>Receita estimada</span>
                      <strong>{currencyFormatter.format(result.rendimentoTotal)}</strong>
                    </div>
                    <div className="scenario-item">
                      <span>Lucro estimado por unidade</span>
                      <strong>{currencyFormatter.format(lucroEstimadoPorUnidade)}</strong>
                    </div>
                    <div className="scenario-item">
                      <span>Lucro estimado total</span>
                      <strong>{currencyFormatter.format(lucroEstimadoTotal)}</strong>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="empty-result">
                <p>Preencha os campos obrigatórios e clique em calcular para visualizar o preço justo.</p>
              </div>
            )}

            <section className="cost-section" aria-labelledby="registered-costs-title">
              <div className="cost-section-heading">
                <div>
                  <span className="panel-kicker">Despesas</span>
                  <h3 id="registered-costs-title">Custos registrados</h3>
                </div>
                <div className="cost-total" aria-live="polite">
                  <span>Total que entra no cálculo</span>
                  <strong>{currencyFormatter.format(getCostsTotal(state.costs))}</strong>
                </div>
              </div>

              <p className="cost-calculation-note">
                Esse total é somado ao preço justo. Não cadastre aqui despesas que já informou nos campos do cálculo.
              </p>

              <CostHistory
                costs={state.costs || []}
                editingCostId={editingCostId}
                onEdit={startEditingCost}
                onDelete={deleteCost}
              />

              <form className="cost-form" onSubmit={addCost}>
                <h4>{editingCostId ? 'Editar custo' : 'Adicionar custo'}</h4>
                <div className="cost-form-fields">
                  <label>
                    Nome do custo
                    <input type="text" value={costName} onChange={(e) => setCostName(e.target.value)} placeholder="Ex.: Embalagens" required />
                  </label>
                  <label>
                    Categoria
                    <select value={costCategory} onChange={(e) => setCostCategory(e.target.value)}>
                      {editingCostId && !costCategories.some((category) => category.value === costCategory) && (
                        <option value={costCategory}>{getCostCategoryLabel(costCategory)}</option>
                      )}
                      {costCategories.map((category) => (
                        <option value={category.value} key={category.value}>{category.label}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Valor (R$)
                    <div className="cost-value-input">
                      <span aria-hidden="true">R$</span>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={costValue}
                        onChange={(e) => setCostValue(e.target.value)}
                        placeholder="0,00"
                        aria-label="Valor do custo em reais"
                        required
                      />
                    </div>
                  </label>
                </div>
                {costError && <p className="cost-form-error" role="alert">{costError}</p>}
                <div className="cost-form-actions">
                  <button className="btn secondary" type="submit">
                    {editingCostId ? 'Salvar alterações' : 'Adicionar custo'}
                  </button>
                  {editingCostId && (
                    <button className="cost-cancel-button" type="button" onClick={resetCostForm}>
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </section>
          </div>
        </div>
      </article>
    </section>
  );
}

function CostHistory({ costs, editingCostId, onEdit, onDelete }) {
  if (!costs?.length) {
    return (
      <p className="cost-empty-state">
        Nenhum custo registrado ainda. Adicione o primeiro custo abaixo.
      </p>
    );
  }

  return (
    <div className="cost-history">
      {(costs || []).map((cost) => (
        <div className={`cost-history-row${editingCostId === cost.id ? ' is-editing' : ''}`} key={cost.id}>
          <div className="cost-history-description">
            <strong>{cost.nome}</strong>
            <span>{getCostCategoryLabel(cost.categoria)}</span>
          </div>
          <strong className="cost-history-value">{currencyFormatter.format(parseCostAmount(cost.valor) || 0)}</strong>
          <div className="cost-history-actions">
            <button type="button" onClick={() => onEdit(cost)} aria-label={`Editar ${cost.nome}`}>
              Editar
            </button>
            <button type="button" onClick={() => onDelete(cost.id)} aria-label={`Excluir ${cost.nome}`}>
              Excluir
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function getCostsTotal(costs = []) {
  return (Array.isArray(costs) ? costs : []).reduce((total, cost) => {
    const amount = parseCostAmount(cost.valor);
    return total + (Number.isFinite(amount) ? amount : 0);
  }, 0);
}
