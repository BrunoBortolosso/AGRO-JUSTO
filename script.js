const storageKeys = {
  auth: "agrojusto.auth",
  users: "agrojusto.users",
  profile: "agrojusto.profile",
  products: "agrojusto.products",
  machines: "agrojusto.machines",
  rentals: "agrojusto.rentals",
  costs: "agrojusto.costs",
  pricing: "agrojusto.pricingHistory"
};

const demoLogin = {
  email: "produtor@agrojusto.com",
  senha: "123456"
};

const BRAZIL_SACK_PRICE_REFERENCE = {
  soja: 132,
  milho: 71,
  feijao: 245,
  arroz: 118,
  trigo: 82,
  cafe: 1120,
  sorgo: 64,
  cevada: 86,
  girassol: 95
};

const MACHINE_FALLBACK_IMAGE =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#e8f3eb"/><stop offset="100%" stop-color="#d2e8d8"/></linearGradient></defs><rect width="800" height="500" fill="url(#g)"/><rect x="0" y="360" width="800" height="140" fill="#9cc19f"/><circle cx="220" cy="360" r="70" fill="#2d3b35"/><circle cx="220" cy="360" r="34" fill="#74857d"/><circle cx="520" cy="372" r="92" fill="#2d3b35"/><circle cx="520" cy="372" r="45" fill="#74857d"/><rect x="210" y="220" width="290" height="95" rx="14" fill="#2e7d4f"/><rect x="320" y="155" width="130" height="90" rx="12" fill="#3e9360"/><rect x="338" y="170" width="76" height="46" rx="8" fill="#c5ebe0"/><rect x="500" y="240" width="120" height="32" rx="8" fill="#8a5c3b"/><rect x="160" y="292" width="210" height="24" rx="8" fill="#3d4f46"/><text x="400" y="90" text-anchor="middle" font-family="Arial, sans-serif" font-size="34" fill="#2f5f45" font-weight="bold">AgroJusto</text><text x="400" y="125" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="#3b6e52">Imagem de maquina indisponivel</text></svg>'
  );

const PRODUCT_FALLBACK_IMAGE =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500"><defs><linearGradient id="p" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#edf7ef"/><stop offset="100%" stop-color="#d8ebdc"/></linearGradient></defs><rect width="800" height="500" fill="url(#p)"/><rect x="0" y="350" width="800" height="150" fill="#a8c9ac"/><circle cx="160" cy="365" r="70" fill="#78a66f"/><circle cx="260" cy="335" r="55" fill="#7eb074"/><circle cx="350" cy="370" r="75" fill="#6d9f65"/><circle cx="470" cy="340" r="60" fill="#82b97b"/><circle cx="580" cy="365" r="68" fill="#73a36c"/><text x="400" y="110" text-anchor="middle" font-family="Arial, sans-serif" font-size="34" fill="#2f5f45" font-weight="bold">AgroJusto</text><text x="400" y="145" text-anchor="middle" font-family="Arial, sans-serif" font-size="23" fill="#3b6e52">Imagem de produto indisponivel</text></svg>'
  );

const PRODUCT_IMAGE_BY_KEY = {
  milho: "https://loremflickr.com/900/600/corn,farm?lock=101",
  soja: "https://loremflickr.com/900/600/soybean,farm?lock=102",
  feijao: "https://loremflickr.com/900/600/beans,agriculture?lock=103",
  arroz: "https://loremflickr.com/900/600/rice,farm?lock=104",
  trigo: "https://loremflickr.com/900/600/wheat,farm?lock=105",
  cafe: "https://loremflickr.com/900/600/coffee,farm?lock=106",
  sorgo: "https://loremflickr.com/900/600/sorghum,grain?lock=107",
  cevada: "https://loremflickr.com/900/600/barley,farm?lock=108",
  girassol: "https://loremflickr.com/900/600/sunflower,farm?lock=109",
  tomate: "https://loremflickr.com/900/600/tomato,organic?lock=110",
  alface: "https://loremflickr.com/900/600/lettuce,farm?lock=111",
  batata: "https://loremflickr.com/900/600/potato,farm?lock=112",
  cebola: "https://loremflickr.com/900/600/onion,farm?lock=113",
  mandioca: "https://loremflickr.com/900/600/cassava,farm?lock=114",
  laranja: "https://loremflickr.com/900/600/orange,orchard?lock=115",
  banana: "https://loremflickr.com/900/600/banana,farm?lock=116",
  cana: "https://loremflickr.com/900/600/sugarcane,farm?lock=117",
  uva: "https://loremflickr.com/900/600/grape,vineyard?lock=118"
};

const MACHINE_IMAGE_BY_KEY = {
  john: "https://loremflickr.com/900/600/john,deere,tractor?lock=201",
  trator: "https://loremflickr.com/900/600/tractor,farm?lock=202",
  plantadeira: "https://loremflickr.com/900/600/planter,farm?lock=203",
  grade: "https://loremflickr.com/900/600/disc,harrow,farm?lock=204",
  subsolador: "https://loremflickr.com/900/600/subsoiler,tractor?lock=205",
  pulverizador: "https://loremflickr.com/900/600/sprayer,farm?lock=206",
  colheitadeira: "https://loremflickr.com/900/600/harvester,farm?lock=207",
  semeadeira: "https://loremflickr.com/900/600/seeder,farm?lock=208"
};

