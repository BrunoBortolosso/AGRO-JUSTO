const storageKeys = {
  auth: "agrojusto.auth",
  profile: "agrojusto.profile",
  products: "agrojusto.products",
  machines: "agrojusto.machines",
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
  auth: readData(storageKeys.auth, { loggedIn: false, email: "" }),
  profile: readData(storageKeys.profile, defaultProfile),
  products: readData(storageKeys.products, defaultProducts),
  machines: readData(storageKeys.machines, defaultMachines),
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

  if (state.auth.loggedIn) {
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

function login(email, senha) {
  const cleanEmail = email.trim().toLowerCase();
  if (cleanEmail === demoLogin.email && senha === demoLogin.senha) {
    state.auth = { loggedIn: true, email: cleanEmail };
    writeData(storageKeys.auth, state.auth);
    setAuthMessage("Login realizado com sucesso.", false);
    updateHeaderUser();
    applyAuthState();
    refreshPanel();
    return;
  }
  setAuthMessage("Credenciais invalidas. Use o acesso de demonstracao.", true);
}

function setupAuth() {
  document.getElementById("loginForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const senha = document.getElementById("loginSenha").value;
    login(email, senha);
  });

  document.getElementById("btnDemoLogin").addEventListener("click", () => {
    document.getElementById("loginEmail").value = demoLogin.email;
    document.getElementById("loginSenha").value = demoLogin.senha;
    login(demoLogin.email, demoLogin.senha);
  });

  document.getElementById("btnLogout").addEventListener("click", () => {
    state.auth = { loggedIn: false, email: "" };
    writeData(storageKeys.auth, state.auth);
    applyAuthState();
  });

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
  const insumos = Number(document.getElementById("insumos").value) || 0;
  const mao = Number(document.getElementById("maoDeObra").value) || 0;
  const transporteBase = Number(document.getElementById("transporteBase").value) || 0;
  const manutencao = Number(document.getElementById("manutencao").value) || 0;
  const distancia = Number(document.getElementById("distanciaKm").value) || 0;
  const custoKm = Number(document.getElementById("custoKm").value) || 0;
  const oferta = document.getElementById("oferta").value;
  const demanda = document.getElementById("demanda").value;

  const custoDistancia = distancia * custoKm;
  const custoTotal = insumos + mao + transporteBase + manutencao + custoDistancia;
  const precoMinimo = custoTotal * 1.1;
  const multip = pricingMultiplier(oferta, demanda);
  const precoIdeal = precoMinimo * multip;

  document.getElementById("precoMinimo").textContent = money(precoMinimo);
  document.getElementById("precoIdeal").textContent = money(precoIdeal);
  document.getElementById("resumoMercado").textContent = `Custo total: ${money(custoTotal)}. Ajuste de mercado: ${(multip * 100).toFixed(0)}%.`;
  document.getElementById("resultadoPreco").classList.remove("hidden");

  state.pricingHistory.push({
    insumos,
    mao,
    manutencao,
    transporteBase,
    custoDistancia,
    precoMinimo,
    precoIdeal,
    createdAt: new Date().toISOString()
  });

  state.pricingHistory = state.pricingHistory.slice(-20);
  writeData(storageKeys.pricing, state.pricingHistory);
  refreshPanel();
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

function renderMachines() {
  const container = document.getElementById("listaMaquinas");

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
          <button class="btn secondary" type="button" data-toggle-machine="${item.id}">Alternar status</button>
        </div>
      </article>
    `
    )
    .join("");

  container.querySelectorAll("[data-toggle-machine]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.machines = state.machines.map((machine) => {
        if (machine.id !== btn.dataset.toggleMachine) return machine;
        return { ...machine, status: machine.status === "disponivel" ? "alugado" : "disponivel" };
      });
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
      preco: Number(document.getElementById("maqPreco").value) || 0,
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
    acc.insumos += item.insumos;
    acc.mao += item.mao;
    acc.manutencao += item.manutencao;
    acc.transporte += item.transporteBase + item.custoDistancia;
    return acc;
  }, base);
}

function latestPriceComparison() {
  const last = state.pricingHistory[state.pricingHistory.length - 1];
  if (!last) return { minimo: 0, ideal: 0 };
  return { minimo: last.precoMinimo, ideal: last.precoIdeal };
}

function refreshKPIs() {
  document.getElementById("kpiProdutos").textContent = String(state.products.length);
  document.getElementById("kpiMaquinas").textContent = String(state.machines.length);

  const averageIdeal =
    state.pricingHistory.reduce((sum, row) => sum + row.precoIdeal, 0) /
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
      labels: ["Preco minimo", "Preco ideal"],
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
  doc.text(`Preco minimo mais recente: ${money(latest.minimo)}`, 14, y);
  y += line;
  doc.text(`Preco ideal mais recente: ${money(latest.ideal)}`, 14, y);

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
  setupProfile();
  ensureCatalogMedia();

  document.getElementById("btnCalcular").addEventListener("click", calculatePricing);
  document.getElementById("btnExportPdf").addEventListener("click", exportReportPdf);

  renderProducts();
  renderMachines();
  refreshPanel();
}

document.addEventListener("DOMContentLoaded", init);
