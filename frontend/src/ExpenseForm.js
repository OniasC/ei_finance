import React, { useState, useEffect } from "react";
import TagInput from "./TagInput";

function ExpenseForm() {
  const today = new Date().toISOString().slice(0, 10);

  const [form, setForm] = useState({
    name: "",
    date: today,
    inout: "out",
    amount: "",
    currency: "",
    account: "",
    description: "",
    category: "",
    tags: "",
    recurring: false,
    frequency: "",
  });
  const [message, setMessage] = useState("");
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [accountOptions, setAccountOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [tagOptions, setTagOptions] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/options/currency")
      .then((res) => res.json())
      .then((options) => {
        setCurrencyOptions(options);
        setForm((prev) => ({
          ...prev,
          currency: prev.currency || options[0] || "",
        }));
      });
    fetch("http://localhost:5000/options/account")
      .then((res) => res.json())
      .then((options) => {
        setAccountOptions(options);
        setForm((prev) => ({
          ...prev,
          account: prev.account || options[0] || "",
        }));
      });
    fetch("http://localhost:5000/options/category")
      .then((res) => res.json())
      .then(setCategoryOptions);
    fetch("http://localhost:5000/options/tags")
      .then((res) => res.json())
      .then(setTagOptions);
  }, []);

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
        setForm((prev) => ({
            ...prev,
            name: "",
            date: today,
            amount: "",
            description: "",
            category: "",
            tags: "",
            recurring: false,
            frequency: "",
        }));
      } else {
        setMessage("Error: " + data.error);
      }
    } catch (err) {
      setMessage("Error: " + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Name */}
      <label>
        Name:
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
        />
      </label>

      {/* inout, amount, currency in one row */}
      <div style={{ display: "flex", alignItems: "center", gap: "1em" }}>
        <label>
          In/Out:
          <select
            name="inout"
            value={form.inout}
            onChange={handleChange}
            style={{ width: "70px" }}
          >
            <option value="in">in</option>
            <option value="out">out</option>
          </select>
        </label>
        <label>
          Amount:
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            style={{ width: "100px" }}
          />
        </label>
        <label>
          Currency:
          <select
            name="currency"
            value={form.currency}
            onChange={handleChange}
            style={{ width: "80px" }}
          >
            {currencyOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Account */}
      <label>
        Account:
        <select name="account" value={form.account} onChange={handleChange}>
          {accountOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </label>

      {/* Description */}
      <label>
        Description:
        <input
          type="text"
          name="description"
          value={form.description}
          onChange={handleChange}
        />
      </label>

      {/* Category */}
      <label>
        Category:
        <select name="category" value={form.category} onChange={handleChange}>
          {categoryOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </label>

      {/* Tags */}
      <label>
        Tags:
        <TagInput
            value={form.tags}
            onChange={(tags) => setForm((prev) => ({ ...prev, tags }))}
            fetchUrl="http://localhost:5000/options/tags"
        />
      </label>

      {/* Recurring and Frequency */}
      <div>
        <label>
          Recurring:
          <input
            type="checkbox"
            name="recurring"
            checked={form.recurring}
            onChange={handleChange}
          />
        </label>
        {form.recurring && (
          <label>
            Frequency:
            <input
              name="frequency"
              value={form.frequency}
              onChange={handleChange}
              placeholder="e.g. weekly"
            />
          </label>
        )}
      </div>

      <button type="submit">Submit</button>
      <div>{message}</div>
    </form>
  );
}

export default ExpenseForm;