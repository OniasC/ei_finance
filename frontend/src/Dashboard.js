import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";
import "./Dashboard.css";
import ExpenseCard from "./ExpenseCard"; // Adjust path if needed
import ExpenseForm  from "./ExpenseForm";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

const Dashboard = () => {
  const mockData = [
    { month: "January", expenses: 1200 },
    { month: "February", expenses: 950 },
    { month: "March", expenses: 1430 },
    { month: "April", expenses: 1100 },
  ];

  const [xData, setXData] = useState([]);
  const [yData, setYData] = useState([]);
  const [startX, setStartX] = useState(0);
  const [endX, setEndX] = useState(20);

  const fetchChartData = async () => {
    try {
      const res = await fetch(`http://localhost:5000/chart-data?start_x=${startX}&end_x=${endX}`);
      const data = await res.json();
      setXData(data.x);
      setYData(data.y);
    } catch (error) {
      console.error("Failed to fetch chart data:", error);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, [startX, endX]);

  const chartData = {
    labels: xData,
    datasets: [
      {
        label: "Sensor Reading",
        data: yData,
        fill: false,
        borderColor: "rgba(54, 162, 235, 1)",
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="dashboard-container">
      {/* Horizontal scroll of cards */}
      <div className="card-slider">
        {/* First card shows Python backend data */}
        <ExpenseCard />

        {/* Other mock cards */}
        {[2, 3, 4].map((i) => (
          <div key={i} className="card">
            <h4>Card {i}</h4>
            <p>Info about card {i}</p>
          </div>
        ))}
      </div>

      {/* Main content section */}
      <div className="main-section">
        {/* Chart Section */}
        <div className="chart-section">
          <h3>Monthly Expenses</h3>
          <ul>
            {mockData.map((entry) => (
              <li key={entry.month}>
                <strong>{entry.month}:</strong> ${entry.expenses}
              </li>
            ))}
          </ul>

          <div className="chart-section_2">
          <h3>Sensor Chart</h3>
          <Line data={chartData} />
          <div style={{ marginTop: "10px" }}>
            <label>
              Start X:
              <input
                type="number"
                value={startX}
                onChange={(e) => setStartX(Number(e.target.value))}
              />
            </label>
            <label style={{ marginLeft: "10px" }}>
              End X:
              <input
                type="number"
                value={endX}
                onChange={(e) => setEndX(Number(e.target.value))}
              />
            </label>
          </div>
          </div>

          <button className="view-all-button">View All Expenses</button>
        </div>

        {/* Form Section */}
        <div className="form-section">
          <h3>Enter Expense Data</h3>
          <ExpenseForm />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
