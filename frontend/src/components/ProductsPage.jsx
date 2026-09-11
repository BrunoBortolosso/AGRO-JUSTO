import { useState } from 'react';
import { useAgro } from '../agroCore.js';
import placeholderImage from '../assets/images/agro-placeholder.svg';

const productImages = {
  tomate: 'https://images.unsplash.com/photo-1592841200221-7e0367d0c3ab?auto=format&fit=crop&w=900&q=80',
  alface: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a4?auto=format&fit=crop&w=900&q=80',
  milho: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=900&q=80',
  cafe: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=900&q=80',
  feijao: 'https://images.unsplash.com/photo-1501004318741-b39ece5ba562?auto=format&fit=crop&w=900&q=80',
  batata: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=900&q=80',
  cenoura: 'https://images.unsplash.com/photo-1447175008436-054170c2e979?auto=format&fit=crop&w=900&q=80',
  morango: 'https://images.unsplash.com/photo-1605056545114-504b4d138f07?auto=format&fit=crop&w=900&q=80',
  banana: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&w=900&q=80',
  laranja: 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&w=900&q=80'
};

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const allowedProductImageTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);

export default function ProductsPage() {
  const { state, dispatch } = useAgro();
  const [productForm, setProductForm] = useState({
    nome: '',
    quantidade: 1,
    unidade: 'saca_60kg',
    imagem: '',
    categoria: 'Produto',
    regiao: 'Regiao nao informada',
    cultivo: 'convencional',
    preco: 0,
    organico: false
  });
  const [editingProductId, setEditingProductId] = useState(null);
  const [message, setMessage] = useState('');

  function resetProductForm() {
    setProductForm({
      nome: '',
      quantidade: 1,
      unidade: 'saca_60kg',
      imagem: '',
      categoria: 'Produto',
      regiao: 'Regiao nao informada',
      cultivo: 'convencional',
      preco: 0,
      organico: false
    });
    setEditingProductId(null);
    setMessage('');
  }

  function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error('Imagem não selecionada.'));
        return;
      }
      if (!allowedProductImageTypes.has(file.type)) {
        reject(new Error('Formato de imagem não permitido.'));
        return;
      }
      if (file.size > MAX_IMAGE_SIZE) {
        reject(new Error('Imagem muito grande. Escolha uma imagem de até 5 MB.'));
        return;
      }
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('Não foi possível carregar a imagem.'));
      reader.readAsDataURL(file);
    });
  }

  async function handleProductImageChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setProductForm((current) => ({ ...current, imagem: dataUrl }));
      setMessage('Imagem adicionada com sucesso!');
    } catch (err) {
      setMessage(err.message || 'Formato de imagem não permitido.');
    }
  }

  async function addProduct(event) {
    event.preventDefault();
    if (!productForm.nome.trim()) return;
    const naturalKey = String(productForm.nome).trim().toLowerCase();
    const product = {
      id: crypto.randomUUID(),
      nome: productForm.nome,
      quantidade: Number(productForm.quantidade) || 1,
      unidade: productForm.unidade,
      categoria: productForm.categoria || 'Produto',
      cultivo: productForm.cultivo || 'convencional',
      regiao: productForm.regiao || 'Regiao nao informada',
      preco: Number(productForm.preco || 0),
      organico: Boolean(productForm.organico),
      imagem: productForm.imagem || productImages[naturalKey] || placeholderImage
    };
    dispatch({ type: 'setProducts', products: [...state.products, product] });
    resetProductForm();
  }

  function startEdit(product) {
    setEditingProductId(product.id);
    setProductForm({
      nome: product.nome,
      quantidade: product.quantidade || 1,
      unidade: product.unidade || 'saca_60kg',
      imagem: product.imagem || '',
      categoria: product.categoria || 'Produto',
      regiao: product.regiao || 'Regiao nao informada',
      cultivo: product.cultivo || 'convencional',
      preco: product.preco || 0,
      organico: Boolean(product.organico)
    });
    setMessage('');
  }

  function saveEdit(event) {
    event.preventDefault();
    if (!editingProductId) return;
    const updated = (state.products || []).map((product) => product.id === editingProductId ? {
      ...product,
      nome: productForm.nome,
      quantidade: Number(productForm.quantidade) || 1,
      unidade: productForm.unidade,
      categoria: productForm.categoria || 'Produto',
      cultivo: productForm.cultivo || 'convencional',
      regiao: productForm.regiao || 'Regiao nao informada',
      preco: Number(productForm.preco || 0),
      organico: Boolean(productForm.organico),
      imagem: productForm.imagem || placeholderImage
    } : product);
    dispatch({ type: 'setProducts', products: updated });
    resetProductForm();
  }

  function deleteProduct(id) {
    dispatch({ type: 'setProducts', products: state.products.filter((p) => p.id !== id) });
  }

  function removeProductImage() {
    setProductForm((current) => ({ ...current, imagem: '' }));
    setMessage('Imagem removida com sucesso!');
  }

  return (
    <section className="tab-panel active">
      <article className="card product-layout-card">
        <div className="section-heading">
          <div><span className="auth-kicker">Produtos</span><h2>Cadastro de produtos</h2></div>
        </div>
        <div className="two-col product-split">
          <ProductForm
            productForm={productForm}
            setProductForm={setProductForm}
            editingProductId={editingProductId}
            addProduct={addProduct}
            saveEdit={saveEdit}
            resetProductForm={resetProductForm}
            handleProductImageChange={handleProductImageChange}
            removeProductImage={removeProductImage}
            message={message}
          />
          <div className="product-list">
            {(state.products || []).map((product) => <ProductCard key={product.id} product={product} onEdit={() => startEdit(product)} onDelete={() => deleteProduct(product.id)} />)}
          </div>
        </div>
      </article>
    </section>
  );
}

