from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
CORS(app, origins=["http://localhost:3000"])

@app.route("/run-script", methods=["POST"])
def run_script():
    data = request.json
    result = f"Received parameter: {data['param']}"
    return jsonify({"output": result})

@app.route("/api/total-expenses", methods=["GET"])
def get_total_expenses():
    total = 1234.56  # Example value, from DB or calculation
    return jsonify({"total_expenses": total})

if __name__ == "__main__":

    app.run(port=5000)