const defaultProfile = {
  nome: "Produtor AgroJusto",
  regiao: "Regiao nao informada",
  bio: "Atualize seu perfil para personalizar o painel.",
  foto: "https://images.unsplash.com/photo-1592878849122-5f7735d83654?auto=format&fit=crop&w=240&q=80"
};

const defaultProducts = [
  {
    id: crypto.randomUUID(),
    nome: "Milho",
    quantidade: 48,
    unidade: "saca_60kg",
    cultivo: "convencional",
    regiao: "Zona rural - Campinas",
    preco: 71
  },
  {
    id: crypto.randomUUID(),
    nome: "Soja",
    quantidade: 55,
    unidade: "saca_60kg",
    cultivo: "convencional",
    regiao: "Zona rural - Ribeirao Preto",
    preco: 132
  },
  {
    id: crypto.randomUUID(),
    nome: "Feijao Carioca",
    quantidade: 22,
    unidade: "saca_60kg",
    cultivo: "convencional",
    regiao: "Zona rural - Goiania",
    preco: 245
  },
  {
    id: crypto.randomUUID(),
    nome: "Arroz",
    quantidade: 40,
    unidade: "saca_60kg",
    cultivo: "convencional",
    regiao: "Zona rural - Pelotas",
    preco: 118
  },
  {
    id: crypto.randomUUID(),
    nome: "Trigo",
    quantidade: 37,
    unidade: "saca_60kg",
    cultivo: "convencional",
    regiao: "Zona rural - Passo Fundo",
    preco: 82
  },
  {
    id: crypto.randomUUID(),
    nome: "Sorgo",
    quantidade: 26,
    unidade: "saca_60kg",
    cultivo: "convencional",
    regiao: "Zona rural - Uberlandia",
    preco: 64
  },
  {
    id: crypto.randomUUID(),
    nome: "Cevada",
    quantidade: 18,
    unidade: "saca_60kg",
    cultivo: "convencional",
    regiao: "Zona rural - Guarapuava",
    preco: 86
  },
  {
    id: crypto.randomUUID(),
    nome: "Cafe Arabica",
    quantidade: 30,
    unidade: "saca_60kg",
    cultivo: "convencional",
    regiao: "Zona rural - Varginha",
    preco: 1120
  },
  {
    id: crypto.randomUUID(),
    nome: "Girassol",
    quantidade: 14,
    unidade: "saca_60kg",
    cultivo: "convencional",
    regiao: "Zona rural - Campo Grande",
    preco: 95
  },
  {
    id: crypto.randomUUID(),
    nome: "Tomate",
    quantidade: 120,
    unidade: "caixa",
    cultivo: "organico",
    regiao: "Zona rural - Atibaia",
    preco: 39
  },
  {
    id: crypto.randomUUID(),
    nome: "Alface",
    quantidade: 900,
    unidade: "un",
    cultivo: "organico",
    regiao: "Zona rural - Ibiuna",
    preco: 2.8
  },
  {
    id: crypto.randomUUID(),
    nome: "Batata",
    quantidade: 780,
    unidade: "kg",
    cultivo: "convencional",
    regiao: "Zona rural - Piedade",
    preco: 5.1
  },
  {
    id: crypto.randomUUID(),
    nome: "Cebola",
    quantidade: 640,
    unidade: "kg",
    cultivo: "convencional",
    regiao: "Zona rural - Monte Alto",
    preco: 4.7
  },
  {
    id: crypto.randomUUID(),
    nome: "Mandioca",
    quantidade: 530,
    unidade: "kg",
    cultivo: "convencional",
    regiao: "Zona rural - Araraquara",
    preco: 3.9
  },
  {
    id: crypto.randomUUID(),
    nome: "Laranja Pera",
    quantidade: 210,
    unidade: "caixa",
    cultivo: "convencional",
    regiao: "Zona rural - Limeira",
    preco: 33
  },
  {
    id: crypto.randomUUID(),
    nome: "Banana Nanica",
    quantidade: 470,
    unidade: "kg",
    cultivo: "convencional",
    regiao: "Zona rural - Registro",
    preco: 6.3
  },
  {
    id: crypto.randomUUID(),
    nome: "Cana de Acucar",
    quantidade: 390,
    unidade: "t",
    cultivo: "convencional",
    regiao: "Zona rural - Piracicaba",
    preco: 148
  },
  {
    id: crypto.randomUUID(),
    nome: "Uva Niagra",
    quantidade: 85,
    unidade: "caixa",
    cultivo: "organico",
    regiao: "Zona rural - Jundiai",
    preco: 54
  }
];

