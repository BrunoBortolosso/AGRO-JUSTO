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
    descricao: 'Maquina cadastrada',
    localizacao: 'Engenheiro Coelho',
    proprietario: 'Produtor AgroJusto'
  });
  const [editingMachineId, setEditingMachineId] = useState(null);
  const [message, setMessage] = useState('');
  const [machineQuery, setMachineQuery] = useState('');
  const [machineFilter, setMachineFilter] = useState('todas');
  const [actionMachine, setActionMachine] = useState(null);
  const [rentalForm, setRentalForm] = useState({ inicio: '', fim: '' });

  function resetMachineForm() {
    setMachineForm({
      nome: '',
      tipo: 'trator',
      diaria: 100,
      imagem: '',
      descricao: 'Maquina cadastrada',
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
      locacao: '1 dia',
      codigo: `MA-${Math.round(Math.random() * 999)}`,
      descricao: machineForm.descricao || 'Maquina cadastrada',
      localizacao: machineForm.localizacao || 'Engenheiro Coelho',
      proprietario: machineForm.proprietario || 'Produtor AgroJusto'
    };
    dispatch({ type: 'setMachines', machines: [...state.machines, machine] });
    resetMachineForm();
  }

  function startEdit(machine) {
    setEditingMachineId(machine.id);
    setMachineForm({
      nome: machine.nome,
      tipo: machine.tipo,
      diaria: Number(machine.diaria) || 0,
      imagem: machine.imagem || '',
      descricao: machine.descricao || 'Maquina cadastrada',
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
      descricao: machineForm.descricao || 'Maquina cadastrada',
      localizacao: machineForm.localizacao || 'Engenheiro Coelho',
      proprietario: machineForm.proprietario || 'Produtor AgroJusto'
    } : machine);
    dispatch({ type: 'setMachines', machines: updated });
    resetMachineForm();
  }

  function deleteMachine(id) {
    dispatch({ type: 'setMachines', machines: state.machines.filter((m) => m.id !== id) });
  }

  function removeMachineImage() {
    setMachineForm((current) => ({ ...current, imagem: '' }));
    setMessage('Imagem removida com sucesso!');
  }

  function openRental(machine) {
    setActionMachine(machine);
    setRentalForm({ inicio: '', fim: '' });
  }

  function closeRental() {
    setActionMachine(null);
  }

  function finishRental(machineId) {
    const machine = state.machines.find((m) => m.id === machineId);
    if (!machine) return;
    dispatch({ type: 'setMachines', machines: state.machines.map((m) => m.id === machineId ? { ...m, status: 'alugada' } : m) });
    const rentalEntry = { id: crypto.randomUUID(), machineId, maquina: machine.nome, inicio: rentalForm.inicio || new Date().toISOString().slice(0, 10), fim: rentalForm.fim || new Date().toISOString().slice(0, 10), status: 'encerrado' };
    dispatch({ type: 'setRentals', rentals: [rentalEntry, ...(state.rentals || [])] });
    closeRental();
  }

  const filteredMachines = (state.machines || []).filter((machine) => {
    const matchesText = (machine.nome || '').toLowerCase().includes(machineQuery.toLowerCase()) || (machine.tipo || '').toLowerCase().includes(machineQuery.toLowerCase()) || (machine.localizacao || '').toLowerCase().includes(machineQuery.toLowerCase());
    const matchesFilter = machineFilter === 'todas' || machine.tipo === machineFilter;
    return matchesText && matchesFilter;
  });

  return (
    <section className="tab-panel active machines-page">
      <article className="card machines-catalog-card">
        <div className="section-heading"><div><span className="auth-kicker">Maquinas</span><h2>Catalogo e aluguel</h2></div></div>
        <p className="section-subtitle">Encontre máquinas agrícolas para sua produção</p>
        <div className="machine-toolbar">
          <input className="machine-search" type="search" placeholder="Buscar máquina" value={machineQuery} onChange={(e) => setMachineQuery(e.target.value)} />
          <select className="machine-filter" value={machineFilter} onChange={(e) => setMachineFilter(e.target.value)}>
            <option value="todas">Todos os tipos</option>
            <option value="trator">Trator</option>
            <option value="plantadeira">Plantadeira</option>
            <option value="grade">Grade</option>
            <option value="colheitadeira">Colheitadeira</option>
          </select>
        </div>
        <div className="two-col">
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
          <div className="machines-grid">{filteredMachines.map((machine) => <MachineCard key={machine.id} machine={machine} onEdit={() => startEdit(machine)} onRental={() => openRental(machine)} onDelete={() => deleteMachine(machine.id)} />)}</div>
        </div>
        <RentalHistory rentals={state.rentals || []} />
      </article>
      {actionMachine && <dialog open className="rental-dialog"><div className="dialog-card"><h3>Aluguel de {actionMachine.nome}</h3><label>Inicio<input type="date" value={rentalForm.inicio} onChange={(e) => setRentalForm({ ...rentalForm, inicio: e.target.value })} /></label><label>Fim<input type="date" value={rentalForm.fim} onChange={(e) => setRentalForm({ ...rentalForm, fim: e.target.value })} /></label><div className="dialog-actions"><button className="btn" type="button" onClick={() => finishRental(actionMachine.id)}>Salvar aluguel</button><button className="btn secondary" type="button" onClick={closeRental}>Cancelar</button></div></div></dialog>}
    </section>
  );
}

