import React, { useEffect, useState } from "react";

function ExpenseCard() {
  const [total, setTotal] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/total-expenses")
      .then((res) => res.json())
      .then((data) => setTotal(data.total_expenses))
      .catch((err) => console.error("Error fetching total expenses:", err));
  }, []);

  return (
    <div style={{
      border: "1px solid #ccc",
      borderRadius: "10px",
      padding: "20px",
      width: "300px",
      boxShadow: "0 0 10px rgba(0,0,0,0.1)"
    }}>
      <h3>Total Expenses</h3>
      <p style={{ fontSize: "24px", color: "#2c3e50" }}>
        {total !== null ? `$${total.toFixed(2)}` : "Loading..."}
      </p>
    </div>
  );
}

export default ExpenseCard;