const defaultMachines = [
  {
    id: crypto.randomUUID(),
    nome: "Trator John Deere 5075E",
    preco: 480,
    tipo: "trator",
    condicoes: "Devolver com tanque cheio e limpo",
    dias: "seg, ter, qua, qui",
    status: "disponivel",
    imagem: "https://loremflickr.com/900/600/john,deere,tractor?lock=201"
  },
  {
    id: crypto.randomUUID(),
    nome: "Plantadeira de Precisao 7 linhas",
    preco: 320,
    tipo: "implemento",
    condicoes: "Regular taxa de sementes antes do uso",
    dias: "seg, qua, sex",
    status: "disponivel",
    imagem: "https://loremflickr.com/900/600/planter,farm?lock=203"
  },
  {
    id: crypto.randomUUID(),
    nome: "Grade Aradora 14 discos",
    preco: 210,
    tipo: "implemento",
    condicoes: "Uso em solo sem pedras grandes",
    dias: "ter, qui, sab",
    status: "disponivel",
    imagem: "https://loremflickr.com/900/600/disc,harrow,farm?lock=204"
  },
  {
    id: crypto.randomUUID(),
    nome: "Subsolador 5 hastes",
    preco: 240,
    tipo: "implemento",
    condicoes: "Nao exceder profundidade de 45 cm",
    dias: "seg, ter, sex",
    status: "disponivel",
    imagem: "https://loremflickr.com/900/600/subsoiler,tractor?lock=205"
  },
  {
    id: crypto.randomUUID(),
    nome: "Pulverizador Costal",
    preco: 45,
    tipo: "ferramenta",
    condicoes: "Uso com EPI obrigatorio",
    dias: "qui, sex",
    status: "alugado",
    imagem: "https://loremflickr.com/900/600/sprayer,farm?lock=206"
  },
  {
    id: crypto.randomUUID(),
    nome: "Colheitadeira de Graos",
    preco: 890,
    tipo: "implemento",
    condicoes: "Operador experiente e check-list obrigatorio",
    dias: "qua, qui, sex",
    status: "disponivel",
    imagem: "https://loremflickr.com/900/600/harvester,farm?lock=207"
  }
];

let chartCustos;
let chartPreco;

const state = {
  auth: normalizeAuth(readData(storageKeys.auth, { loggedIn: false, email: "" })),
  users: readData(storageKeys.users, []),
  profile: readData(storageKeys.profile, defaultProfile),
  products: readData(storageKeys.products, defaultProducts),
  machines: readData(storageKeys.machines, defaultMachines),
  rentals: readData(storageKeys.rentals, []),
  costs: readData(storageKeys.costs, []),
  pricingHistory: readData(storageKeys.pricing, [])
};

function readData(key, fallback) {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function normalizeAuth(auth) {
  if (!auth || auth.loggedIn !== true || typeof auth.email !== "string") {
    return { loggedIn: false, email: "" };
  }
  return { loggedIn: true, email: auth.email.trim().toLowerCase() };
}

function writeData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function money(value) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value || 0);
}

function normalizeProductName(name) {
  return (name || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 ]/g, "")
    .trim();
}

function findSackReferencePrice(productName) {
  const normalized = normalizeProductName(productName);
  const entries = Object.entries(BRAZIL_SACK_PRICE_REFERENCE);
  for (const [key, price] of entries) {
    if (normalized.includes(key)) return price;
  }
  return 0;
}

function findImageByName(name, map, fallback) {
  const normalized = normalizeProductName(name);
  const entries = Object.entries(map);
  for (const [key, image] of entries) {
    if (normalized.includes(key)) return image;
  }
  return fallback;
}

function resolveProductImage(name, customImage) {
  return customImage || findImageByName(name, PRODUCT_IMAGE_BY_KEY, PRODUCT_FALLBACK_IMAGE);
}

function resolveMachineImage(name, customImage) {
  return customImage || findImageByName(name, MACHINE_IMAGE_BY_KEY, MACHINE_FALLBACK_IMAGE);
}

function ensureCatalogMedia() {
  state.products = state.products.map((product) => ({
    ...product,
    imagem: resolveProductImage(product.nome, product.imagem)
  }));

  state.machines = state.machines.map((machine) => ({
    ...machine,
    imagem: resolveMachineImage(machine.nome, machine.imagem)
  }));

  writeData(storageKeys.products, state.products);
  writeData(storageKeys.machines, state.machines);
}

function setAuthMessage(message, isError) {
  const node = document.getElementById("authMessage");
  node.textContent = message;
  node.classList.remove("hidden");
  node.style.borderColor = isError ? "#f1c3c3" : "#c2d8cd";
  node.style.color = isError ? "#9e2222" : "#305a43";
}

function updateHeaderUser() {
  const userChip = document.getElementById("loggedUser");
  userChip.textContent = state.profile.nome;
}

function applyAuthState() {
  const appShell = document.getElementById("appShell");
  const authGate = document.getElementById("authGate");
  const btnLogout = document.getElementById("btnLogout");
  const openProfile = document.getElementById("openProfileModal");
  const userChip = document.getElementById("loggedUser");

  if (state.auth.loggedIn === true) {
    appShell.classList.remove("hidden");
    authGate.classList.add("hidden");
    btnLogout.classList.remove("hidden");
    openProfile.classList.remove("hidden");
    userChip.classList.remove("hidden");
  } else {
    appShell.classList.add("hidden");
    authGate.classList.remove("hidden");
    btnLogout.classList.add("hidden");
    openProfile.classList.add("hidden");
    userChip.classList.add("hidden");
  }
}

