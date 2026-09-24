import { useState } from 'react';
import { useAgro } from '../agroCore.js';
import placeholderImage from '../assets/images/agro-placeholder.svg';

const machineImages = {
  trator: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=900&q=80',
  colheitadeira: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=900&q=80',
  plantadeira: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=80',
  pulverizador: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=900&q=80',
  grade: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=900&q=80'
};

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const allowedMachineImageTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);

export default function MachinesPage() {
  const { state, dispatch } = useAgro();
  const [machineForm, setMachineForm] = useState({
    nome: '',
    tipo: 'trator',
    diaria: 100,
    imagem: '',
    descricao: 'Máquina cadastrada',
    localizacao: 'Engenheiro Coelho',
    proprietario: 'Produtor AgroJusto'
  });
  const [editingMachineId, setEditingMachineId] = useState(null);
  const [message, setMessage] = useState('');

  function resetMachineForm() {
    setMachineForm({
      nome: '',
      tipo: 'trator',
      diaria: 100,
      imagem: '',
      descricao: 'Máquina cadastrada',
      localizacao: 'Engenheiro Coelho',
      proprietario: 'Produtor AgroJusto'
    });
    setEditingMachineId(null);
    setMessage('');
  }

  function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error('Imagem não selecionada.'));
        return;
      }
      if (!allowedMachineImageTypes.has(file.type)) {
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

  async function handleMachineImageChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    event.target.value = '';

    try {
      const dataUrl = await readFileAsDataUrl(file);
      setMachineForm((current) => ({ ...current, imagem: dataUrl }));
      setMessage('Imagem adicionada com sucesso!');
    } catch (err) {
      setMessage(err.message || 'Formato de imagem não permitido.');
    }
  }

  function addMachine(event) {
    event.preventDefault();
    if (!machineForm.nome.trim()) return;

    const normalizedTipo = String(machineForm.tipo || 'trator').toLowerCase();
    const image = machineForm.imagem || machineImages[normalizedTipo] || placeholderImage;
    const machine = {
      id: crypto.randomUUID(),
      nome: machineForm.nome,
      tipo: machineForm.tipo,
      status: 'disponivel',
      imagem: image,
      diaria: Number(machineForm.diaria) || 0,
      descricao: machineForm.descricao || 'Máquina cadastrada',
      localizacao: machineForm.localizacao || 'Engenheiro Coelho',
      proprietario: machineForm.proprietario || 'Produtor AgroJusto'
    };

    dispatch({ type: 'setMachines', machines: [...(state.machines || []), machine] });
    resetMachineForm();
  }

  function startEdit(machine) {
    setEditingMachineId(machine.id);
    setMachineForm({
      nome: machine.nome,
      tipo: machine.tipo,
      diaria: Number(machine.diaria) || 0,
      imagem: machine.imagem || '',
      descricao: machine.descricao || 'Máquina cadastrada',
      localizacao: machine.localizacao || 'Engenheiro Coelho',
      proprietario: machine.proprietario || 'Produtor AgroJusto'
    });
    setMessage('');
  }

  function saveEdit(event) {
    event.preventDefault();
    if (!editingMachineId) return;

    const normalizedTipo = String(machineForm.tipo || 'trator').toLowerCase();
    const updated = (state.machines || []).map((machine) => machine.id === editingMachineId ? {
      ...machine,
      nome: machineForm.nome,
      tipo: machineForm.tipo,
      diaria: Number(machineForm.diaria) || 0,
      imagem: machineForm.imagem || machineImages[normalizedTipo] || placeholderImage,
      descricao: machineForm.descricao || 'Máquina cadastrada',
      localizacao: machineForm.localizacao || 'Engenheiro Coelho',
      proprietario: machineForm.proprietario || 'Produtor AgroJusto'
    } : machine);

    dispatch({ type: 'setMachines', machines: updated });
    resetMachineForm();
  }

  function deleteMachine(id) {
    dispatch({ type: 'setMachines', machines: (state.machines || []).filter((machine) => machine.id !== id) });
  }

  function removeMachineImage() {
    setMachineForm((current) => ({ ...current, imagem: '' }));
    setMessage('Imagem removida com sucesso!');
  }

  return (
    <section className="tab-panel active">
      <article className="card product-layout-card">
        <div className="section-heading">
          <div><span className="auth-kicker">Máquinas</span><h2>Cadastro de máquinas</h2></div>
        </div>
        <div className="two-col product-split">
          <MachineForm
            machineForm={machineForm}
            setMachineForm={setMachineForm}
            editingMachineId={editingMachineId}
            addMachine={addMachine}
            saveEdit={saveEdit}
            resetMachineForm={resetMachineForm}
            handleMachineImageChange={handleMachineImageChange}
            removeMachineImage={removeMachineImage}
            message={message}
          />
          <div className="product-list">
            {(state.machines || []).map((machine) => (
              <MachineCard
                key={machine.id}
                machine={machine}
                onEdit={() => startEdit(machine)}
                onDelete={() => deleteMachine(machine.id)}
              />
            ))}
          </div>
        </div>
      </article>
    </section>
  );
}

