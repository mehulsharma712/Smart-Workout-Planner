const express = require("express");
const path = require("path");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

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
    const workout = workoutPlans[predictedSplit];

    res.render("result", { workout });

  } catch (error) {
    console.error("AXIOS ERROR:", error.message);

    if (error.response) {
      console.error("ML STATUS:", error.response.status);
      console.error("ML DATA:", error.response.data);
    } else {
      console.error("NO RESPONSE FROM ML");
    }

    res.send("Error communicating with ML service");
  }
});

// server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