function getPasswordStrength(password) {
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);
  const types = [hasLower, hasUpper, hasNumber, hasSymbol].filter(Boolean).length;

  if (password.length < 8 || types <= 1) return { level: "fraca", score: 1 };
  if (password.length < 10 || types < 4) return { level: "media", score: 2 };
  return { level: "forte", score: 3 };
}

function updatePasswordStrength(password) {
  const strength = getPasswordStrength(password);
  const container = document.getElementById("passwordStrength");
  const text = document.getElementById("passwordStrengthText");
  const bar = container.querySelector("span");

  container.className = `password-strength ${strength.level}`;
  bar.style.width = `${strength.score * 33.333}%`;
  text.textContent = password ? `Senha ${strength.level}` : "Digite uma senha";
}

function finishLogin(account) {
  state.auth = { loggedIn: true, email: account.email };
  writeData(storageKeys.auth, state.auth);
  state.profile = { ...state.profile, nome: account.nome };
  writeData(storageKeys.profile, state.profile);
  setAuthMessage("Login realizado com sucesso.", false);
  updateHeaderUser();
  applyAuthState();
  refreshPanel();
}

function login(email, senha) {
  const cleanEmail = email.trim().toLowerCase();
  const account = state.users.find((user) => user.email === cleanEmail && user.senha === senha);

  if (cleanEmail === demoLogin.email && senha === demoLogin.senha) {
    finishLogin({ email: cleanEmail, nome: "Produtor AgroJusto" });
    return;
  }

  if (account) {
    finishLogin(account);
    return;
  }

  setAuthMessage("E-mail ou senha invalidos.", true);
}

function registerAccount(nome, email, senha, confirmacao) {
  const cleanName = nome.trim();
  const cleanEmail = email.trim().toLowerCase();
  const strength = getPasswordStrength(senha);

  if (state.users.some((user) => user.email === cleanEmail) || cleanEmail === demoLogin.email) {
    setAuthMessage("Este e-mail ja possui uma conta.", true);
    return;
  }
  if (strength.level === "fraca") {
    setAuthMessage("Escolha uma senha media ou forte.", true);
    return;
  }
  if (senha !== confirmacao) {
    setAuthMessage("As senhas nao coincidem.", true);
    return;
  }

  const account = { id: crypto.randomUUID(), nome: cleanName, email: cleanEmail, senha };
  state.users.push(account);
  writeData(storageKeys.users, state.users);
  finishLogin(account);
}

function setAuthMode(mode) {
  const isRegister = mode === "register";
  document.getElementById("loginForm").classList.toggle("hidden", isRegister);
  document.getElementById("registerForm").classList.toggle("hidden", !isRegister);
  document.getElementById("loginMode").classList.toggle("active", !isRegister);
  document.getElementById("registerMode").classList.toggle("active", isRegister);
  document.getElementById("loginMode").setAttribute("aria-selected", String(!isRegister));
  document.getElementById("registerMode").setAttribute("aria-selected", String(isRegister));
  document.getElementById("authTitle").textContent = isRegister ? "Criar sua conta" : "Entrar no AgroJusto";
  document.getElementById("authSubtitle").textContent = isRegister
    ? "Salve seus dados para acessar o painel do produtor."
    : "Acesse sua conta para cuidar da sua producao.";
  document.getElementById("authMessage").classList.add("hidden");
}

function setupAuth() {
  document.getElementById("loginForm").addEventListener("submit", (event) => {
    event.preventDefault();
    login(document.getElementById("loginEmail").value, document.getElementById("loginSenha").value);
  });

  document.getElementById("registerForm").addEventListener("submit", (event) => {
    event.preventDefault();
    registerAccount(
      document.getElementById("registerName").value,
      document.getElementById("registerEmail").value,
      document.getElementById("registerPassword").value,
      document.getElementById("registerPasswordConfirm").value
    );
  });

  document.getElementById("registerPassword").addEventListener("input", (event) => {
    updatePasswordStrength(event.target.value);
  });
  document.getElementById("loginMode").addEventListener("click", () => setAuthMode("login"));
  document.getElementById("registerMode").addEventListener("click", () => setAuthMode("register"));

  document.getElementById("btnDemoLogin").addEventListener("click", () => {
    setAuthMode("login");
    document.getElementById("loginEmail").value = demoLogin.email;
    document.getElementById("loginSenha").value = demoLogin.senha;
    login(demoLogin.email, demoLogin.senha);
  });

  document.getElementById("btnLogout").addEventListener("click", () => {
    state.auth = { loggedIn: false, email: "" };
    writeData(storageKeys.auth, state.auth);
    applyAuthState();
  });

  updatePasswordStrength("");
  updateHeaderUser();
  applyAuthState();
}

function setupTabs() {
  const tabs = document.querySelectorAll(".tab-btn");
  const panels = document.querySelectorAll(".tab-panel");

  tabs.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.tab;
      tabs.forEach((tab) => tab.classList.remove("active"));
      panels.forEach((panel) => panel.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(target).classList.add("active");

      if (target === "painel") refreshPanel();
    });
  });

  document.querySelectorAll("[data-go]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.go;
      document.querySelector(`.tab-btn[data-tab="${target}"]`).click();
    });
  });
}

