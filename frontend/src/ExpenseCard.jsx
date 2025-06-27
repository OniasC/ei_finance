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
    <div className="card">
        <h4>Card 1</h4>
        <p>{total !== null ? `$${total.toFixed(2)}` : "Loading..."}</p>
    </div>
  );
}

export default ExpenseCard;