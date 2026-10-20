import { useEffect, useRef, useState } from 'react';
import { useAgro } from '../agroCore.js';
import { apiClient, normalizeApiError } from '../apiClient.js';
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
const currencyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

function rentalDays(start, end) {
  if (!start || !end) return 0;
  const startTime = new Date(`${start}T00:00:00.000Z`).getTime();
  const endTime = new Date(`${end}T00:00:00.000Z`).getTime();
  return endTime >= startTime ? Math.floor((endTime - startTime) / 86400000) + 1 : 0;
}

function dateOverlaps(start, end, reservation) {
  const reservedStart = String(reservation.start || '').slice(0, 10);
  const reservedEnd = String(reservation.end || '').slice(0, 10);
  return start <= reservedEnd && end >= reservedStart;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

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
  const [catalogMachines, setCatalogMachines] = useState([]);
  const [loadedRentals, setLoadedRentals] = useState([]);
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [rentalStart, setRentalStart] = useState('');
  const [rentalEnd, setRentalEnd] = useState('');
  const [rentalNotes, setRentalNotes] = useState('');
  const [rentalMessage, setRentalMessage] = useState('');
  const [rentalSubmitting, setRentalSubmitting] = useState(false);
  const [showRentalForm, setShowRentalForm] = useState(false);
  const [finishingRentalId, setFinishingRentalId] = useState('');
  const machineDetailsDialogRef = useRef(null);
  const visibleMachines = state.token === 'demo-token'
    ? (state.machines || [])
    : [...catalogMachines, ...(state.machines || []).filter((machine) => !machine.fromApi)];
  const visibleRentals = state.token === 'demo-token' ? [] : loadedRentals;

  useEffect(() => {
    if (state.authStatus !== 'authenticated' || state.token === 'demo-token') return undefined;

    let active = true;
    Promise.all([apiClient.get('/machines/catalog'), apiClient.get('/rentals')])
      .then(([catalog, rentals]) => {
        if (!active) return;
        setCatalogMachines((Array.isArray(catalog) ? catalog : []).map((machine) => ({
          ...machine,
          diaria: Number(machine.preco || 0),
          descricao: machine.condicoes || 'Máquina cadastrada',
          status: machine.disponibilidade ? 'disponivel' : 'alugada',
          fromApi: true
        })));
        setLoadedRentals(Array.isArray(rentals) ? rentals : []);
      })
      .catch((error) => {
        if (!active) return;
        const normalized = normalizeApiError(error, 'Não foi possível carregar as máquinas e os aluguéis.');
        setCatalogMachines([]);
        setLoadedRentals([]);
        setMessage(normalized.message);
      });

    return () => {
      active = false;
    };
  }, [state.authStatus, state.token, state.auth?.id]);

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

  function toMachineCard(machine, ownerId = state.auth?.id) {
    return {
      ...machine,
      diaria: Number(machine.preco || 0),
      descricao: machine.condicoes || 'Máquina cadastrada',
      status: machine.disponibilidade ? 'disponivel' : 'alugada',
      proprietario: state.auth?.nome || 'Produtor AgroJusto',
      localizacao: state.auth?.regiao || 'Região não informada',
      ownerId,
      fromApi: true
    };
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

  async function addMachine(event) {
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
      proprietario: machineForm.proprietario || 'Produtor AgroJusto',
      ownerId: state.auth?.id || null
    };

    if (state.token === 'demo-token') {
      dispatch({ type: 'setMachines', machines: [...(state.machines || []), machine] });
      resetMachineForm();
      return;
    }

    if (Number(machineForm.diaria) <= 0) {
      setMessage('Informe uma diária maior que zero para cadastrar a máquina.');
      return;
    }

    setMessage('');
    try {
      const created = await apiClient.post('/machines', {
        nome: machineForm.nome.trim(),
        preco: Number(machineForm.diaria),
        tipo: machineForm.tipo,
        condicoes: machineForm.descricao || 'Máquina cadastrada',
        dias: 1,
        ...(machineForm.imagem.startsWith('http') ? { imagem: machineForm.imagem } : {})
      });
      setCatalogMachines((machines) => [toMachineCard(created), ...machines]);
      resetMachineForm();
    } catch (error) {
      const normalized = normalizeApiError(error, 'Não foi possível cadastrar a máquina.');
      setMessage(normalized.message);
    }
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

  async function saveEdit(event) {
    event.preventDefault();
    if (!editingMachineId) return;

    const normalizedTipo = String(machineForm.tipo || 'trator').toLowerCase();
    const currentMachine = (state.machines || []).find((machine) => machine.id === editingMachineId)
      || catalogMachines.find((machine) => machine.id === editingMachineId);
    if (currentMachine?.fromApi) {
      if (Number(machineForm.diaria) <= 0) {
        setMessage('Informe uma diária maior que zero para atualizar a máquina.');
        return;
      }
      setMessage('');
      try {
        const updated = await apiClient.patch(`/machines/${editingMachineId}`, {
          nome: machineForm.nome.trim(),
          preco: Number(machineForm.diaria),
          tipo: machineForm.tipo,
          condicoes: machineForm.descricao || 'Máquina cadastrada',
          dias: 1,
          ...(machineForm.imagem.startsWith('http') ? { imagem: machineForm.imagem } : {})
        });
        setCatalogMachines((machines) => machines.map((machine) => machine.id === editingMachineId
          ? { ...machine, ...toMachineCard(updated, machine.ownerId), proprietario: machine.proprietario, localizacao: machine.localizacao }
          : machine));
        resetMachineForm();
      } catch (error) {
        const normalized = normalizeApiError(error, 'Não foi possível salvar as alterações da máquina.');
        setMessage(normalized.message);
      }
      return;
    }

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

  async function deleteMachine(id) {
    const apiMachine = catalogMachines.find((machine) => machine.id === id);
    if (apiMachine) {
      setMessage('');
      try {
        await apiClient.del(`/machines/${id}`);
        setCatalogMachines((machines) => machines.filter((machine) => machine.id !== id));
      } catch (error) {
        const normalized = normalizeApiError(error, 'Não foi possível excluir a máquina.');
        setMessage(normalized.message);
      }
      return;
    }
    dispatch({ type: 'setMachines', machines: (state.machines || []).filter((machine) => machine.id !== id) });
  }

  function removeMachineImage() {
    setMachineForm((current) => ({ ...current, imagem: '' }));
    setMessage('Imagem removida com sucesso!');
  }

  function showMachineDetails(machine) {
    setSelectedMachine(machine);
    setRentalStart('');
    setRentalEnd('');
    setRentalNotes('');
    setRentalMessage('');
    setShowRentalForm(false);
    machineDetailsDialogRef.current?.showModal();
  }

  async function submitRental(event) {
    event.preventDefault();
    if (!selectedMachine || !rentalDays(rentalStart, rentalEnd)) {
      setRentalMessage('Informe um período válido para o aluguel.');
      return;
    }

    if (rentalStart < todayISO()) {
      setRentalMessage('A data inicial não pode estar no passado.');
      return;
    }

    if (!selectedMachine.fromApi) {
      setRentalMessage('Esta máquina ainda não está registrada no servidor e não pode ser alugada.');
      return;
    }

    if (selectedMachine.ownerId === state.auth?.id) {
      setRentalMessage('Não é possível alugar uma máquina cadastrada pela própria conta.');
      return;
    }

    const unavailableDates = (selectedMachine.activeRentals || [])
      .some((reservation) => dateOverlaps(rentalStart, rentalEnd, reservation));
    if (unavailableDates) {
      setRentalMessage('A máquina já está reservada em uma ou mais datas selecionadas.');
      return;
    }

    if (state.token === 'demo-token') {
      setRentalMessage('O modo sem conta não registra aluguéis. Entre com uma conta conectada ao servidor para continuar.');
      return;
    }

    setRentalSubmitting(true);
    setRentalMessage('');
    try {
      const rental = await apiClient.post('/rentals', {
        machineId: selectedMachine.id,
        start: rentalStart,
        end: rentalEnd,
        ...(rentalNotes.trim() ? { notes: rentalNotes.trim() } : {})
      });
      setLoadedRentals((rentals) => [rental, ...rentals]);
      setSelectedMachine((machine) => machine ? {
        ...machine,
        activeRentals: [...(machine.activeRentals || []), { start: rental.start, end: rental.end }]
      } : machine);
      setRentalMessage('Aluguel confirmado e registrado.');
      setShowRentalForm(false);
    } catch (error) {
      const normalized = normalizeApiError(error, 'Não foi possível registrar o aluguel.');
      setRentalMessage(normalized.message);
    } finally {
      setRentalSubmitting(false);
    }
  }

  const selectedMachineRentals = selectedMachine
    ? visibleRentals.filter((rental) => rental.machineId === selectedMachine.id)
    : [];
  const selectedRentalDays = rentalDays(rentalStart, rentalEnd);
  const selectedRentalTotal = selectedMachine
    ? selectedRentalDays * Number(selectedMachine.diaria || 0)
    : 0;
  const selectedPeriodUnavailable = Boolean(rentalStart && rentalEnd && selectedMachine?.activeRentals
    ?.some((reservation) => dateOverlaps(rentalStart, rentalEnd, reservation)));

  async function finishRental(rentalId) {
    setFinishingRentalId(rentalId);
    setRentalMessage('');
    try {
      const updated = await apiClient.post(`/rentals/${rentalId}/finish`);
      setLoadedRentals((rentals) => rentals.map((rental) => rental.id === rentalId ? updated : rental));
      setRentalMessage('Aluguel finalizado.');
      try {
        const catalog = await apiClient.get('/machines/catalog');
        setCatalogMachines((Array.isArray(catalog) ? catalog : []).map((machine) => ({
          ...machine,
          diaria: Number(machine.preco || 0),
          descricao: machine.condicoes || 'Máquina cadastrada',
          status: machine.disponibilidade ? 'disponivel' : 'alugada',
          fromApi: true
        })));
      } catch {
        setRentalMessage('Aluguel finalizado; não foi possível atualizar a disponibilidade da máquina.');
      }
    } catch (error) {
      const normalized = normalizeApiError(error, 'Não foi possível finalizar o aluguel.');
      setRentalMessage(normalized.message);
    } finally {
      setFinishingRentalId('');
    }
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
            {(visibleMachines || []).map((machine) => (
              <MachineCard
                key={machine.id}
                machine={machine}
                canManage={!machine.fromApi || machine.ownerId === state.auth?.id}
                onDetails={() => showMachineDetails(machine)}
                onEdit={() => startEdit(machine)}
                onDelete={() => deleteMachine(machine.id)}
              />
            ))}
          </div>
        </div>
      </article>
      <dialog
        className="machine-details-dialog"
        ref={machineDetailsDialogRef}
        aria-labelledby="machine-details-title"
        onClose={() => setSelectedMachine(null)}
        onCancel={(event) => {
          event.preventDefault();
          machineDetailsDialogRef.current?.close();
        }}
      >
        {selectedMachine && (
          <div className="machine-details-content">
            <div className="machine-details-heading">
              <div>
                <span className="auth-kicker">Detalhes da máquina</span>
                <h2 id="machine-details-title">{selectedMachine.nome || 'Máquina agrícola'}</h2>
              </div>
              <button
                className="btn secondary small"
                type="button"
                onClick={() => machineDetailsDialogRef.current?.close()}
              >
                Fechar
              </button>
            </div>
            <img
              className="machine-details-image"
              src={selectedMachine.imagem || machineImages[String(selectedMachine.tipo || 'trator').toLowerCase()] || placeholderImage}
              alt={selectedMachine.nome || selectedMachine.tipo || 'Máquina agrícola'}
            />
            <dl className="machine-details-list">
              <div><dt>Tipo</dt><dd>{selectedMachine.tipo || 'Máquina'}</dd></div>
              <div><dt>Diária</dt><dd>R$ {Number(selectedMachine.diaria || 0).toFixed(2)}</dd></div>
              <div><dt>Localização</dt><dd>{selectedMachine.localizacao || 'Engenheiro Coelho'}</dd></div>
              <div><dt>Proprietário</dt><dd>{selectedMachine.proprietario || 'Produtor AgroJusto'}</dd></div>
              <div><dt>Disponibilidade</dt><dd>{selectedMachine.status === 'alugada' ? 'Indisponível' : 'Disponível'}</dd></div>
              <div><dt>Descrição</dt><dd>{selectedMachine.descricao || 'Máquina cadastrada'}</dd></div>
            </dl>
            {selectedMachine.ownerId !== state.auth?.id && (
              <button className="btn small" type="button" onClick={() => setShowRentalForm((visible) => !visible)}>
                {showRentalForm ? 'Fechar aluguel' : 'Alugar máquina'}
              </button>
            )}
            {showRentalForm && selectedMachine.ownerId !== state.auth?.id && (
              <form className="product-form machine-rental-form" onSubmit={submitRental}>
                <label>
                  Data de início
                  <input type="date" min={todayISO()} value={rentalStart} onChange={(event) => setRentalStart(event.target.value)} required />
                </label>
                <label>
                  Data de término
                  <input type="date" min={rentalStart || todayISO()} value={rentalEnd} onChange={(event) => setRentalEnd(event.target.value)} required />
                </label>
                <label>
                  Observações
                  <textarea value={rentalNotes} onChange={(event) => setRentalNotes(event.target.value)} />
                </label>
                <div className="rental-row">
                  <div>
                    <strong>Resumo do aluguel</strong>
                    <p>{selectedMachine.nome}</p>
                    <p>{rentalStart || '—'} a {rentalEnd || '—'} · {selectedRentalDays} diária(s)</p>
                  </div>
                  <strong>{currencyFormatter.format(selectedRentalTotal)}</strong>
                </div>
                {selectedPeriodUnavailable && <p role="alert">A máquina já está reservada em uma ou mais datas selecionadas.</p>}
                <button
                  className="btn small"
                  type="submit"
                  disabled={rentalSubmitting || !selectedRentalDays || selectedPeriodUnavailable}
                >
                  {rentalSubmitting ? 'Registrando...' : 'Confirmar aluguel'}
                </button>
              </form>
            )}
            {rentalMessage && <p className="status-message" role="status">{rentalMessage}</p>}
            {selectedMachineRentals.length > 0 && (
              <div className="rental-history">
                <strong>Aluguéis desta máquina</strong>
                {selectedMachineRentals.map((rental) => (
                  <div className="rental-row" key={rental.id}>
                    <div>
                      <strong>{rental.isOwner ? `Locatário: ${rental.tenant}` : `Proprietário: ${selectedMachine.proprietario}`}</strong>
                      <p>{String(rental.start).slice(0, 10)} a {String(rental.end).slice(0, 10)} · {currencyFormatter.format(Number(rental.total || 0))}</p>
                      <p>Status: {rental.status || (rental.finished ? 'CONCLUIDO' : 'ATIVO')}</p>
                    </div>
                    {rental.isOwner && !rental.finished && rental.status !== 'CONCLUIDO' && (
                      <button
                        className="btn secondary small"
                        type="button"
                        disabled={finishingRentalId === rental.id}
                        onClick={() => finishRental(rental.id)}
                      >
                        {finishingRentalId === rental.id ? 'Finalizando...' : 'Finalizar aluguel'}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </dialog>
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

function MachineCard({ machine, canManage, onDetails, onEdit, onDelete }) {
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
          <button className="btn small" type="button" onClick={onDetails}>Ver detalhes</button>
          {canManage && <button className="btn secondary small" type="button" onClick={onEdit}>Editar</button>}
          {canManage && <button className="btn danger small" type="button" onClick={onDelete}>Excluir</button>}
        </div>
      </div>
    </article>
  );
}
