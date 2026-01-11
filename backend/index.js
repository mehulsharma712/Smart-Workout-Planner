const express = require("express");
const path = require("path");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

console.log("ML_API_URL =", process.env.ML_API_URL);


// middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// view engine
app.set("view engine", "ejs");

// dummy workout plans (TEMP – must exist)
const WorkoutPlans = {
  upper_lower: {
    title: "Upper / Lower Split",
    days: [
      { day: "Day 1", exercises: ["Bench Press", "Pull-ups"] },
      { day: "Day 2", exercises: ["Squats", "Deadlifts"] },
    ],
  },
  push_pull_legs: {
    title: "Push Pull Legs",
    days: [
      { day: "Push", exercises: ["Bench Press", "Shoulder Press"] },
      { day: "Pull", exercises: ["Rows", "Pull-ups"] },
      { day: "Legs", exercises: ["Squats", "Lunges"] },
    ],
  },
};

// routes
app.get("/", (req, res) => {
  res.render("form");
});

app.post("/recommend", async (req, res) => {
  try {
    const response = await axios.post(
      `${process.env.ML_API_URL}/predict`,
      {
        goal: req.body.goal,
        experience: req.body.experience,
        days_per_week: Number(req.body.days_per_week),
        time_per_session: Number(req.body.time_per_session),
      },
      {
        headers: { "Content-Type": "application/json" },
        timeout: 15000,
      }
    );

    const predictedSplit = response.data.predicted_split;
    const Workout = WorkoutPlans[predictedSplit]; // ✅ FIXED

    res.render("result", { workout });

  } catch (error) {
    console.log("===== AXIOS ERROR DEBUG =====");
    console.log("Message:", error.message);

    if (error.code) {
      console.log("Error code:", error.code);
    }

    if (error.response) {
      console.log("Status:", error.response.status);
      console.log("Data:", error.response.data);
    } else if (error.request) {
      console.log("Request was sent but no response received");
    } else {
      console.log("Axios setup error");
    }

    console.log("============================");

    res.send("Error communicating with ML service");
  }
}); // ✅ THIS WAS MISSING
