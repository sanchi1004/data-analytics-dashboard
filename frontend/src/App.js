import React, { useState } from "react";
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
  const [company, setCompany] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [analyticData, setAnalyticData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAnalytics = async () => {
    if (!company.trim()) {
      setError("Please enter a company name.");
      return;
    }
    setLoading(true);
    setError(null);
    setAnalyticData(null);

    const params = new URLSearchParams({ company });
    if (fromDate) params.append("from", fromDate);
    if (toDate) params.append("to", toDate);

    try {
      const res = await fetch(`/api/analytics?${params.toString()}`);
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to fetch analytics");
      }
      const data = await res.json();
      setAnalyticData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchAnalytics();
  };

  const chartData =
    analyticData?.sales
      ? {
          labels: analyticData.sales.map((s) => s.date),
          datasets: [
            {
              label: "Sales",
              data: analyticData.sales.map((s) => s.value),
              borderColor: "rgb(75,192,192)",
              backgroundColor: "rgba(75,192,192,0.2)",
              tension: 0.3,
            },
          ],
        }
      : null;

  return (
    <main
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        maxWidth: "900px",
        margin: "auto",
      }}
    >
      <header style={{ marginBottom: "20px" }}>
        <h1>Dynamic Business Analytics Dashboard</h1>
        <p>Get custom analytics by entering your company name and date range.</p>
      </header>

      <form
        onSubmit={handleSubmit}
        style={{ marginBottom: "20px", display: "flex", gap: "10px", flexWrap: "wrap" }}
      >
        <input
          type="text"
          placeholder="Company Name"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          required
          style={{ flexGrow: 1, padding: "8px" }}
        />
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          title="From Date (optional)"
        />
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          title="To Date (optional)"
        />
        <button type="submit" disabled={loading} style={{ padding: "8px 16px" }}>
          {loading ? "Loading..." : "Get Analytics"}
        </button>
      </form>

      {error && (
        <div style={{ color: "red", marginBottom: "20px" }}>
          {error}
        </div>
      )}

      {analyticData && !loading && !error && (
        <>
          <SummaryCards revenue={analyticData.revenue} users={analyticData.users} />
          {chartData ? (
            <section>
              <Line
                data={chartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: "top" },
                    title: { display: true, text: "Sales Over Time" },
                    tooltip: { mode: "index", intersect: false },
                  },
                  interaction: { mode: "nearest", axis: "x", intersect: false },
                  scales: {
                    x: { title: { display: true, text: "Date" } },
                    y: { title: { display: true, text: "Sales Value" }, beginAtZero: true },
                  },
                }}
              />
            </section>
          ) : (
            <p>No sales data available.</p>
          )}
          {analyticData.summary && (
            <p style={{ marginTop: "20px", fontStyle: "italic" }}>{analyticData.summary}</p>
          )}
        </>
      )}
    </main>
  );
}

export default App;
