import { parseCSV, toCSV } from "../utils/csv.js";

export async function loadCSV(filePath) {
  const response = await fetch(filePath);
  const text = await response.text();
  return parseCSV(text);
}

export function saveCSVToDownload(dataArray, filename = "data.csv") {
  const blob = new Blob([toCSV(dataArray)], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}