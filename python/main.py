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
    total = 1234.57  # Example value, from DB or calculation
    return jsonify({"total_expenses": total})

# Simulated full data
full_x = list(range(1000))
full_y = [x**0.5 for x in full_x]
full_x = ["a"+str(x) for x in full_x]

@app.route("/chart-data", methods=["GET"])
def get_chart_data():
    start_x = int(request.args.get("start_x", 0))
    end_x = int(request.args.get("end_x", len(full_x) - 1))

    # Filter the data based on requested range
    filtered_x = full_x[start_x:end_x + 1]
    filtered_y = full_y[start_x:end_x + 1]

    return jsonify({
        "x": filtered_x,
        "y": filtered_y
    })

if __name__ == "__main__":
    app.run(port=5000)