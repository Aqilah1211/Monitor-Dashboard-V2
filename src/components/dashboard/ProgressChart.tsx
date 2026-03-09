import { memo } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useApp } from '../../context/AppContext';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler);

export const ProgressChart = memo(function ProgressChart() {
  const { data } = useApp();
  
  const installedCount = data?.installed.length || 0;
  const totalCount = data?.all.length || 0;
  const percentage = totalCount > 0 ? Math.round((installedCount / totalCount) * 100) : 0;

  const chartData = {
    labels: ['Target', 'Selesai'],
    datasets: [{
      label: 'Progres (%)',
      data: [100, percentage],
      borderColor: '#2563eb',
      backgroundColor: 'rgba(37, 99, 235, 0.1)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#fff',
      pointRadius: 5,
      pointHoverRadius: 7
    }]
  };

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(value: string | number) {
            return `${value}%`;
          }
        }
      },
      x: { grid: { display: false } }
    }
  };

  return (
    <div className="glass-card p-6 rounded-3xl shadow-sm mb-8">
      <h3 className="font-bold text-lg mb-6">Tren Progres Pemasangan</h3>
      <div className="h-[300px] w-full">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
});
