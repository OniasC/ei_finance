import React, { useEffect, useState } from "react";
import ChartWrapper from "./ChartWrapper";
import { chartData } from "./chartData";

function App() {
  // const [logs, setLogs] = useState([]);
  const [message, setMessage] = useState("");
  const [level, setLevel] = useState("INFO");
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuOption, setMenuOption] = useState("view");
  const [logs, setRules] = useState([]);

  // Fetch logs from backend

  const fetchLogs = () => {
    fetch("http://localhost:8080/logs")
      .then((res) => res.json())
      .then((data) => setLogs(data))
      .catch((err) => console.error("Fetch error:", err));
  };

  useEffect(() => {
    fetchLogs();
  }, []);


  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:8080/logs/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, level }),
    })
      .then(() => {
        setMessage(""); // Clear input field
        fetchLogs(); // Refresh logs
      })
      .catch((err) => console.error("Post error:", err));
  };

  const [selectedSeries, setSelectedSeries] = useState(
    chartData.tempname.map(() => true)
  );

  const handleSeriesToggle = (idx) => {
    setSelectedSeries((prev) =>
      prev.map((val, i) => (i === idx ? !val : val))
    );
  };

  useEffect(() => {
    if (menuOption === "setrules") {
      fetch("http://localhost:8080/logs")
        .then((res) => res.json())
        .then((data) => setRules(data))
        .catch((err) => console.error("Fetch logs error:", err));
    }
  }, [menuOption]);

  return (
    <div>
      {/* Burger menu */}
      <div style={{ position: "relative" }}>
        <button
          onClick={() => setMenuOpen((open) => !open)}
          style={{
            fontSize: "2em",
            background: "none",
            border: "none",
            cursor: "pointer",
            margin: "0.5em",
          }}
          aria-label="Open menu"
        >
          &#9776;
        </button>
        {menuOpen && (
          <div
            style={{
              position: "absolute",
              top: "2.5em",
              left: 0,
              background: "#fff",
              border: "1px solid #ccc",
              borderRadius: "4px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              zIndex: 10,
              minWidth: "120px",
            }}
          >
            <div
              style={{ padding: "1em", cursor: "pointer" }}
              onClick={() => {
                setMenuOption("view");
                setMenuOpen(false);
              }}
            >
              View
            </div>
            <div
              style={{ padding: "1em", cursor: "pointer" }}
              onClick={() => {
                setMenuOption("setrules");
                setMenuOpen(false);
              }}
            >
              Set Rules
            </div>
          </div>
        )}
      </div>

      {/* Main content based on menuOption */}
      {menuOption === "view" ? (
        <>
          <h1>📜 Log Records</h1>
          {/* Chart integration */}
          <div style={{ marginBottom: "1em" }}>
            {chartData.tempname.map((s, idx) => (
              <label key={s.name} style={{ marginRight: "1em" }}>
                <input
                  type="checkbox"
                  checked={selectedSeries[idx]}
                  onChange={() => handleSeriesToggle(idx)}
                />
                {s.name}
              </label>
            ))}
          </div>
          {/* Chart integration */}
          <div style={{ marginBottom: "4em" }}>
            <ChartWrapper
              labels={chartData.labels}
              series={chartData.tempname.filter((_, idx) => selectedSeries[idx])}
            />
          </div>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter log message"
              required
            />
            <select value={level} onChange={(e) => setLevel(e.target.value)}>
              <option value="INFO">INFO</option>
              <option value="WARNING">WARNING</option>
              <option value="ERROR">ERROR</option>
            </select>
            <button type="submit">Add Log</button>
          </form>
          <button onClick={fetchLogs}>Refresh Logs</button>
          <table border="1">
            <thead>
              <tr>
                <th>ID</th>
                <th>Message</th>
                <th>Level</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td>{log.id}</td>
                  <td>{log.message}</td>
                  <td>{log.level}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <div style={{ padding: "2em" }}>
          <h2>Rules from Database</h2>
          {logs.length > 0 ? (
            <table border="1">
              <thead>
                <tr>
                  {Object.keys(logs[0]).map(col => (
                    <th key={col}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {logs.map((rule, idx) => (
                  <tr key={idx}>
                    {Object.values(rule).map((val, i) => (
                      <td key={i}>{String(val)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div>No logs found.</div>
        )}
          </div>
      )}
    </div>
  );
}

export default App;