import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/analytics')
      .then(res => res.json())
      .then(json => setData(json))
      .catch(err => console.error('Error fetching analytics data:', err));
  }, []);

  if (!data) return <div>Loading analytics data...</div>;

  const chartData = {
    labels: data.sales.map(s => s.date),
    datasets: [
      {
        label: 'Sales',
        data: data.sales.map(s => s.value),
        borderColor: 'rgb(75,192,192)',
        backgroundColor: 'rgba(75,192,192,0.2)',
      }
    ]
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Data Analytics Dashboard</h1>
      <p>Total Revenue: ${data.revenue}</p>
      <p>Total Users: {data.users}</p>
      <Line data={chartData} />
    </div>
  );
}

export default App;
