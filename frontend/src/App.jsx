import { useEffect, useMemo, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3333";

function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ nome: "", quantidade: 0, unidade: "kg", preco: 0 });

  const headers = useMemo(() => ({
    "Content-Type": "application/json",
    ...(import.meta.env.VITE_USER_ID ? { "x-user-id": import.meta.env.VITE_USER_ID } : {})
  }), []);

  async function loadProducts() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/products`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Falha ao carregar produtos");
      setItems(data);
    } catch (e) {
      setError(e?.message || "Erro inesperado");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Initial data loading synchronizes the component with the API.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadProducts();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    try {
      const res = await fetch(editingId ? `${API_URL}/products/${editingId}` : `${API_URL}/products`, {
        method: editingId ? "PATCH" : "POST",
        headers,
        body: JSON.stringify({
          nome: form.nome,
          quantidade: Number(form.quantidade) || 0,
          unidade: form.unidade,
          preco: Number(form.preco) || 0
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || (editingId ? "Falha ao editar produto" : "Falha ao cadastrar produto"));
      setForm({ nome: "", quantidade: 0, unidade: "kg", preco: 0 });
      setEditingId(null);
      await loadProducts();
    } catch (e) {
      setError(e?.message || "Erro inesperado");
    }
  }

  function startEditing(product) {
    setEditingId(product.id);
    setForm({
      nome: product.nome,
      quantidade: product.quantidade,
      unidade: product.unidade,
      preco: product.preco
    });
    setError("");
  }

  function cancelEditing() {
    setEditingId(null);
    setForm({ nome: "", quantidade: 0, unidade: "kg", preco: 0 });
    setError("");
  }

  async function handleDelete(product) {
    const confirmed = window.confirm(`Excluir o produto "${product.nome}"?`);
    if (!confirmed) return;

    setError("");
    try {
      const res = await fetch(`${API_URL}/products/${product.id}`, {
        method: "DELETE"
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Falha ao excluir produto");
      }
      setItems((currentItems) => currentItems.filter((item) => item.id !== product.id));
    } catch (e) {
      setError(e?.message || "Erro inesperado");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-xl font-bold">AgroJusto</h1>
            <p className="text-sm text-slate-600">AV2 • React + Tailwind • Consumo de API</p>
          </div>
          <a
            className="text-sm font-semibold text-emerald-700 hover:underline"
            href="/"
            onClick={(e) => e.preventDefault()}
          >
            Produtos
          </a>
        </div>
      </header>

      <main className="mx-auto grid max-w-5xl gap-6 px-4 py-6 md:grid-cols-2">
        <section className="rounded-xl border bg-white p-5">
          <h2 className="text-lg font-semibold">{editingId ? "Editar produto" : "Cadastrar produto"}</h2>
          <p className="mt-1 text-sm text-slate-600">{editingId ? "Atualiza o produto no backend." : "Envia um POST para o backend."}</p>

          <form onSubmit={handleSubmit} className="mt-4 grid gap-3">
            <label className="grid gap-1 text-sm font-medium">
              Nome
              <input
                className="rounded-lg border px-3 py-2"
                value={form.nome}
                onChange={(e) => setForm((prev) => ({ ...prev, nome: e.target.value }))}
                required
                placeholder="Ex: Milho"
              />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="grid gap-1 text-sm font-medium">
                Quantidade
                <input
                  className="rounded-lg border px-3 py-2"
                  type="number"
                  min="0"
                  value={form.quantidade}
                  onChange={(e) => setForm((prev) => ({ ...prev, quantidade: e.target.value }))}
                />
              </label>

              <label className="grid gap-1 text-sm font-medium">
                Unidade
                <select
                  className="rounded-lg border px-3 py-2"
                  value={form.unidade}
                  onChange={(e) => setForm((prev) => ({ ...prev, unidade: e.target.value }))}
                >
                  <option value="kg">kg</option>
                  <option value="saca_60kg">saca (60kg)</option>
                  <option value="caixa">caixa</option>
                  <option value="un">unidade</option>
                  <option value="t">tonelada</option>
                </select>
              </label>
            </div>

            <label className="grid gap-1 text-sm font-medium">
              Preço (R$)
              <input
                className="rounded-lg border px-3 py-2"
                type="number"
                min="0"
                step="0.01"
                value={form.preco}
                onChange={(e) => setForm((prev) => ({ ...prev, preco: e.target.value }))}
              />
            </label>

            {error ? (
              <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
            ) : null}

            <div className="flex gap-2">
              <button className="rounded-lg bg-emerald-700 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-800">
                {editingId ? "Salvar alterações" : "Salvar"}
              </button>
              {editingId ? (
                <button type="button" onClick={cancelEditing} className="rounded-lg border px-3 py-2 text-sm font-semibold hover:bg-slate-50">
                  Cancelar
                </button>
              ) : null}
            </div>
          </form>
        </section>

        <section className="rounded-xl border bg-white p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Produtos</h2>
              <p className="mt-1 text-sm text-slate-600">Lista via GET no backend.</p>
            </div>
            <button
              type="button"
              onClick={loadProducts}
              className="rounded-lg border px-3 py-2 text-sm font-semibold hover:bg-slate-50"
            >
              Recarregar
            </button>
          </div>

          <div className="mt-4">
            {loading ? <p className="text-sm text-slate-600">Carregando...</p> : null}
            {!loading && !items.length ? <p className="text-sm text-slate-600">Nenhum produto ainda.</p> : null}
            <ul className="grid gap-2">
              {items.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2">
                  <div>
                    <p className="text-sm font-semibold">{p.nome}</p>
                    <p className="text-xs text-slate-600">
                      {p.quantidade} {p.unidade} • {p.preco ? `R$ ${Number(p.preco).toFixed(2)}` : "Sem preço"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400">{p.id.slice(0, 6)}</span>
                    <button
                      type="button"
                      onClick={() => startEditing(p)}
                      className="rounded-lg border px-3 py-2 text-xs font-semibold hover:bg-slate-50"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(p)}
                      className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50"
                    >
                      Excluir
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <footer className="border-t bg-white">
        <div className="mx-auto max-w-5xl px-4 py-4 text-xs text-slate-600">
          API atual: <span className="font-mono">{API_URL}</span>
        </div>
      </footer>
    </div>
  );
}

export default App