function MachineForm({ machineForm, setMachineForm, editingMachineId, addMachine, saveEdit, resetMachineForm, handleMachineImageChange, removeMachineImage, message }) {
  const imagePreview = machineForm.imagem || placeholderImage;
  return (
    <form className="machine-form" onSubmit={editingMachineId ? saveEdit : addMachine}>
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
      <label>Nome<input type="text" value={machineForm.nome} onChange={(e) => setMachineForm({ ...machineForm, nome: e.target.value })} required /></label>
      <label>Tipo<select value={machineForm.tipo} onChange={(e) => setMachineForm({ ...machineForm, tipo: e.target.value })}><option value="trator">Trator</option><option value="plantadeira">Plantadeira</option><option value="grade">Grade</option><option value="colheitadeira">Colheitadeira</option></select></label>
      <label>Diária<input type="number" value={machineForm.diaria} onChange={(e) => setMachineForm({ ...machineForm, diaria: Number(e.target.value) })} /></label>
      <label>Localização<input type="text" value={machineForm.localizacao} onChange={(e) => setMachineForm({ ...machineForm, localizacao: e.target.value })} /></label>
      <label>Proprietário<input type="text" value={machineForm.proprietario} onChange={(e) => setMachineForm({ ...machineForm, proprietario: e.target.value })} /></label>
      <label>Descrição<textarea value={machineForm.descricao} onChange={(e) => setMachineForm({ ...machineForm, descricao: e.target.value })} /></label>
      <div className="form-actions">
        <button className="btn" type="submit">{editingMachineId ? 'Salvar alterações' : 'Adicionar maquina'}</button>
        {editingMachineId && <button className="btn secondary" type="button" onClick={resetMachineForm}>Cancelar</button>}
      </div>
    </form>
  );
}

function MachineCard({ machine, onEdit, onRental, onDelete }) {
  const image = machine.imagem || machineImages[String(machine.tipo || 'trator').toLowerCase()] || placeholderImage;
  const status = machine.status === 'alugada' ? 'Indisponível' : 'Disponível';
  return (
    <article className="machine-card">
      <div className="machine-card-image">
        <img src={image} alt={machine.nome || machine.tipo} />
      </div>
      <div className="machine-card-content">
        <div className="machine-card-head">
          <span className="machine-icon">🚜</span>
          <div>
            <h3>{machine.nome || 'Máquina agrícola'}</h3>
            <span className="machine-type">Tipo: {machine.tipo}</span>
          </div>
        </div>
        <div className="machine-card-meta">
          <div><span>📍 Localização</span><strong>{machine.localizacao || 'Engenheiro Coelho'}</strong></div>
          <div><span>💰 Diária</span><strong>R$ {Number(machine.diaria || 0).toFixed(2)}</strong></div>
          <div><span>👤 Proprietário</span><strong>{machine.proprietario || 'Produtor AgroJusto'}</strong></div>
          <div><span>🟢 Disponibilidade</span><strong>{status}</strong></div>
        </div>
        <div className="machine-card-description">
          <span>{machine.descricao || 'Máquina cadastrada'}</span>
        </div>
        <div className="machine-card-actions">
          <button className="btn small" type="button">Ver máquina</button>
          <button className="btn secondary small" type="button" onClick={onEdit}>Editar</button>
          <button className="btn small" type="button" onClick={onRental}>Alugar</button>
          <button className="btn danger small" type="button" onClick={onDelete}>Excluir</button>
        </div>
      </div>
    </article>
  );
}

function RentalHistory({ rentals }) {
  return <div className="rental-history"><h3>Historico de alugueis</h3>{(rentals || []).length === 0 ? <span className="muted">Nenhum aluguel registrado</span> : rentals.map((r) => <div className="history-row" key={r.id}><span>{r.maquina}</span><strong>{r.inicio} → {r.fim}</strong></div>)}</div>;
}