function MachineForm({ machineForm, setMachineForm, editingMachineId, addMachine, saveEdit, resetMachineForm, handleMachineImageChange, removeMachineImage, message }) {
  const imagePreview = machineForm.imagem || placeholderImage;

  return (
    <form className="product-form" onSubmit={editingMachineId ? saveEdit : addMachine}>
      <div className="upload-card">
        <div className="upload-preview">
          <img src={imagePreview} alt="Foto da máquina" className="upload-thumb" />
        </div>
        <div className="upload-area">
          <span className="upload-icon">📷</span>
          <span className="upload-title">Foto da máquina</span>
          <span className="upload-subtitle">JPG, JPEG, PNG ou WEBP até 5 MB</span>
          <label className="upload-button">
            <span>Escolher imagem</span>
            <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleMachineImageChange} />
          </label>
          <div className="upload-actions">
            <button className="btn small" type="button" onClick={removeMachineImage}>Remover foto</button>
            {editingMachineId && <button className="btn secondary small" type="button" onClick={resetMachineForm}>Cancelar</button>}
          </div>
        </div>
      </div>

      {message && <div className="status-message">{message}</div>}

      <label>
        Nome
        <input type="text" value={machineForm.nome} onChange={(e) => setMachineForm({ ...machineForm, nome: e.target.value })} required />
      </label>

      <label>
        Tipo
        <select value={machineForm.tipo} onChange={(e) => setMachineForm({ ...machineForm, tipo: e.target.value })}>
          <option value="trator">Trator</option>
          <option value="plantadeira">Plantadeira</option>
          <option value="grade">Grade</option>
          <option value="colheitadeira">Colheitadeira</option>
        </select>
      </label>

      <label>
        Diária
        <input type="number" value={machineForm.diaria} min="0" step="0.01" onChange={(e) => setMachineForm({ ...machineForm, diaria: Number(e.target.value) })} />
      </label>

      <label>
        Localização
        <input type="text" value={machineForm.localizacao} onChange={(e) => setMachineForm({ ...machineForm, localizacao: e.target.value })} />
      </label>

      <label>
        Proprietário
        <input type="text" value={machineForm.proprietario} onChange={(e) => setMachineForm({ ...machineForm, proprietario: e.target.value })} />
      </label>

      <label>
        Descrição
        <textarea value={machineForm.descricao} onChange={(e) => setMachineForm({ ...machineForm, descricao: e.target.value })} />
      </label>

      <div className="form-actions">
        <button className="btn" type="submit">{editingMachineId ? 'Salvar alterações' : 'Adicionar máquina'}</button>
        {editingMachineId && <button className="btn secondary" type="button" onClick={resetMachineForm}>Cancelar</button>}
      </div>
    </form>
  );
}

function MachineCard({ machine, onEdit, onDelete }) {
  const image = machine.imagem || machineImages[String(machine.tipo || 'trator').toLowerCase()] || placeholderImage;
  const status = machine.status === 'alugada' ? 'Indisponível' : 'Disponível';

  return (
    <article className="product-card">
      <div className="product-card-image">
        <img src={image} alt={machine.nome || machine.tipo} />
      </div>
      <div className="product-card-content">
        <div className="product-card-head">
          <span className="product-icon">🚜</span>
          <div>
            <h3>{machine.nome || 'Máquina agrícola'}</h3>
            <span className="product-category">{machine.tipo || 'Máquina'}</span>
          </div>
        </div>

        <div className="product-card-meta">
          <div><span>📍 Localização</span><strong>{machine.localizacao || 'Engenheiro Coelho'}</strong></div>
          <div><span>💰 Diária</span><strong>R$ {Number(machine.diaria || 0).toFixed(2)}</strong></div>
          <div><span>👤 Proprietário</span><strong>{machine.proprietario || 'Produtor AgroJusto'}</strong></div>
          <div><span>🟢 Disponibilidade</span><strong>{status}</strong></div>
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
