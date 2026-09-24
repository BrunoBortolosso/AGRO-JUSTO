import { createContext, useContext, useMemo, useReducer, useEffect, createElement } from 'react';
import placeholderImage from './assets/images/agro-placeholder.svg';

export const AgroContext = createContext(null);

export const storageKeys = {
  auth: 'agrojusto.auth',
  users: 'agrojusto.users',
  profile: 'agrojusto.profile',
  products: 'agrojusto.products',
  machines: 'agrojusto.machines',
  rentals: 'agrojusto.rentals',
  costs: 'agrojusto.costs',
  pricing: 'agrojusto.pricingHistory'
};

export const defaultProfile = {
  nome: 'Produtor AgroJusto',
  regiao: 'Regiao nao informada',
  bio: 'Atualize seu perfil para personalizar o painel.',
  foto: 'https://images.unsplash.com/photo-1592878849122-5f7735d83654?auto=format&fit=crop&w=240&q=80'
};

export const demoUser = {
  nome: 'Produtor AgroJusto',
  email: 'produtor@agrojusto.com',
  senha: '123456',
  profile: defaultProfile
};

export const defaultProducts = [
  { id: 'p1', nome: 'Milho', quantidade: 48, unidade: 'saca_60kg', cultivo: 'convencional', regiao: 'Zona rural - Campinas', preco: 71, categoria: 'Grãos', organico: false, imagem: placeholderImage },
  { id: 'p2', nome: 'Soja', quantidade: 55, unidade: 'saca_60kg', cultivo: 'convencional', regiao: 'Zona rural - Ribeirao Preto', preco: 132, categoria: 'Grãos', organico: false, imagem: placeholderImage },
  { id: 'p3', nome: 'Feijao Carioca', quantidade: 22, unidade: 'saca_60kg', cultivo: 'convencional', regiao: 'Zona rural - Goiania', preco: 245, categoria: 'Leguminosas', organico: false, imagem: placeholderImage }
];

export const defaultMachines = [
  { id: 'm1', nome: 'Trator 4x4', tipo: 'trator', status: 'disponivel', imagem: '', diaria: 160, locacao: '2 dias', codigo: 'TR-001', descricao: 'Trator leve para preparo de solo', localizacao: 'Campinas', proprietario: 'Produtor AgroJusto' },
  { id: 'm2', nome: 'Plantadeira', tipo: 'plantadeira', status: 'alugada', imagem: '', diaria: 180, locacao: '1 dia', codigo: 'PL-002', descricao: 'Plantadeira para cultura de milho', localizacao: 'Ribeirao Preto', proprietario: 'Produtor AgroJusto' }
];

export const defaultCosts = [
  { id: 'c1', nome: 'Semeadura', valor: 12, categoria: 'Operacao' },
  { id: 'c2', nome: 'Transporte', valor: 18, categoria: 'Logistica' }
];

export const defaultPricing = [
  { id: 'r1', produto: 'Milho', preco: 71, data: new Date().toISOString(), margem: 12, demanda: 1, oferta: 1 }
];

export function readJSON(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function initialState() {
  return {
    auth: readJSON(storageKeys.auth, null),
    users: readJSON(storageKeys.users, [demoUser]),
    profile: readJSON(storageKeys.profile, defaultProfile),
    products: readJSON(storageKeys.products, defaultProducts),
    machines: readJSON(storageKeys.machines, defaultMachines),
    rentals: readJSON(storageKeys.rentals, []),
    costs: readJSON(storageKeys.costs, defaultCosts),
    pricing: readJSON(storageKeys.pricing, defaultPricing),
    activeTab: 'inicio',
    authMode: 'login',
    authMessage: ''
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case 'setAuthMode': return { ...state, authMode: action.mode };
    case 'setAuthMessage': return { ...state, authMessage: action.message };
    case 'register': {
      const profile = action.user?.profile || state.profile || defaultProfile;
      return {
        ...state,
        users: [...state.users, action.user],
        auth: { ...action.user, profile },
        profile,
        authMode: 'login',
        authMessage: ''
      };
    }
    case 'login': {
      const profile = action.user?.profile || state.profile || defaultProfile;
      return {
        ...state,
        auth: { ...action.user, profile },
        profile,
        authMode: 'login',
        authMessage: ''
      };
    }
    case 'logout': return { ...state, auth: null, authMessage: '' };
    case 'setTab': return { ...state, activeTab: action.tab };
    case 'setProducts': return { ...state, products: action.products };
    case 'setMachines': return { ...state, machines: action.machines };
    case 'setCosts': return { ...state, costs: action.costs };
    case 'setRentals': return { ...state, rentals: action.rentals };
    case 'setPricing': return { ...state, pricing: action.pricing };
    case 'setProfile': {
      const profile = action.profile || state.profile || defaultProfile;
      return {
        ...state,
        profile,
        auth: state.auth ? { ...state.auth, profile } : state.auth
      };
    }
    default: return state;
  }
}

export function AgroProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);

  useEffect(() => {
    writeJSON(storageKeys.users, state.users);
    writeJSON(storageKeys.profile, state.profile);
    writeJSON(storageKeys.products, state.products);
    writeJSON(storageKeys.machines, state.machines);
    writeJSON(storageKeys.rentals, state.rentals);
    writeJSON(storageKeys.costs, state.costs);
    writeJSON(storageKeys.pricing, state.pricing);

    if (state.auth) {
      writeJSON(storageKeys.auth, state.auth);
    } else {
      localStorage.removeItem(storageKeys.auth);
    }
  }, [state]);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return createElement(AgroContext.Provider, { value }, children);
}

export function useAgro() {
  return useContext(AgroContext);
}