function pricingMultiplier(oferta, demanda) {
  if (oferta === "alta" && demanda === "baixa") return 0.92;
  if (oferta === "baixa" && demanda === "alta") return 1.26;
  if (oferta === "alta" && demanda === "media") return 0.98;
  if (oferta === "media" && demanda === "alta") return 1.14;
  return 1;
}

function calculatePricing() {
  const nonNegativeNumber = (id) => Math.max(0, Number(document.getElementById(id).value) || 0);
  const insumos = nonNegativeNumber("insumos");
  const mao = nonNegativeNumber("maoDeObra");
  const transporteBase = nonNegativeNumber("transporteBase");
  const manutencao = nonNegativeNumber("manutencao");
  const distancia = nonNegativeNumber("distanciaKm");
  const custoKm = nonNegativeNumber("custoKm");
  const quantidade = nonNegativeNumber("quantidadeProduzida");
  const margem = nonNegativeNumber("margemLucro");
  const oferta = document.getElementById("oferta").value;
  const demanda = document.getElementById("demanda").value;

  if (quantidade <= 0) {
    document.getElementById("resultadoPreco").classList.remove("hidden");
    document.getElementById("resumoMercado").textContent = "Informe uma quantidade produzida maior que zero.";
    return;
  }

  const custoDistancia = distancia * custoKm;
  const custoTotal = insumos + mao + transporteBase + manutencao + custoDistancia;
  const custoUnitario = custoTotal / quantidade;
  const precoMinimo = custoUnitario * (1 + margem / 100);
  const multip = pricingMultiplier(oferta, demanda);
  const precoIdeal = precoMinimo * multip;

  document.getElementById("precoMinimo").textContent = money(precoMinimo);
  document.getElementById("precoIdeal").textContent = money(precoIdeal);
  const ajusteMercado = ((multip - 1) * 100).toFixed(0);
  const sinalAjuste = ajusteMercado > 0 ? "+" : "";
  document.getElementById("resumoMercado").textContent = `Custo total: ${money(custoTotal)} | Custo por unidade: ${money(custoUnitario)} | Ajuste de mercado: ${sinalAjuste}${ajusteMercado}%.`;
  document.getElementById("resultadoPreco").classList.remove("hidden");

  state.pricingHistory.push({
    insumos,
    mao,
    manutencao,
    transporteBase,
    custoDistancia,
    custoTotal,
    quantidade,
    margem,
    custoUnitario,
    precoMinimo,
    precoIdeal,
    oferta,
    demanda,
    createdAt: new Date().toISOString()
  });

  state.pricingHistory = state.pricingHistory.slice(-20);
  writeData(storageKeys.pricing, state.pricingHistory);
  refreshPanel();
}

function renderCosts() {
  const container = document.getElementById("listaCustos");
  const total = state.costs.reduce((sum, cost) => sum + (Number(cost.valor) || 0), 0);
  document.getElementById("totalCustos").textContent = money(total);

  if (!state.costs.length) {
    container.innerHTML = '<p class="muted">Nenhum custo registrado.</p>';
    return;
  }

  container.innerHTML = state.costs
    .slice()
    .reverse()
    .map((cost) => `
      <div class="cost-row">
        <div>
          <strong>${cost.descricao}</strong>
          <p class="muted">${cost.categoriaLabel} | ${cost.data}</p>
        </div>
        <div class="cost-actions">
          <strong>${money(cost.valor)}</strong>
          <button class="btn ghost" type="button" data-delete-cost="${cost.id}">Excluir</button>
        </div>
      </div>
    `)
    .join("");

  container.querySelectorAll("[data-delete-cost]").forEach((button) => {
    button.addEventListener("click", () => {
      state.costs = state.costs.filter((cost) => cost.id !== button.dataset.deleteCost);
      writeData(storageKeys.costs, state.costs);
      renderCosts();
    });
  });
}

function setupCostForm() {
  const dateInput = document.getElementById("custoData");
  dateInput.value = new Date().toISOString().slice(0, 10);

  document.getElementById("formCusto").addEventListener("submit", (event) => {
    event.preventDefault();
    const category = document.getElementById("custoCategoria").value;
    const labels = {
      insumos: "Insumos",
      mao: "Mao de obra",
      transporteBase: "Transporte",
      manutencao: "Manutencao"
    };
    const cost = {
      id: crypto.randomUUID(),
      categoria: category,
      categoriaLabel: labels[category],
      descricao: document.getElementById("custoDescricao").value.trim(),
      valor: Math.max(0, Number(document.getElementById("custoValor").value) || 0),
      data: dateInput.value
    };

    if (!cost.descricao || cost.valor <= 0 || !cost.data) return;
    state.costs.push(cost);
    writeData(storageKeys.costs, state.costs);
    event.target.reset();
    dateInput.value = new Date().toISOString().slice(0, 10);
    renderCosts();
  });

  document.getElementById("btnAplicarCustos").addEventListener("click", () => {
    const totals = { insumos: 0, mao: 0, transporteBase: 0, manutencao: 0 };
    state.costs.forEach((cost) => {
      if (totals[cost.categoria] !== undefined) totals[cost.categoria] += Number(cost.valor) || 0;
    });
    Object.entries(totals).forEach(([field, total]) => {
      document.getElementById(field === "mao" ? "maoDeObra" : field).value = total.toFixed(2);
    });
    document.getElementById("resumoMercado").textContent = "Custos registrados aplicados ao calculo.";
    document.getElementById("resultadoPreco").classList.remove("hidden");
  });
}

