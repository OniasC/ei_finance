import React, { useEffect, useState } from "react";
import ChartWrapper from "./ChartWrapper";
import { chartData } from "./chartData";
//import { Card, CardContent } from "@/components/ui/card";
//import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {mockChartData, mockCards, mockData} from "./chartData";
import Dashboard from "./Dashboard";


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

  fetch("http://localhost:5000/run-script", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ param: "hello!!" }),
  })
  .then((res) => res.json())
  .then((data) => console.log(data));

  const [startIndex, setStartIndex] = useState(0);
  const visibleCards = mockCards.slice(startIndex, startIndex + 3);

  const slideLeft = () => {
    setStartIndex(Math.max(0, startIndex - 1));
  };

  const slideRight = () => {
    setStartIndex(Math.min(mockCards.length - 3, startIndex + 1));
  };


  return <Dashboard />;
}

export default App;