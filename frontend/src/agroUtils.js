export function validateFairPriceForm(form = {}) {
  const requiredFields = [
    { key: 'semente', label: 'Semente' },
    { key: 'veneno', label: 'Veneno/Defensivo' },
    { key: 'adubo', label: 'Adubo' },
    { key: 'frete', label: 'Frete' },
    { key: 'quantidadeSacas', label: 'Quantidade de sacas' },
    { key: 'lucroDesejado', label: 'Lucro desejado' },
  ];

  const optionalFields = [
    { key: 'irrigacao', label: 'Irrigação' },
    { key: 'plantacaoAluguel', label: 'Aluguel de máquina da plantação' },
    { key: 'plantacaoCombustivel', label: 'Combustível da plantação' },
    { key: 'plantacaoDiaria', label: 'Valor da diária da mão de obra da plantação' },
    { key: 'plantacaoDias', label: 'Dias trabalhados na plantação' },
    { key: 'colheitaAluguel', label: 'Aluguel de máquina da colheita' },
    { key: 'colheitaCombustivel', label: 'Combustível da colheita' },
    { key: 'colheitaDiaria', label: 'Valor da diária da mão de obra da colheita' },
    { key: 'colheitaDias', label: 'Dias trabalhados na colheita' },
  ];

  const values = {};

  for (const field of requiredFields) {
    const raw = form[field.key];
    const parsed = Number(raw);

    if (raw === '' || raw === null || raw === undefined) {
      return { isValid: false, error: `${field.label} é obrigatório.` };
    }

    if (!Number.isFinite(parsed) || parsed < 0) {
      return { isValid: false, error: `${field.label} deve ser um valor válido e não negativo.` };
    }

    values[field.key] = parsed;
  }

  for (const field of optionalFields) {
    const raw = form[field.key];
    if (raw === '' || raw === null || raw === undefined) {
      values[field.key] = 0;
      continue;
    }

    const parsed = Number(raw);
    if (!Number.isFinite(parsed) || parsed < 0) {
      return { isValid: false, error: `${field.label} deve ser um valor válido e não negativo.` };
    }

    values[field.key] = parsed;
  }

  if (values.quantidadeSacas <= 0) {
    return { isValid: false, error: 'A quantidade de sacas deve ser maior que zero.' };
  }

  if (values.lucroDesejado < 0 || values.lucroDesejado > 100) {
    return { isValid: false, error: 'A porcentagem de lucro desejado deve estar entre 0% e 100%.' };
  }

  return { isValid: true, values };
}

export function calculatePrice({ basePrice = 0, oferta = 1, demanda = 1, transporte = 0, margem = 0, costs = [] } = {}) {
  const ofertaValue = Number(oferta) || 1;
  const demandaValue = Number(demanda) || 1;
  const transporteValue = Number(transporte) || 0;
  const margemValue = Number(margem) || 0;
  const costTotal = aggregateCosts(costs);

  return Math.round((Number(basePrice) * ofertaValue * demandaValue) + transporteValue + margemValue + costTotal);
}

export function calculateFairPrice({
  semente = 0,
  veneno = 0,
  adubo = 0,
  irrigacao = 0,
  plantacaoAluguel = 0,
  plantacaoCombustivel = 0,
  plantacaoDiaria = 0,
  plantacaoDias = 0,
  colheitaAluguel = 0,
  colheitaCombustivel = 0,
  colheitaDiaria = 0,
  colheitaDias = 0,
  frete = 0,
  quantidadeSacas = 0,
  lucroDesejado = 0,
} = {}) {
  const toNumber = (value) => Number(value || 0);

  const insumos = toNumber(semente) + toNumber(veneno) + toNumber(adubo) + toNumber(irrigacao);
  const maoObraPlantacao = toNumber(plantacaoDiaria) * toNumber(plantacaoDias);
  const maoObraColheita = toNumber(colheitaDiaria) * toNumber(colheitaDias);
  const plantacao = toNumber(plantacaoAluguel) + toNumber(plantacaoCombustivel) + maoObraPlantacao;
  const colheita = toNumber(colheitaAluguel) + toNumber(colheitaCombustivel) + maoObraColheita + toNumber(frete);
  const prodTotal = insumos + plantacao + colheita;
  const qtdSacas = toNumber(quantidadeSacas);
  const precoSaca = qtdSacas > 0 ? prodTotal / qtdSacas : 0;
  const percentualLucro = toNumber(lucroDesejado) / 100;
  const valorFinalSaca = precoSaca + (precoSaca * percentualLucro);
  const rendimentoTotal = valorFinalSaca * qtdSacas;

  return {
    insumos,
    plantacao,
    colheita,
    prodTotal,
    precoSaca,
    valorFinalSaca,
    rendimentoTotal,
    maoObraPlantacao,
    maoObraColheita,
    percentualLucro,
  };
}

export function normalizeQuantity(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 1) return 1;
  return parsed;
}

export function addPriceHistory(history = [], entry, limit = 20) {
  const next = [entry, ...(history || [])];
  return next.slice(0, limit);
}

export function aggregateCosts(costs = []) {
  return (costs || []).reduce((sum, cost) => sum + Number(cost.valor || 0), 0);
}

export function getReferenceUnit(unit) {
  const normalized = String(unit || '').toLowerCase().trim();
  if (normalized === 'saca_60kg' || normalized === 'saca' || normalized === 'sacas') {
    return 'saca_60kg';
  }
  return 'kg';
}

export function evaluatePasswordStrength(password = '') {
  let score = 0;
  if (password.length >= 6) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score >= 4) return { level: 'forte', score };
  if (score >= 2) return { level: 'media', score };
  return { level: 'fraca', score };
}

export function calculateRentalDurationDays(start, end) {
  if (!start || !end) return 0;

  const startDate = new Date(start + 'T00:00:00');
  const endDate = new Date(end + 'T00:00:00');

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) return 0;

  const time = endDate.getTime() - startDate.getTime();
  if (time < 0) return 0;

  return Math.round(time / 86400000) + 1;
}
