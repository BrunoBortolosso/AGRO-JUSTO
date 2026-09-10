import { useState } from 'react';
import { useAgro } from '../agroCore.js';

export default function ProductsPage() {
  const { state, dispatch } = useAgro();
  const [nome, setNome] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [unidade, setUnidade] = useState('saca_60kg');

  function addProduct(event) {
    event.preventDefault();
    if (!nome.trim()) return;
    const product = { id: crypto.randomUUID(), nome, quantidade, unidade, cultivo: 'convencional', regiao: 'Regiao nao informada', preco: 0 };
    dispatch({ type: 'setProducts', products: [...state.products, product] });
    setNome('');
    setQuantidade(1);
  }

  function deleteProduct(id) {
    dispatch({ type: 'setProducts', products: state.products.filter((p) => p.id !== id) });
  }

  return (
    <section className="tab-panel active">
      <article className="card">
        <div className="section-heading">
          <div><span className="auth-kicker">Produtos</span><h2>Cadastro de produtos</h2></div>
        </div>
        <div className="two-col">
          <ProductForm nome={nome} setNome={setNome} quantidade={quantidade} setQuantidade={setQuantidade} unidade={unidade} setUnidade={setUnidade} addProduct={addProduct} />
          <div className="product-list">
            {(state.products || []).map((product) => <ProductCard key={product.id} product={product} onDelete={() => deleteProduct(product.id)} />)}
          </div>
        </div>
      </article>
    </section>
  );
}

function ProductForm({ nome, setNome, quantidade, setQuantidade, unidade, setUnidade, addProduct }) {
  return (
    <form className="product-form" onSubmit={addProduct}>
      <label>Nome<input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required /></label>
      <label>Quantidade<input type="number" value={quantidade} min="1" onChange={(e) => setQuantidade(Number(e.target.value))} /></label>
      <label>Unidade<select value={unidade} onChange={(e) => setUnidade(e.target.value)}><option value="saca_60kg">Saca 60kg</option><option value="kg">Kg</option></select></label>
      <button className="btn" type="submit">Adicionar produto</button>
    </form>
  );
}

function ProductCard({ product, onDelete }) {
  return (
    <div className="product-card">
      <span className="product-title">{product.nome}</span>
      <span className="muted">{product.quantidade} {product.unidade}</span>
      <button className="btn danger small" type="button" onClick={onDelete}>Excluir</button>
    </div>
  );
}