function renderProducts() {
  const container = document.getElementById("listaProdutos");

  if (!state.products.length) {
    container.innerHTML = "<p class=\"muted\">Nenhum produto cadastrado ainda.</p>";
    return;
  }

  container.innerHTML = state.products
    .map(
      (item) => `
      <div class="item-row">
        <div class="item-main">
          <img class="item-thumb" src="${item.imagem || PRODUCT_FALLBACK_IMAGE}" alt="${item.nome}" onerror="this.onerror=null;this.src='${PRODUCT_FALLBACK_IMAGE}'">
          <div>
          <strong>${item.nome}</strong>
          <p class="muted">${item.quantidade} ${item.unidade} | ${item.cultivo} | ${item.regiao}</p>
          ${item.unidade === "saca_60kg" && findSackReferencePrice(item.nome) ? `<p class="muted">Referencia media Brasil (saca 60kg): ${money(findSackReferencePrice(item.nome))}</p>` : ""}
          </div>
        </div>
        <div>
          <strong>${item.preco ? money(item.preco) : "Sem preco"}</strong>
          <button class="btn secondary" type="button" data-del-product="${item.id}">Excluir</button>
        </div>
      </div>
    `
    )
    .join("");

  container.querySelectorAll("[data-del-product]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.products = state.products.filter((p) => p.id !== btn.dataset.delProduct);
      writeData(storageKeys.products, state.products);
      renderProducts();
      refreshPanel();
    });
  });
}

function setupProductForm() {
  document.getElementById("formProduto").addEventListener("submit", (event) => {
    event.preventDefault();

    const nome = document.getElementById("produtoNome").value.trim();
    const unidade = document.getElementById("produtoUnidade").value;
    const precoDigitado = Number(document.getElementById("produtoPreco").value) || 0;
    const precoReferencia = unidade === "saca_60kg" ? findSackReferencePrice(nome) : 0;
    const imagem = document.getElementById("produtoImagem").value.trim();

    const product = {
      id: crypto.randomUUID(),
      nome,
      quantidade: Number(document.getElementById("produtoQuantidade").value) || 0,
      unidade,
      cultivo: document.getElementById("produtoCultivo").value,
      regiao: document.getElementById("produtoRegiao").value.trim(),
      preco: precoDigitado || precoReferencia || 0,
      imagem: resolveProductImage(nome, imagem)
    };

    state.products.unshift(product);
    writeData(storageKeys.products, state.products);
    event.target.reset();
    renderProducts();
    refreshPanel();
  });
}

function machineStatusBadge(status) {
  if (status === "alugado") return "alugado";
  return "disponivel";
}

function rentalDays(start, end) {
  const startDate = new Date(`${start}T00:00:00Z`);
  const endDate = new Date(`${end}T00:00:00Z`);
  return Math.ceil((endDate - startDate) / 86400000) + 1;
}

function renderRentals() {
  const container = document.getElementById("listaAlugueis");
  const rentals = state.rentals.slice().reverse();

  if (!rentals.length) {
    container.innerHTML = '<p class="muted">Nenhum aluguel registrado.</p>';
    return;
  }

  container.innerHTML = rentals
    .map((rental) => `
      <div class="rental-row">
        <div>
          <strong>${rental.machineName}</strong>
          <p class="muted">Locatario: ${rental.tenant} | ${rental.start} a ${rental.end}</p>
          ${rental.notes ? `<p class="muted">${rental.notes}</p>` : ""}
        </div>
        <div class="rental-total">
          <strong>${money(rental.total)}</strong>
          <span class="status ${rental.status === "ativo" ? "alugado" : "disponivel"}">${rental.status.toUpperCase()}</span>
        </div>
      </div>
    `)
    .join("");
}

function openRentalModal(machine) {
  document.getElementById("rentalForm").reset();
  document.getElementById("rentalMachineId").value = machine.id;
  document.getElementById("rentalMachineName").textContent = `${machine.nome} - ${money(machine.preco)} por dia`;
  document.getElementById("rentalStart").value = new Date().toISOString().slice(0, 10);
  document.getElementById("rentalEnd").value = new Date().toISOString().slice(0, 10);
  document.getElementById("rentalModal").showModal();
}

function finishRental(machine) {
  const rental = state.rentals.find((item) => item.machineId === machine.id && item.status === "ativo");
  state.machines = state.machines.map((item) => item.id === machine.id ? { ...item, status: "disponivel" } : item);
  if (rental) rental.status = "encerrado";
  writeData(storageKeys.machines, state.machines);
  writeData(storageKeys.rentals, state.rentals);
  renderMachines();
  renderRentals();
  refreshPanel();
}

