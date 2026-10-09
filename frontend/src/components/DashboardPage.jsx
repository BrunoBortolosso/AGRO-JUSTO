import { jsPDF } from 'jspdf';
import { useAgro } from '../agroCore.js';
import DashboardCharts from './DashboardCharts.jsx';

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
});

export default function DashboardPage() {
  const { state, dispatch } = useAgro();
  const products = Array.isArray(state.products) ? state.products : [];
  const machines = Array.isArray(state.machines) ? state.machines : [];
  const costs = Array.isArray(state.costs) ? state.costs : [];
  const pricingHistory = Array.isArray(state.pricing) ? state.pricing : [];

  const totalCosts = costs.reduce((sum, cost) => sum + Number(cost.valor || 0), 0);
  const totalAvailableQuantity = products.reduce((sum, product) => sum + Number(product.quantidade || 0), 0);
  const availableMachines = machines.filter((machine) => String(machine.status || '').toLowerCase() !== 'alugada').length;
  const lowInventory = products.filter((product) => Number(product.quantidade || 0) <= 15).length;

  const latestPricing = [...pricingHistory].sort((a, b) => new Date(b.data || 0) - new Date(a.data || 0))[0];
  const latestPrice = latestPricing ? Number(latestPricing.preco || 0) : 0;

  function exportPdf() {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 14;
    const contentWidth = pageWidth - margin * 2;
    const greenDark = [24, 90, 63];
    const greenMid = [44, 140, 90];
    const greenSoft = [236, 246, 238];
    const greenLine = [201, 221, 208];
    const textDark = [26, 32, 31];
    const textMuted = [98, 108, 116];
    const paper = [255, 255, 255];

    const generatedDate = new Date().toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    const formatMoney = (value) => currencyFormatter.format(Number(value || 0));
    const formatNumber = (value) => Number(value || 0).toLocaleString('pt-BR');
    const safeText = (value, fallback = '—') => (value === null || value === undefined || value === '' ? fallback : String(value));

    function drawFooter(pageNumber) {
      doc.setDrawColor(210, 218, 214);
      doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
      doc.setFontSize(8);
      doc.text('AgroJusto', margin, pageHeight - 7);
      doc.text(`Gerado em ${generatedDate}`, pageWidth / 2, pageHeight - 7, { align: 'center' });
      doc.text(`Página ${pageNumber}`, pageWidth - margin, pageHeight - 7, { align: 'right' });
    }

    function addSectionTitle(title, y) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(greenDark[0], greenDark[1], greenDark[2]);
      doc.setFontSize(13);
      doc.text(title, margin, y);
      doc.setDrawColor(greenLine[0], greenLine[1], greenLine[2]);
      doc.line(margin, y + 2, pageWidth - margin, y + 2);
    }

    function addSummaryCard(label, value, detail, x, y, width, height) {
      doc.setDrawColor(221, 232, 224);
      doc.setFillColor(greenSoft[0], greenSoft[1], greenSoft[2]);
      doc.roundedRect(x, y, width, height, 3, 3, 'FD');
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
      doc.setFontSize(8);
      doc.text(label.toUpperCase(), x + 5, y + 7);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(greenDark[0], greenDark[1], greenDark[2]);
      doc.setFontSize(15);
      doc.text(value, x + 5, y + 20, { maxWidth: width - 10 });
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
      doc.text(detail, x + 5, y + 27, { maxWidth: width - 10 });
    }

    function drawTable(headers, rows, widths, startY, title) {
      const tableHeight = 7;
      const maxY = pageHeight - 24;
      let currentY = startY;

      if (title) {
        addSectionTitle(title, currentY);
        currentY += 10;
      }

      const drawHeader = () => {
        doc.setFillColor(greenDark[0], greenDark[1], greenDark[2]);
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.roundedRect(margin, currentY, contentWidth, tableHeight + 2, 1.5, 1.5, 'F');

        let x = margin;
        headers.forEach((header, index) => {
          doc.text(header, x + 2, currentY + 5.5, { maxWidth: widths[index] - 4 });
          x += widths[index];
        });
        currentY += tableHeight + 2;
      };

      const drawRow = (row) => {
        const cellHeight = 8;
        if (currentY + cellHeight > maxY) {
          doc.addPage();
          currentY = 20;
          drawHeader();
          drawFooter(doc.getNumberOfPages());
        }

        doc.setDrawColor(224, 229, 226);
        doc.setFillColor(255, 255, 255);
        doc.rect(margin, currentY, contentWidth, cellHeight, 'F');
        doc.setDrawColor(224, 229, 226);
        doc.line(margin, currentY + cellHeight, pageWidth - margin, currentY + cellHeight);

        let x = margin;
        row.forEach((cell, index) => {
          const text = safeText(cell, '—');
          const fixedWidth = widths[index] - 4;
          doc.setTextColor(textDark[0], textDark[1], textDark[2]);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(7.2);
          doc.text(String(text).slice(0, 45), x + 2, currentY + 5.5, { maxWidth: fixedWidth });
          x += widths[index];
        });

        currentY += cellHeight;
      };

      drawHeader();
      rows.forEach((row) => drawRow(row));

      return currentY;
    }

    function drawProductChart(yPosition) {
      if (!products.length) return yPosition;

      const chartMax = Math.max(...products.map((product) => Number(product.quantidade || 0)), 1);
      const chartLeft = margin;
      const chartWidth = contentWidth;
      const chartBarHeight = 6;
      const chartGap = 7;
      const trackHeight = chartBarHeight * Math.min(products.length, 6) + chartGap * Math.min(products.length, 6);
      const chartY = yPosition + 12;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(greenDark[0], greenDark[1], greenDark[2]);
      doc.text('Distribuição do estoque', chartLeft, yPosition + 6);

      const visibleProducts = products.slice(0, 6);
      visibleProducts.forEach((product, index) => {
        const available = Number(product.quantidade || 0);
        const barWidth = (available / chartMax) * (chartWidth - 42);
        const y = chartY + index * (chartBarHeight + chartGap);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(textDark[0], textDark[1], textDark[2]);
        doc.text(String(product.nome || 'Produto'), chartLeft, y + 5, { maxWidth: 34 });

        doc.setDrawColor(220, 228, 220);
        doc.roundedRect(chartLeft + 36, y, chartWidth - 42, chartBarHeight, 1.4, 1.4, 'S');
        doc.setFillColor(greenMid[0], greenMid[1], greenMid[2]);
        doc.roundedRect(chartLeft + 36, y, Math.max(barWidth, 0), chartBarHeight, 1.4, 1.4, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(textDark[0], textDark[1], textDark[2]);
        doc.setFontSize(7);
        doc.text(formatNumber(available), chartLeft + chartWidth - 10, y + 5, { align: 'right' });
      });

      return chartY + Math.min(visibleProducts.length, 6) * (chartBarHeight + chartGap) + 8;
    }

    doc.setFillColor(paper[0], paper[1], paper[2]);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    doc.setFillColor(greenDark[0], greenDark[1], greenDark[2]);
    doc.rect(0, 0, pageWidth, 26, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('AgroJusto', margin, 15);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('Relatório do Painel', pageWidth - margin, 16, { align: 'right' });

    let y = 38;
    addSectionTitle('Resumo geral', y);
    y += 10;

    const summaryCards = [
      { label: 'Produtos', value: String(products.length), detail: `${formatNumber(totalAvailableQuantity)} unidades disponíveis` },
      { label: 'Máquinas', value: String(machines.length), detail: `${availableMachines} disponíveis` },
      { label: 'Custos', value: formatMoney(totalCosts), detail: 'totais registrados' },
      { label: 'Preço justo', value: latestPrice ? formatMoney(latestPrice) : '—', detail: latestPricing ? `Último cálculo: ${new Date(latestPricing.data || Date.now()).toLocaleDateString('pt-BR')}` : 'Sem cálculo registrado' }
    ];

    const cardWidth = (contentWidth - 10) / 2;
    const cardHeight = 30;
    summaryCards.forEach((card, index) => {
      const row = Math.floor(index / 2);
      const col = index % 2;
      addSummaryCard(card.label, card.value, card.detail, margin + col * (cardWidth + 10), y + row * (cardHeight + 8), cardWidth, cardHeight);
    });
    y += 70;

    if (latestPricing) {
      addSectionTitle('Preço Justo', y);
      y += 10;

      const pricingCards = [
        ['Custo de produção', formatMoney(latestPricing.preco || 0)],
        ['Preço mínimo', formatMoney(latestPricing.precoMinimo || latestPrice * 0.95 || 0)],
        ['Preço ideal', formatMoney(latestPricing.precoIdeal || latestPrice || 0)]
      ];

      pricingCards.forEach(([label, value], index) => {
        const x = margin + (index * (contentWidth / 3));
        doc.setDrawColor(214, 227, 218);
        doc.setFillColor(248, 251, 249);
        doc.roundedRect(x, y, contentWidth / 3 - 3, 20, 2.5, 2.5, 'FD');
        doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.text(label, x + 4, y + 7);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(greenDark[0], greenDark[1], greenDark[2]);
        doc.setFontSize(10);
        doc.text(value, x + 4, y + 15, { maxWidth: (contentWidth / 3) - 10 });
      });
      y += 28;
    }

    const productRows = products.map((product) => [
      safeText(product.nome, 'Produto sem nome'),
      formatNumber(product.quantidade || 0),
      safeText(product.unidade || product.unidadeMedida || 'unidade'),
      safeText(product.cultivo || product.tipoCultivo || '—'),
      formatMoney(product.preco || 0)
    ]);

    if (products.length) {
      y = drawProductChart(y);
      y = drawTable(['Produto', 'Qtd.', 'Unidade', 'Cultivo', 'Preço'], productRows, [52, 18, 24, 38, 28], y + 5, 'Produtos cadastrados');
    } else {
      addSectionTitle('Produtos cadastrados', y);
      y += 10;
      doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text('Nenhum produto cadastrado no painel no momento da exportação.', margin, y + 8);
      y += 18;
    }

    const machineRows = machines.map((machine) => {
      const isAvailable = String(machine.status || '').toLowerCase() !== 'alugada';
      return [
        safeText(machine.nome, 'Máquina sem nome'),
        safeText(machine.tipo || '—'),
        safeText(machine.localizacao || machine.regiao || '—'),
        isAvailable ? 'Disponível' : 'Alugada',
        formatMoney(machine.diaria || 0)
      ];
    });

    if (machines.length) {
      y = drawTable(['Máquina', 'Tipo', 'Local', 'Status', 'Diária'], machineRows, [52, 22, 48, 28, 22], y + 8, 'Máquinas e aluguéis');
    } else {
      addSectionTitle('Máquinas e aluguéis', y);
      y += 10;
      doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text('Nenhuma máquina cadastrada no painel no momento da exportação.', margin, y + 8);
      y += 18;
    }

    if (!products.length && !machines.length) {
      doc.setTextColor(greenDark[0], greenDark[1], greenDark[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('Sem dados para apresentar em gráficos ou tabelas no momento.', margin, y + 14);
    }

    drawFooter(1);
    doc.save('agrojusto-relatorio-painel.pdf');
  }

  const metricCards = [
    { label: 'Produtos', value: products.length, hint: `${totalAvailableQuantity} unidades disponíveis`, icon: '🌱' },
    { label: 'Máquinas', value: machines.length, hint: `${availableMachines} disponíveis`, icon: '🚜' },
    { label: 'Custos', value: currencyFormatter.format(totalCosts), hint: 'totais registrados', icon: '💰' },
    { label: 'Preço justo', value: latestPrice ? currencyFormatter.format(latestPrice) : '—', hint: latestPricing ? `Último cálculo • ${new Date(latestPricing.data).toLocaleDateString('pt-BR')}` : 'Sem cálculo registrado', icon: '📊' }
  ];

  const recentProducts = products.slice(0, 3);
  const recentMachines = machines.slice(0, 3);
  const quickActions = [
    { label: 'Preço justo', onClick: () => dispatch({ type: 'setTab', tab: 'precificacao' }) },
    { label: 'Produtos', onClick: () => dispatch({ type: 'setTab', tab: 'produtos' }) },
    { label: 'Máquinas', onClick: () => dispatch({ type: 'setTab', tab: 'maquinas' }) }
  ];

  return (
    <section className="tab-panel active">
      <article className="card dashboard-shell">
        <div className="dashboard-topbar">
          <div className="dashboard-branding">
            <span className="auth-kicker">Painel</span>
            <h2>Painel</h2>
          </div>
          <div className="dashboard-actions">
            <button className="btn secondary" type="button" onClick={exportPdf}>Exportar PDF</button>
          </div>
        </div>

        <div className="dashboard-summary">
          {metricCards.map((card) => (
            <div className="dashboard-card" key={card.label}>
              <div className="metric-icon">{card.icon}</div>
              <div className="metric-content">
                <span className="metric-label">{card.label}</span>
                <strong>{card.value}</strong>
                <small>{card.hint}</small>
              </div>
            </div>
          ))}
        </div>

        <div className="dashboard-grid">
          <div className="panel-card chart-panel">
            <div className="panel-header">
              <div>
                <span className="panel-kicker">Estoque</span>
                <h3>Produtos por quantidade</h3>
              </div>
            </div>
            {products.length ? (
              <DashboardCharts products={products} />
            ) : (
              <div className="dashboard-empty">
                <p>Nenhum produto cadastrado ainda.</p>
              </div>
            )}
          </div>

          <div className="panel-card insight-panel">
            <div className="panel-header">
              <div>
                <span className="panel-kicker">Resumo</span>
                <h3>Rápido</h3>
              </div>
            </div>

            <div className="quick-actions">
              {quickActions.map((action) => (
                <button key={action.label} type="button" className="quick-action" onClick={action.onClick}>
                  {action.label}
                </button>
              ))}
            </div>

            <ul className="insight-list compact-list">
              <li>
                <span>Produtos disponíveis</span>
                <strong>{totalAvailableQuantity}</strong>
              </li>
              <li>
                <span>Máquinas disponíveis</span>
                <strong>{availableMachines}</strong>
              </li>
              <li>
                <span>Estoque baixo</span>
                <strong>{lowInventory}</strong>
              </li>
            </ul>
          </div>
        </div>

        <div className="dashboard-detail-grid">
          <div className="panel-card dashboard-list-panel">
            <div className="panel-header">
              <div>
                <span className="panel-kicker">Preço justo</span>
                <h3>Último cálculo</h3>
              </div>
            </div>

            {latestPricing ? (
              <div className="dashboard-pricing-card">
                <div className="dashboard-pricing-head">
                  <div>
                    <span className="dashboard-pricing-label">Produto</span>
                    <strong>{latestPricing.produto || 'Preço Justo'}</strong>
                  </div>
                  <span className="status-chip">{new Date(latestPricing.data).toLocaleDateString('pt-BR')}</span>
                </div>

                <div className="dashboard-pricing-values">
                  <div>
                    <span>Custo de produção</span>
                    <strong>{currencyFormatter.format(Number(latestPricing.preco || 0))}</strong>
                  </div>
                  <div>
                    <span>Preço mínimo</span>
                    <strong>{currencyFormatter.format(Number(latestPricing.preco || 0) * 0.95)}</strong>
                  </div>
                  <div>
                    <span>Preço ideal</span>
                    <strong>{currencyFormatter.format(Number(latestPricing.preco || 0))}</strong>
                  </div>
                </div>
              </div>
            ) : (
              <div className="dashboard-empty compact">
                <p>Ainda não houve um cálculo de preço justo registrado.</p>
              </div>
            )}
          </div>

          <div className="panel-card dashboard-list-panel">
            <div className="panel-header">
              <div>
                <span className="panel-kicker">Produtos</span>
                <h3>Estoque atual</h3>
              </div>
            </div>

            <div className="dashboard-list">
              {recentProducts.length ? (
                recentProducts.map((product) => (
                  <div className="dashboard-list-item" key={product.id || product.nome}>
                    <div className="dashboard-item-media">
                      {product.imagem ? <img src={product.imagem} alt={product.nome} /> : <span>🌾</span>}
                    </div>
                    <div className="dashboard-item-meta">
                      <strong>{product.nome}</strong>
                      <small>{Number(product.quantidade || 0)} unidades</small>
                    </div>
                    <div className="dashboard-item-value">
                      <span>Preço</span>
                      <strong>{currencyFormatter.format(Number(product.preco || 0))}</strong>
                    </div>
                  </div>
                ))
              ) : (
                <div className="dashboard-empty compact">
                  <p>Nenhum produto cadastrado ainda.</p>
                </div>
              )}
            </div>
          </div>

          <div className="panel-card dashboard-list-panel">
            <div className="panel-header">
              <div>
                <span className="panel-kicker">Máquinas</span>
                <h3>Disponibilidade</h3>
              </div>
            </div>

            <div className="dashboard-list">
              {recentMachines.length ? (
                recentMachines.map((machine) => {
                  const isAvailable = String(machine.status || '').toLowerCase() !== 'alugada';
                  return (
                    <div className="dashboard-list-item" key={machine.id || machine.nome}>
                      <div className="dashboard-item-media machine-media">
                        {machine.imagem ? <img src={machine.imagem} alt={machine.nome} /> : <span>🚜</span>}
                      </div>
                      <div className="dashboard-item-meta">
                        <strong>{machine.nome}</strong>
                        <small>{machine.localizacao || 'Localização não informada'}</small>
                      </div>
                      <div className="dashboard-item-status">
                        <span className={isAvailable ? 'status-ok' : 'status-warning'}>{isAvailable ? 'Disponível' : 'Alugada'}</span>
                        <strong>{currencyFormatter.format(Number(machine.diaria || 0))}/dia</strong>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="dashboard-empty compact">
                  <p>Nenhuma máquina cadastrada ainda.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}
