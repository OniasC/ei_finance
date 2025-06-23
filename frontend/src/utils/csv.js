export function parseCSV(text) {
  const lines = text.trim().split("\n");
  const headers = lines[0].split(",");
  return lines.slice(1).map(line => {
    const values = line.split(",");
    const obj = {};
    headers.forEach((h, i) => {
      obj[h.trim()] = values[i].trim();
    });
    return obj;
  });
}

export function toCSV(dataArray) {
  if (!Array.isArray(dataArray) || dataArray.length === 0) return "";
  const headers = Object.keys(dataArray[0]);
  const csvRows = dataArray.map(row => headers.map(h => row[h]).join(","));
  return [headers.join(","), ...csvRows].join("\n");
}