import React from "react";
import "./Dashboard.css"; // Import the CSS file

const Dashboard = () => {
  const mockData = [
    { month: "January", expenses: 1200 },
    { month: "February", expenses: 950 },
    { month: "March", expenses: 1430 },
    { month: "April", expenses: 1100 },
  ];

  return (
    <div className="dashboard-container">
      {/* Horizontal scroll of cards */}
      <div className="card-slider">
        {[1, 2, 3, 4].map((i) => (
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

          <div className="chart-placeholder">
            <p>Chart goes here</p>
          </div>

          <button className="view-all-button">View All Expenses</button>
        </div>

        {/* Form Section */}
        <div className="form-section">
          <h3>Enter Expense Data</h3>
          <form>
            <label>
              Description:
              <input type="text" name="description" />
            </label>
            <label>
              Amount:
              <input type="number" name="amount" />
            </label>
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
