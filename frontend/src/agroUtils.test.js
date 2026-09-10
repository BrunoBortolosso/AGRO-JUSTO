import { describe, expect, it } from 'vitest';
import {
  calculatePrice,
  normalizeQuantity,
  addPriceHistory,
  aggregateCosts,
  getReferenceUnit,
  evaluatePasswordStrength,
  calculateRentalDurationDays,
} from './agroUtils.js';

describe('agroUtils', () => {
  it('calcula o preço com multiplicadores de oferta, demanda, transporte e margem', () => {
    const price = calculatePrice({
      basePrice: 100,
      oferta: 2,
      demanda: 3,
      transporte: 4,
      margem: 5,
      costs: [{ valor: 8 }, { valor: 2 }],
    });

    expect(price).toBe(619);
  });

  it('normaliza quantidade inválida para um mínimo útil', () => {
    expect(normalizeQuantity(0)).toBe(1);
    expect(normalizeQuantity(-2)).toBe(1);
    expect(normalizeQuantity(7)).toBe(7);
  });

  it('limita o histórico de precificações às 20 simulações mais recentes', () => {
    const history = new Array(25).fill(null).map((_, index) => ({ id: index, price: index }));
    const next = addPriceHistory(history, { id: 25, price: 25 }, 20);

    expect(next).toHaveLength(20);
    expect(next[0]).toEqual({ id: 25, price: 25 });
  });

  it('agrega o total de custos de forma estável', () => {
    expect(aggregateCosts([{ valor: 12 }, { valor: 18 }, { valor: 10 }])).toBe(40);
  });

  it('preserva a referência de saca de 60 kg quando a unidade for sacas', () => {
    expect(getReferenceUnit('saca_60kg')).toBe('saca_60kg');
    expect(getReferenceUnit('kg')).toBe('kg');
  });

  it('classifica a força da senha com base em regra simples', () => {
    expect(evaluatePasswordStrength('12345').level).toBe('fraca');
    expect(evaluatePasswordStrength('Abc123!').level).toBe('forte');
  });

  it('conta os dias de aluguel de forma inclusiva', () => {
    expect(calculateRentalDurationDays('2026-09-10', '2026-09-12')).toBe(3);
  });
});