function renderMachines() {
  const container = document.getElementById("listaMaquinas");

  if (!state.machines.length) {
    container.innerHTML = '<p class="muted">Nenhuma maquina cadastrada para aluguel.</p>';
    return;
  }

  container.innerHTML = state.machines
    .map(
      (item) => `
      <article class="machine-card">
        <img src="${item.imagem || MACHINE_FALLBACK_IMAGE}" alt="${item.nome}" onerror="this.onerror=null;this.src='${MACHINE_FALLBACK_IMAGE}'">
        <div class="machine-content">
          <h3>${item.nome}</h3>
          <p class="muted">${item.tipo} | ${item.dias}</p>
          <p>${item.condicoes}</p>
          <p><strong>${money(item.preco)}</strong> por dia</p>
          <p class="status ${machineStatusBadge(item.status)}">${item.status.toUpperCase()}</p>
          <button class="btn secondary" type="button" data-toggle-machine="${item.id}">${item.status === "alugado" ? "Encerrar aluguel" : "Registrar aluguel"}</button>
          <button class="btn secondary" type="button" data-delete-machine="${item.id}">Excluir equipamento</button>
        </div>
      </article>
    `
    )
    .join("");

  container.querySelectorAll("[data-toggle-machine]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const machine = state.machines.find((item) => item.id === btn.dataset.toggleMachine);
      if (!machine) return;
      if (machine.status === "alugado") finishRental(machine);
      else openRentalModal(machine);
    });
  });

  container.querySelectorAll("[data-delete-machine]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const machine = state.machines.find((item) => item.id === btn.dataset.deleteMachine);
      if (!machine || !window.confirm(`Excluir o equipamento "${machine.nome}"?`)) return;

      state.machines = state.machines.filter((item) => item.id !== btn.dataset.deleteMachine);
      writeData(storageKeys.machines, state.machines);
      renderMachines();
      refreshPanel();
    });
  });
}

function setupMachineForm() {
  document.getElementById("formMaquina").addEventListener("submit", (event) => {
    event.preventDefault();

    const machine = {
      id: crypto.randomUUID(),
      nome: document.getElementById("maqNome").value.trim(),
      preco: Math.max(0, Number(document.getElementById("maqPreco").value) || 0),
      tipo: document.getElementById("maqTipo").value,
      condicoes: document.getElementById("maqCondicoes").value.trim(),
      dias: document.getElementById("maqDias").value.trim(),
      imagem: resolveMachineImage(
        document.getElementById("maqNome").value.trim(),
        document.getElementById("maqImagem").value.trim()
      ),
      status: "disponivel"
    };

    state.machines.unshift(machine);
    writeData(storageKeys.machines, state.machines);
    event.target.reset();
    renderMachines();
    refreshPanel();
  });
}

function setupRentalForm() {
  const modal = document.getElementById("rentalModal");
  document.getElementById("cancelRental").addEventListener("click", () => modal.close());

  document.getElementById("rentalForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const machineId = document.getElementById("rentalMachineId").value;
    const machine = state.machines.find((item) => item.id === machineId);
    const start = document.getElementById("rentalStart").value;
    const end = document.getElementById("rentalEnd").value;
    const days = rentalDays(start, end);

    if (!machine || days < 1) return;

    state.rentals.push({
      id: crypto.randomUUID(),
      machineId,
      machineName: machine.nome,
      tenant: document.getElementById("rentalTenant").value.trim(),
      start,
      end,
      days,
      dailyPrice: machine.preco,
      total: days * machine.preco,
      notes: document.getElementById("rentalNotes").value.trim(),
      status: "ativo",
      createdAt: new Date().toISOString()
    });

    state.machines = state.machines.map((item) => item.id === machineId ? { ...item, status: "alugado" } : item);
    writeData(storageKeys.rentals, state.rentals);
    writeData(storageKeys.machines, state.machines);
    modal.close();
    renderMachines();
    renderRentals();
    refreshPanel();
  });
}

function setupProfile() {
  const modal = document.getElementById("profileModal");
  const openBtn = document.getElementById("openProfileModal");

  openBtn.addEventListener("click", () => {
    document.getElementById("perfilNomeInput").value = state.profile.nome;
    document.getElementById("perfilRegiaoInput").value = state.profile.regiao;
    document.getElementById("perfilBioInput").value = state.profile.bio;
    document.getElementById("perfilFotoInput").value = state.profile.foto;
    modal.showModal();
  });

  document.getElementById("saveProfile").addEventListener("click", () => {
    state.profile = {
      nome: document.getElementById("perfilNomeInput").value.trim(),
      regiao: document.getElementById("perfilRegiaoInput").value.trim(),
      bio: document.getElementById("perfilBioInput").value.trim(),
      foto: document.getElementById("perfilFotoInput").value.trim() || defaultProfile.foto
    };
    writeData(storageKeys.profile, state.profile);
    modal.close();
    refreshPanel();
  });
}

function updateProfileView() {
  document.getElementById("perfilNome").textContent = state.profile.nome;
  document.getElementById("perfilRegiao").textContent = state.profile.regiao;
  document.getElementById("perfilBio").textContent = state.profile.bio;
  document.getElementById("perfilFoto").src = state.profile.foto;
}

