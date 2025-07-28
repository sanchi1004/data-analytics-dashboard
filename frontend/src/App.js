import React, { useEffect, useState } from "react";
import SummaryCards from "./SummaryCards";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/analytics")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching analytics data:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading analytics data...</div>;
  if (error)
    return (
      <div style={{ color: "red" }}>
        Error loading analytics data: {error}
      </div>
    );

  const chartData = {
    labels: data.sales.map((s) => s.date),
    datasets: [
      {
        label: "Sales",
        data: data.sales.map((s) => s.value),
        borderColor: "rgb(75,192,192)",
        backgroundColor: "rgba(75,192,192,0.2)",
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Sales Over Time" },
      tooltip: { mode: "index", intersect: false },
    },
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },
    scales: {
      x: {
        title: { display: true, text: "Date" },
      },
      y: {
        title: { display: true, text: "Sales Value" },
        beginAtZero: true,
      },
    },
  };

  return (
    <main style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <header style={{ marginBottom: "20px" }}>
        <h1>Business Analytics Dashboard</h1>
        <p>
          View sales trends, key business metrics, and customer insights at a
          glance.
        </p>
      </header>

      <SummaryCards revenue={data.revenue} users={data.users} />

      <section>
        <Line data={chartData} options={options} />
      </section>
    </main>
  );
}

export default App;
