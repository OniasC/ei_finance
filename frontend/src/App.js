import React, { useEffect, useState } from "react";

function App() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/logs")
      .then((res) => res.json())
      .then((data) => setLogs(data))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  return (
    <div>
      <h1>📜 Log Records</h1>
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Message</th>
            <th>Level</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td>{log.id}</td>
              <td>{log.message}</td>
              <td>{log.level}</td>
              <td>{log.created_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;