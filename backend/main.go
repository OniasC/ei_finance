package main

import (
	"database/sql"
	"encoding/json"
	"html/template"

	"fmt"
	"log"
	"net/http"
	"os"

	_ "github.com/lib/pq"
)

var db *sql.DB

// Define a struct for your database table
type Item struct {
	ID    int    `json:"id"`
	Name  string `json:"name"`
	Price int    `json:"price"`
}

type Log struct {
	ID      int    `json:"id"`
	Message string `json:"message"`
	Level   string `json:"level"`
}

func initDB() {
	dbUser := os.Getenv("POSTGRES_USER")
	dbPassword := os.Getenv("POSTGRES_PASSWORD")
	dbHost := os.Getenv("POSTGRES_HOST")
	dbName := os.Getenv("POSTGRES_DB")
	dbPort := "5432"

	// PostgreSQL connection string
	connStr := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		dbHost, dbUser, dbPassword, dbName, dbPort)

	// Connect to database
	var err error
	db, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatalf("Error connecting to the database: %v", err)
	}
	//defer db.Close() <<- If i close it here, it will close the connection before the main function ends
	// I can probably make this function return the db variable and it would be better...

	// Ensure the table exists
	_, err = db.Exec(`
	CREATE TABLE IF NOT EXISTS logs (
		id SERIAL PRIMARY KEY,
		message TEXT NOT NULL,
		level VARCHAR(10) NOT NULL CHECK (level IN ('INFO', 'WARNING', 'ERROR')),
		created_at TIMESTAMP DEFAULT NOW()
	)`)
	if err != nil {
		log.Fatal("Failed to create table:", err)
	}

	err = db.Ping()
	if err != nil {
		log.Fatalf("Error pinging the database: %v", err)
	}
	log.Println("Connected to the database")

}

func main() {
	// Load environment variables
	initDB()
	defer db.Close()

	// Create API route to fetch data
	http.HandleFunc("/logs", getLogsHandler)
	http.HandleFunc("/logs/add", addLogHandler)

	// Define HTTP handler
	//http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
	//	w.Write([]byte("Hello from Go Backend!"))
	//})

	// Start server.
	port := ":8080"
	log.Println("Backend running on http://localhost" + port)
	log.Println("Starting Go server on port 8080...")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func getLogsHandler(w http.ResponseWriter, r *http.Request) {
	rows, err := db.Query("SELECT id, message, level FROM logs;")
	if err != nil {
		http.Error(w, "Failed to retrieve logs", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var logs []Log
	for rows.Next() {
		var log Log
		if err := rows.Scan(&log.ID, &log.Message, &log.Level); err != nil {
			http.Error(w, "Failed to parse logs", http.StatusInternalServerError)
			return
		}
		logs = append(logs, log)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(logs)
}

func addLogHandler(w http.ResponseWriter, r *http.Request) {
	var newLog Log
	if err := json.NewDecoder(r.Body).Decode(&newLog); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	_, err := db.Exec("INSERT INTO logs (message, level) VALUES ($1, $2)", newLog.Message, newLog.Level)
	if err != nil {
		http.Error(w, "Failed to insert log", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
}

func logsHandler(w http.ResponseWriter, r *http.Request) {
	// Retrieve data from PostgreSQL
	logs, err := getLogs()
	if err != nil {
		http.Error(w, "Error fetching data from PostgreSQL 15", http.StatusInternalServerError)
		return
	}

	// Use HTML template to render the items in a table
	tmpl, err := template.New("logs").Parse(`
		<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Items List</title>
		</head>
		<body>
			<h1>Items List</h1>
			<table border="1">
				<tr>
					<th>ID</th>
					<th>Name</th>
					<th>Price</th>
				</tr>
				{{range .}}
				<tr>
					<td>{{.ID}}</td>
					<td>{{.Message}}</td>
					<td>{{.Level}}</td>
				</tr>
				{{end}}
			</table>
		</body>
		</html>
	`)

	if err != nil {
		http.Error(w, "Error parsing the template", http.StatusInternalServerError)
		return
	}

	// Execute the template with the items data
	tmpl.Execute(w, logs)
}

// Handler function to retrieve and return data from PostgreSQL
func getLogs() ([]Log, error) {
	rows, err := db.Query("SELECT id, message, level FROM logs;")
	if err != nil {
		log.Println("Error scanning row ONIAS:", err)
		return nil, err
	}
	log.Println("sem errors scanning row: ONIAS ")
	defer rows.Close()
	log.Println("Error scanning row: SAMPAIO")
	var logs []Log
	for rows.Next() {
		var myLog Log
		err := rows.Scan(&myLog.ID, &myLog.Message, &myLog.Level)
		if err != nil {
			log.Println("Error scanning row:", err)
			return nil, err
		}
		logs = append(logs, myLog)
	}
	return logs, nil

}
