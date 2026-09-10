import { useState } from 'react';
import { jsPDF } from 'jspdf';
import { useAgro } from '../agroCore.js';
import DashboardCharts from './DashboardCharts.jsx';

export default function DashboardPage() {
  const { state, dispatch } = useAgro();
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({ nome: state.profile?.nome || '', regiao: state.profile?.regiao || '', bio: state.profile?.bio || '' });
  const totalCosts = (state.costs || []).reduce((sum, cost) => sum + Number(cost.valor || 0), 0);

  function openProfile() {
    setProfileForm({ nome: state.profile?.nome || '', regiao: state.profile?.regiao || '', bio: state.profile?.bio || '' });
    setProfileOpen(true);
  }

  function saveProfile(event) {
    event.preventDefault();
    dispatch({ type: 'setProfile', profile: { ...state.profile, nome: profileForm.nome, regiao: profileForm.regiao, bio: profileForm.bio } });
    setProfileOpen(false);
  }

  function exportPdf() {
    const doc = new jsPDF();
    doc.text('AgroJusto - Relatorio', 14, 14);
    doc.text(`Produtos: ${(state.products || []).length}`, 14, 30);
    doc.text(`Maquinas: ${(state.machines || []).length}`, 14, 40);
    doc.text(`Custos: R$ ${totalCosts}`, 14, 50);
    doc.save('agrojusto-relatorio.pdf');
  }

  return (
    <section className="tab-panel active">
      <article className="card">
        <div className="section-heading">
          <div><span className="auth-kicker">Painel</span><h2>Dashboard</h2></div>
          <div className="dashboard-actions">
            <button className="btn ghost" type="button" onClick={openProfile}>Editar perfil</button>
            <button className="btn secondary" type="button" onClick={exportPdf}>Exportar PDF</button>
          </div>
        </div>
        <div className="dashboard-cards">
          <div className="dashboard-card"><span className="metric-label">Produtos</span><strong>{(state.products || []).length}</strong></div>
          <div className="dashboard-card"><span className="metric-label">Maquinas</span><strong>{(state.machines || []).length}</strong></div>
          <div className="dashboard-card"><span className="metric-label">Custos</span><strong>R$ {totalCosts}</strong></div>
        </div>
        <DashboardCharts products={state.products || []} />
      </article>
      {profileOpen && <dialog open className="profile-dialog"><div className="dialog-card"><h3>Editar perfil</h3><form onSubmit={saveProfile} className="profile-form"><label>Nome<input type="text" value={profileForm.nome} onChange={(e) => setProfileForm({ ...profileForm, nome: e.target.value })} required /></label><label>Regiao<input type="text" value={profileForm.regiao} onChange={(e) => setProfileForm({ ...profileForm, regiao: e.target.value })} /></label><label>Bio<textarea value={profileForm.bio} onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })} /></label><div className="dialog-actions"><button className="btn" type="submit">Salvar</button><button className="btn secondary" type="button" onClick={() => setProfileOpen(false)}>Cancelar</button></div></form></div></dialog>}
    </section>
  );
}
