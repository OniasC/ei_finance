import React, { useEffect, useState } from "react";
import ChartWrapper from "./ChartWrapper";
import { chartData } from "./chartData";

function App() {
  const [logs, setLogs] = useState([]);
  const [message, setMessage] = useState("");
  const [level, setLevel] = useState("INFO");

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

  return (
    <div>
      <h1>📜 Log Records</h1>
      {/* Chart integration */}
      <ChartWrapper data1={chartData} />

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
    </div>
  );
}

export default App;