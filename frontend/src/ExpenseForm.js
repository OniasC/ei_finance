import React, { useState } from "react";

function ExpenseForm() {
  const [form, setForm] = useState({
    name: "",
    date: "",
    currency: "",
    amount: "",
    account: "",
    description: "",
    category: "",
    tags: "",
    recurring: false,
    frequency: "",
    inout: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Submitting...");
    try {
      const res = await fetch("http://localhost:5000/expense", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Success: " + data.message);
      } else {
        setMessage("Error: " + data.error);
      }
    } catch (err) {
      setMessage("Error: " + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {Object.keys(form).map((key) =>
        key === "recurring" ? (
          <label key={key}>
            Recurring:
            <input
              type="checkbox"
              name="recurring"
              checked={form.recurring}
              onChange={handleChange}
            />
          </label>
        ) : (
          <label key={key}>
            {key.charAt(0).toUpperCase() + key.slice(1)}:
            <input
              type={key === "date" ? "date" : "text"}
              name={key}
              value={form[key]}
              onChange={handleChange}
            />
          </label>
        )
      )}
      <button type="submit">Submit</button>
      <div>{message}</div>
    </form>
  );
}

export default ExpenseForm;