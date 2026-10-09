import agroLogo from '../assets/LOGO.png';

export default function HomePage() {
  return (
    <section className="tab-panel active home-page">
      <article className="hero card hero-section">
        <div className="hero-copy">
          <span className="hero-badge">Plataforma para produtores rurais</span>
          <h2>Tecnologia simples para fortalecer o pequeno produtor</h2>
          <p>O AgroJusto calcula preco minimo e preco ideal com base em custos, oferta, demanda e logistica, alem de conectar produtores no aluguel colaborativo de maquinas.</p>
        </div>
        <div className="hero-visual">
          <img src={agroLogo} alt="Logo AgroJusto" className="hero-logo" />
        </div>
      </article>
      <article className="grid-3">
        <div className="card mini"><h3>1. Precificacao inteligente</h3><p>Evite prejuizo com base real de custo e ajuste de mercado local simulado.</p></div>
        <div className="card mini"><h3>2. Produtos e maquinas</h3><p>Organize sua safra e construa um ciclo produtivo com agilidade.</p></div>
        <div className="card mini"><h3>3. Painel de acompanhamento</h3><p>Compare indicadores e acompanhe seus custos com clareza.</p></div>
      </article>
    </section>
  );
}
