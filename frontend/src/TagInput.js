import React, { useState, useEffect, useRef } from "react";

export default function TagInput({ value, onChange, fetchUrl }) {
  const [allTags, setAllTags] = useState([]);
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const inputRef = useRef();

  // Fetch tags from backend
  useEffect(() => {
    fetch(fetchUrl)
      .then((res) => res.json())
      .then(setAllTags);
  }, [fetchUrl]);

  // Parse current tags from value (comma-separated string)
  const tags = value
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  // Update suggestions as user types
  useEffect(() => {
    if (input.trim() === "") {
      setSuggestions([]);
      return;
    }
    const last = input.split(",").pop().trim().toLowerCase();
    setSuggestions(
      allTags.filter(
        (tag) =>
          tag.toLowerCase().includes(last) &&
          !tags.includes(tag)
      )
    );
  }, [input, allTags, tags]);

  // Handle input change
  const handleInputChange = (e) => {
    setInput(e.target.value);
    // If user types a comma, add tag
    if (e.target.value.endsWith(",")) {
      addTag(e.target.value.slice(0, -1).trim());
    }
  };

  // Add tag from input or suggestion
  const addTag = (tag) => {
    if (!tag) return;
    if (!tags.includes(tag)) {
      const newTags = [...tags, tag];
      onChange(newTags.join(","));
    }
    setInput("");
    setSuggestions([]);
    inputRef.current.focus();
  };

  // Remove tag
  const removeTag = (tag) => {
    const newTags = tags.filter((t) => t !== tag);
    onChange(newTags.join(","));
  };

  // Handle suggestion click
  const handleSuggestionClick = (tag) => {
    addTag(tag);
  };

  // Handle Enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (suggestions.length > 0 && input.trim()) {
        // If suggestions exist, add the first suggestion
        addTag(suggestions[0]);
      } else if (input.trim()) {
        // Otherwise, add the current input as a tag
        addTag(input.trim());
      }
    }
    if (e.key === "Backspace" && !input && tags.length) {
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div style={{ minHeight: 40 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3em" }}>
        {tags.map((tag) => (
          <span
            key={tag}
            style={{
              background: "#eee",
              borderRadius: "4px",
              padding: "0.2em 0.5em",
              display: "flex",
              alignItems: "center",
            }}
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              style={{
                marginLeft: 4,
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontWeight: "bold",
              }}
              aria-label={`Remove ${tag}`}
            >
              ×
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type tag, comma or Enter to add"
          style={{ flex: 1, minWidth: 120, border: "none", outline: "none" }}
        />
      </div>
      {suggestions.length > 0 && (
        <div
          style={{
            background: "#fff",
            border: "1px solid #ccc",
            borderRadius: 4,
            marginTop: 2,
            position: "absolute",
            zIndex: 10,
            minWidth: 120,
          }}
        >
          {suggestions.map((s) => (
            <div
              key={s}
              style={{
                padding: "0.2em 0.5em",
                cursor: "pointer",
              }}
              onMouseDown={() => handleSuggestionClick(s)}
            >
              {s}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}