function aggregatedCosts() {
  const base = { insumos: 0, mao: 0, manutencao: 0, transporte: 0 };
  return state.pricingHistory.reduce((acc, item) => {
    acc.insumos += Number(item.insumos) || 0;
    acc.mao += Number(item.mao) || 0;
    acc.manutencao += Number(item.manutencao) || 0;
    acc.transporte += (Number(item.transporteBase) || 0) + (Number(item.custoDistancia) || 0);
    return acc;
  }, base);
}

function latestPriceComparison() {
  const last = state.pricingHistory[state.pricingHistory.length - 1];
  if (!last) return { minimo: 0, ideal: 0 };
  return {
    minimo: Number(last.precoMinimo) || 0,
    ideal: Number(last.precoIdeal) || 0
  };
}

function refreshKPIs() {
  document.getElementById("kpiProdutos").textContent = String(state.products.length);
  document.getElementById("kpiMaquinas").textContent = String(state.machines.length);

  const averageIdeal =
    state.pricingHistory.reduce((sum, row) => sum + (Number(row.precoIdeal) || 0), 0) /
    (state.pricingHistory.length || 1);

  document.getElementById("kpiPreco").textContent = money(averageIdeal);
}

function mountCharts() {
  const custos = aggregatedCosts();
  const comparacao = latestPriceComparison();

  if (chartCustos) chartCustos.destroy();
  if (chartPreco) chartPreco.destroy();

  chartCustos = new Chart(document.getElementById("chartCustos"), {
    type: "doughnut",
    data: {
      labels: ["Insumos", "Mao de obra", "Manutencao", "Transporte"],
      datasets: [
        {
          data: [custos.insumos, custos.mao, custos.manutencao, custos.transporte],
          backgroundColor: ["#2e7d4f", "#8a5c3b", "#f2b441", "#6ca67a"],
          borderWidth: 0
        }
      ]
    },
    options: {
      plugins: {
        legend: { position: "bottom" }
      }
    }
  });

  chartPreco = new Chart(document.getElementById("chartPreco"), {
    type: "bar",
    data: {
      labels: ["Preco minimo por unidade", "Preco ideal por unidade"],
      datasets: [
        {
          data: [comparacao.minimo, comparacao.ideal],
          backgroundColor: ["#8a5c3b", "#2e7d4f"],
          borderRadius: 8
        }
      ]
    },
    options: {
      scales: {
        y: {
          ticks: {
            callback(value) {
              return `R$ ${value}`;
            }
          }
        }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });
}

function refreshPanel() {
  updateProfileView();
  updateHeaderUser();
  refreshKPIs();
  mountCharts();
}

function exportReportPdf() {
  if (!window.jspdf || !window.jspdf.jsPDF) {
    alert("Nao foi possivel gerar PDF. Biblioteca indisponivel.");
    return;
  }

  const latest = latestPriceComparison();
  const custos = aggregatedCosts();
  const doc = new window.jspdf.jsPDF();
  const line = 10;

  let y = 18;
  doc.setFontSize(16);
  doc.text("AgroJusto - Relatorio do Produtor", 14, y);

  y += line;
  doc.setFontSize(11);
  doc.text(`Data: ${new Date().toLocaleString("pt-BR")}`, 14, y);
  y += line;
  doc.text(`Produtor: ${state.profile.nome}`, 14, y);
  y += line;
  doc.text(`Regiao: ${state.profile.regiao}`, 14, y);

  y += line + 2;
  doc.setFontSize(13);
  doc.text("Resumo do Painel", 14, y);
  y += line;
  doc.setFontSize(11);
  doc.text(`Produtos cadastrados: ${state.products.length}`, 14, y);
  y += line;
  doc.text(`Maquinas cadastradas: ${state.machines.length}`, 14, y);
  y += line;
  doc.text(`Historico de simulacoes de preco: ${state.pricingHistory.length}`, 14, y);

  y += line + 2;
  doc.setFontSize(13);
  doc.text("Precificacao", 14, y);
  y += line;
  doc.setFontSize(11);
  doc.text(`Preco minimo por unidade mais recente: ${money(latest.minimo)}`, 14, y);
  y += line;
  doc.text(`Preco ideal por unidade mais recente: ${money(latest.ideal)}`, 14, y);

  y += line + 2;
  doc.setFontSize(13);
  doc.text("Custos Acumulados", 14, y);
  y += line;
  doc.setFontSize(11);
  doc.text(`Insumos: ${money(custos.insumos)}`, 14, y);
  y += line;
  doc.text(`Mao de obra: ${money(custos.mao)}`, 14, y);
  y += line;
  doc.text(`Manutencao: ${money(custos.manutencao)}`, 14, y);
  y += line;
  doc.text(`Transporte: ${money(custos.transporte)}`, 14, y);

  doc.save("relatorio-agrojusto.pdf");
}

function init() {
  setupAuth();
  setupTabs();
  setupProductForm();
  setupMachineForm();
  setupRentalForm();
  setupCostForm();
  setupProfile();
  ensureCatalogMedia();

  document.getElementById("btnCalcular").addEventListener("click", calculatePricing);
  document.getElementById("btnExportPdf").addEventListener("click", exportReportPdf);

  renderProducts();
  renderMachines();
  renderRentals();
  renderCosts();
  refreshPanel();
}

document.addEventListener("DOMContentLoaded", init);
