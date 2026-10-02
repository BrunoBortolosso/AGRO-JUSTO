import { useEffect, useState } from 'react';
import { useAgro } from '../agroCore.js';
import { apiClient, normalizeApiError } from '../apiClient.js';
import placeholderImage from '../assets/images/agro-placeholder.svg';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const allowedProductImageTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);

export default function ProductsPage() {
  const { state, dispatch } = useAgro();
  const [productForm, setProductForm] = useState({
    nome: '',
    quantidade: 1,
    unidade: 'saca_60kg',
    imagem: '',
    regiao: 'Regiao nao informada',
    cultivo: 'convencional',
    preco: 0
  });
  const [editingProductId, setEditingProductId] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (state.authStatus !== 'authenticated') {
      dispatch({ type: 'setProducts', products: [] });
      return;
    }

    let active = true;

    async function loadProducts() {
      setLoading(true);
      setMessage('');

      try {
        const products = await apiClient.get('/products');
        if (active) {
          dispatch({ type: 'setProducts', products: Array.isArray(products) ? products : [] });
        }
      } catch (error) {
        if (active) {
          const normalized = normalizeApiError(error, 'Não foi possível carregar os produtos.');
          setMessage(normalized.message);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProducts();
    return () => {
      active = false;
    };
  }, [dispatch, state.authStatus, state.auth?.id]);

  function resetProductForm() {
    setProductForm({
      nome: '',
      quantidade: 1,
      unidade: 'saca_60kg',
      imagem: '',
      regiao: 'Regiao nao informada',
      cultivo: 'convencional',
      preco: 0
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

    event.target.value = '';

    try {
      const dataUrl = await readFileAsDataUrl(file);
      setProductForm((current) => ({ ...current, imagem: dataUrl }));
      setMessage('Imagem adicionada com sucesso!');
    } catch (error) {
      setMessage(error.message || 'Formato de imagem não permitido.');
    }
  }

  async function addProduct(event) {
    event.preventDefault();

    if (!productForm.nome.trim()) {
      setMessage('Informe o nome do produto.');
      return;
    }

    if (Number(productForm.quantidade) <= 0 || Number(productForm.preco) <= 0) {
      setMessage('Quantidade e preço devem ser maiores que zero.');
      return;
    }

    setSaving(true);
    setMessage('');

    try {
      const payload = {
        nome: productForm.nome,
        quantidade: Number(productForm.quantidade),
        unidade: productForm.unidade,
        cultivo: productForm.cultivo || 'convencional',
        regiao: productForm.regiao || 'Regiao nao informada',
        preco: Number(productForm.preco),
        ...(productForm.imagem ? { imagem: productForm.imagem } : {})
      };

      const created = await apiClient.post('/products', payload);
      dispatch({ type: 'setProducts', products: [created, ...(state.products || [])] });
      resetProductForm();
    } catch (error) {
      const normalized = normalizeApiError(error, 'Não foi possível criar o produto.');
      setMessage(normalized.message);
    } finally {
      setSaving(false);
    }
  }

  function startEdit(product) {
    setEditingProductId(product.id);
    setProductForm({
      nome: product.nome,
      quantidade: product.quantidade || 1,
      unidade: product.unidade || 'saca_60kg',
      imagem: product.imagem || '',
      regiao: product.regiao || 'Regiao nao informada',
      cultivo: product.cultivo || 'convencional',
      preco: Number(product.preco || 0)
    });
    setMessage('');
  }

  async function saveEdit(event) {
    event.preventDefault();
    if (!editingProductId) return;

    if (Number(productForm.quantidade) <= 0 || Number(productForm.preco) <= 0) {
      setMessage('Quantidade e preço devem ser maiores que zero.');
      return;
    }

    setSaving(true);
    setMessage('');

    try {
      const payload = {
        nome: productForm.nome,
        quantidade: Number(productForm.quantidade),
        unidade: productForm.unidade,
        cultivo: productForm.cultivo || 'convencional',
        regiao: productForm.regiao || 'Regiao nao informada',
        preco: Number(productForm.preco),
        ...(productForm.imagem ? { imagem: productForm.imagem } : {})
      };

      const updated = await apiClient.patch(`/products/${editingProductId}`, payload);
      dispatch({
        type: 'setProducts',
        products: (state.products || []).map((product) => product.id === editingProductId ? updated : product)
      });
      resetProductForm();
    } catch (error) {
      const normalized = normalizeApiError(error, 'Não foi possível salvar o produto.');
      setMessage(normalized.message);
    } finally {
      setSaving(false);
    }
  }

  async function deleteProduct(id) {
    if (!window.confirm('Deseja excluir este produto?')) return;

    setDeletingId(id);
    setMessage('');

    try {
      await apiClient.del(`/products/${id}`);
      dispatch({
        type: 'setProducts',
        products: (state.products || []).filter((product) => product.id !== id)
      });
      if (editingProductId === id) {
        resetProductForm();
      }
    } catch (error) {
      const normalized = normalizeApiError(error, 'Não foi possível excluir o produto.');
      setMessage(normalized.message);
    } finally {
      setDeletingId(null);
    }
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
            saving={saving}
          />
          <div className="product-list">
            {loading && <p className="badge">Carregando produtos...</p>}
            {!loading && (state.products || []).length === 0 && <p className="badge">Nenhum produto cadastrado.</p>}
            {(state.products || []).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={() => startEdit(product)}
                onDelete={() => deleteProduct(product.id)}
                deleting={deletingId === product.id}
              />
            ))}
          </div>
        </div>
      </article>
    </section>
  );
}

function ProductForm({ productForm, setProductForm, editingProductId, addProduct, saveEdit, resetProductForm, handleProductImageChange, removeProductImage, message, saving }) {
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
      <label>Região<input type="text" value={productForm.regiao} onChange={(e) => setProductForm({ ...productForm, regiao: e.target.value })} /></label>
      <label>Cultivo<select value={productForm.cultivo} onChange={(e) => setProductForm({ ...productForm, cultivo: e.target.value })}><option value="convencional">Convencional</option><option value="organico">Orgânico</option></select></label>
      <label>Preço<input type="number" value={productForm.preco} min="0" step="0.01" onChange={(e) => setProductForm({ ...productForm, preco: Number(e.target.value) })} /></label>
      <div className="form-actions">
        <button className="btn" type="submit" disabled={saving}>{saving ? 'Salvando...' : (editingProductId ? 'Salvar alterações' : 'Adicionar produto')}</button>
        {editingProductId && <button className="btn secondary" type="button" onClick={resetProductForm}>Cancelar</button>}
      </div>
    </form>
  );
}

function ProductCard({ product, onEdit, onDelete, deleting }) {
  const image = product.imagem || placeholderImage;
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
            <span className="product-category">{product.cultivo || 'Produto'}</span>
          </div>
        </div>
        <div className="product-card-meta">
          <div><span>📦 Quantidade</span><strong>{product.quantidade || 1} {product.unidade || 'kg'}</strong></div>
          <div><span>📍 Região</span><strong>{product.regiao || 'Região não informada'}</strong></div>
          <div><span>🌿 Cultivo</span><strong>{product.cultivo || 'Convencional'}</strong></div>
          <div><span>💰 Preço</span><strong>R$ {Number(product.preco || 0).toFixed(2)}</strong></div>
        </div>
        <div className="product-card-actions">
          <button className="btn secondary small" type="button" onClick={onEdit}>Editar</button>
          <button className="btn danger small" type="button" onClick={onDelete} disabled={deleting}>{deleting ? 'Excluindo...' : 'Excluir'}</button>
        </div>
      </div>
    </article>
  );
}
