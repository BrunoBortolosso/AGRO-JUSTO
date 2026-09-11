export function calculatePrice({ basePrice = 0, oferta = 1, demanda = 1, transporte = 0, margem = 0, costs = [] } = {}) {
  const ofertaValue = Number(oferta) || 1;
  const demandaValue = Number(demanda) || 1;
  const transporteValue = Number(transporte) || 0;
  const margemValue = Number(margem) || 0;
  const costTotal = aggregateCosts(costs);

  return Math.round((Number(basePrice) * ofertaValue * demandaValue) + transporteValue + margemValue + costTotal);
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