function ProductForm({ productForm, setProductForm, editingProductId, addProduct, saveEdit, resetProductForm, handleProductImageChange, removeProductImage, message }) {
  const imagePreview = productForm.imagem || placeholderImage;
  return (
    <form className="product-form" onSubmit={editingProductId ? saveEdit : addProduct}>
      <div className="upload-card">
        <div className="upload-preview">
          <img src={imagePreview} alt="Foto do produto" className="upload-thumb" />
        </div>
        <div className="upload-area">
          <span className="upload-icon">📷</span>
          <span className="upload-title">Foto do produto</span>
          <span className="upload-subtitle">JPG, JPEG, PNG ou WEBP até 5 MB</span>
          <label className="upload-button">
            <span>Escolher imagem</span>
            <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleProductImageChange} />
          </label>
          <div className="upload-actions">
            <button className="btn small" type="button" onClick={removeProductImage}>Remover foto</button>
            {editingProductId && <button className="btn secondary small" type="button" onClick={resetProductForm}>Cancelar</button>}
          </div>
        </div>
      </div>
      {message && <div className="status-message">{message}</div>}
      <label>Nome<input type="text" value={productForm.nome} onChange={(e) => setProductForm({ ...productForm, nome: e.target.value })} required /></label>
      <label>Quantidade<input type="number" value={productForm.quantidade} min="1" onChange={(e) => setProductForm({ ...productForm, quantidade: Number(e.target.value) })} /></label>
      <label>Unidade<select value={productForm.unidade} onChange={(e) => setProductForm({ ...productForm, unidade: e.target.value })}><option value="saca_60kg">Saca 60kg</option><option value="kg">Kg</option></select></label>
      <label>Categoria<input type="text" value={productForm.categoria} onChange={(e) => setProductForm({ ...productForm, categoria: e.target.value })} /></label>
      <label>Região<input type="text" value={productForm.regiao} onChange={(e) => setProductForm({ ...productForm, regiao: e.target.value })} /></label>
      <label>Preço<input type="number" value={productForm.preco} min="0" step="0.01" onChange={(e) => setProductForm({ ...productForm, preco: Number(e.target.value) })} /></label>
      <label><span className="inline-check"><input type="checkbox" checked={productForm.organico} onChange={(e) => setProductForm({ ...productForm, organico: e.target.checked })} /> Orgânico</span></label>
      <div className="form-actions">
        <button className="btn" type="submit">{editingProductId ? 'Salvar alterações' : 'Adicionar produto'}</button>
        {editingProductId && <button className="btn secondary" type="button" onClick={resetProductForm}>Cancelar</button>}
      </div>
    </form>
  );
}

function ProductCard({ product, onEdit, onDelete }) {
  const image = product.imagem || productImages[String(product.nome || '').trim().toLowerCase()] || placeholderImage;
  const orgânico = Boolean(product.organico ?? (product.cultivo === 'organico' || product.cultivo === 'orgânico'));
  const category = product.categoria || (product.cultivo || 'Produto');
  const unit = product.unidade || 'kg';
  return (
    <article className="product-card">
      <div className="product-card-image">
        <img src={image} alt={product.nome} />
      </div>
      <div className="product-card-content">
        <div className="product-card-head">
          <span className="product-icon">🌱</span>
          <div>
            <h3>{product.nome}</h3>
            <span className="product-category">{category}</span>
          </div>
        </div>
        <div className="product-card-meta">
          <div><span>📦 Quantidade</span><strong>{product.quantidade || 1} {unit}</strong></div>
          <div><span>📍 Região</span><strong>{product.regiao || 'Região não informada'}</strong></div>
          <div><span>🌿 Orgânico</span><strong>{orgânico ? 'Sim' : 'Não'}</strong></div>
          <div><span>💰 Preço</span><strong>R$ {Number(product.preco || 0).toFixed(2)}</strong></div>
        </div>
        <div className="product-card-actions">
          <button className="btn small" type="button">Ver detalhes</button>
          <button className="btn secondary small" type="button" onClick={onEdit}>Editar</button>
          <button className="btn danger small" type="button" onClick={onDelete}>Excluir</button>
        </div>
      </div>
    </article>
  );
}
