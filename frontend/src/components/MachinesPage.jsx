import { useState } from 'react';
import { useAgro } from '../agroCore.js';

export default function MachinesPage() {
  const { state, dispatch } = useAgro();
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('trator');
  const [diaria, setDiaria] = useState(100);
  const [actionMachine, setActionMachine] = useState(null);
  const [rentalForm, setRentalForm] = useState({ inicio: '', fim: '' });

  function addMachine(event) {
    event.preventDefault();
    if (!nome.trim()) return;
    const machine = { id: crypto.randomUUID(), nome, tipo, status: 'disponivel', imagem: '', diaria, locacao: '1 dia', codigo: `MA-${Math.round(Math.random() * 999)}`, descricao: 'Maquina cadastrada' };
    dispatch({ type: 'setMachines', machines: [...state.machines, machine] });
    setNome('');
  }

  function deleteMachine(id) {
    dispatch({ type: 'setMachines', machines: state.machines.filter((m) => m.id !== id) });
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

  return (
    <section className="tab-panel active">
      <article className="card">
        <div className="section-heading"><div><span className="auth-kicker">Maquinas</span><h2>Catalogo e aluguel</h2></div></div>
        <div className="two-col">
          <MachineForm nome={nome} setNome={setNome} tipo={tipo} setTipo={setTipo} diaria={diaria} setDiaria={setDiaria} addMachine={addMachine} />
          <div className="machines-grid">{(state.machines || []).map((machine) => <MachineCard key={machine.id} machine={machine} onRental={() => openRental(machine)} onDelete={() => deleteMachine(machine.id)} />)}</div>
        </div>
        <RentalHistory rentals={state.rentals || []} />
      </article>
      {actionMachine && <dialog open className="rental-dialog"><div className="dialog-card"><h3>Aluguel de {actionMachine.nome}</h3><label>Inicio<input type="date" value={rentalForm.inicio} onChange={(e) => setRentalForm({ ...rentalForm, inicio: e.target.value })} /></label><label>Fim<input type="date" value={rentalForm.fim} onChange={(e) => setRentalForm({ ...rentalForm, fim: e.target.value })} /></label><div className="dialog-actions"><button className="btn" type="button" onClick={() => finishRental(actionMachine.id)}>Salvar aluguel</button><button className="btn secondary" type="button" onClick={closeRental}>Cancelar</button></div></div></dialog>}
    </section>
  );
}

function MachineForm({ nome, setNome, tipo, setTipo, diaria, setDiaria, addMachine }) {
  return <form className="machine-form" onSubmit={addMachine}><label>Nome<input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required /></label><label>Tipo<select value={tipo} onChange={(e) => setTipo(e.target.value)}><option value="trator">Trator</option><option value="plantadeira">Plantadeira</option><option value="grade">Grade</option><option value="colheitadeira">Colheitadeira</option></select></label><label>Diaria<input type="number" value={diaria} onChange={(e) => setDiaria(Number(e.target.value))} /></label><button className="btn" type="submit">Adicionar maquina</button></form>;
}

function MachineCard({ machine, onRental, onDelete }) {
  return <div className="machine-card"><div className="machine-image"><i className="fa-solid fa-tractor"></i></div><div className="machine-card-content"><strong>{machine.nome}</strong><span className="muted">{machine.tipo}</span><span className="badge">{machine.status}</span><div className="machine-actions"><button className="btn small" type="button" onClick={onRental}>Alugar</button><button className="btn danger small" type="button" onClick={onDelete}>Excluir</button></div></div></div>;
}

function RentalHistory({ rentals }) {
  return <div className="rental-history"><h3>Historico de alugueis</h3>{(rentals || []).length === 0 ? <span className="muted">Nenhum aluguel registrado</span> : rentals.map((r) => <div className="history-row" key={r.id}><span>{r.maquina}</span><strong>{r.inicio} → {r.fim}</strong></div>)}</div>;
}
