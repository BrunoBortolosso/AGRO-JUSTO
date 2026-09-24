import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

export default function DashboardCharts({ products }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const chartProducts = products || [];
    const chart = new Chart(canvasRef.current, {
      type: 'bar',
      data: {
        labels: chartProducts.map((product) => product.nome),
        datasets: [{
          label: 'Quantidade',
          data: chartProducts.map((product) => Number(product.quantidade || 0)),
          borderWidth: 0,
          borderRadius: 10,
          backgroundColor: ['#2e7d4f', '#4f9d6b', '#f2b441', '#8a5c3b', '#184d3b', '#5e9b7a']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(24, 77, 59, 0.08)'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });

    return () => chart.destroy();
  }, [products]);

  return <div className="chart-box"><canvas ref={canvasRef}></canvas></div>;
}
