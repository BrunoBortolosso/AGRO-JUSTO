import { useAgro } from '../agroCore.js';

export default function HomePage() {
  const { dispatch } = useAgro();

  return (
    <section className="tab-panel active">
      <article className="hero card">
        <div>
          <h2>Tecnologia simples para fortalecer o pequeno produtor</h2>
          <p>O AgroJusto calcula preco minimo e preco ideal com base em custos, oferta, demanda e logistica, alem de conectar produtores no aluguel colaborativo de maquinas.</p>
          <div className="hero-actions">
            <button className="btn" data-go="precificacao" type="button" onClick={() => dispatch({ type: 'setTab', tab: 'precificacao' })}>Calcular preco</button>
            <button className="btn secondary" data-go="maquinas" type="button" onClick={() => dispatch({ type: 'setTab', tab: 'maquinas' })}>Ver maquinas</button>
          </div>
        </div>
        <img src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=80" alt="Produtor no campo" />
      </article>
      <article className="grid-3">
        <div className="card mini"><h3>1. Precificacao inteligente</h3><p>Evite prejuizo com base real de custo e ajuste de mercado local simulado.</p></div>
        <div className="card mini"><h3>2. Produtos e maquinas</h3><p>Organize sua safra e construa um ciclo produtivo com agilidade.</p></div>
        <div className="card mini"><h3>3. Painel de acompanhamento</h3><p>Compare indicadores e acompanhe seus custos com clareza.</p></div>
      </article>
    </section>
  );
}
