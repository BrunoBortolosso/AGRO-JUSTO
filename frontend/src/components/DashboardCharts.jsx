import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

export default function DashboardCharts({ products }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const chart = new Chart(canvasRef.current, {
      type: 'bar',
      data: {
        labels: (products || []).map((product) => product.nome),
        datasets: [{
          label: 'Produtos',
          data: (products || []).map((product) => product.quantidade),
          borderWidth: 1,
          backgroundColor: '#2e7d4f'
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });

    return () => chart.destroy();
  }, [products]);

  return <div className="chart-box"><canvas ref={canvasRef}></canvas></div>;
}
