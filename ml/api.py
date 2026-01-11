import warnings
warnings.filterwarnings("ignore")
from flask import Flask, request, jsonify
import joblib
import pandas as pd

# Initialize Flask app
app = Flask(__name__)

# Load trained model and encoders
model = joblib.load("model.pkl")
goal_encoder = joblib.load("goal_encoder.pkl")
experience_encoder = joblib.load("experience_encoder.pkl")
target_encoder = joblib.load("target_encoder.pkl")

@app.route("/")
def home():
    return "Smart Workout ML API is running"


@app.route("/predict", methods=["POST"])
def predict():
    # Read JSON data from request
    data = request.get_json()

    # Extract input features
    goal = data["goal"]
    experience = data["experience"]
    days = data["days_per_week"]
    time = data["time_per_session"]

    # Create DataFrame (same format as training)
    input_df = pd.DataFrame([{
        "goal": goal,
        "experience": experience,
        "days_per_week": days,
        "time_per_session": time
    }])

    # Encode categorical features
    input_df["goal"] = goal_encoder.transform(input_df["goal"])
    input_df["experience"] = experience_encoder.transform(input_df["experience"])

    # Make prediction
    prediction_encoded = model.predict(input_df)
    prediction = target_encoder.inverse_transform(prediction_encoded)

    # Return result
    return jsonify({
        "predicted_split": prediction[0]
    })

if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)
