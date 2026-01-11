const express = require("express")
const path = require("path");
const axios = require("axios")
const app = express()


app.use(express.static(path.join(__dirname, "public")));
app.set("view engine","ejs");

app.use(express.urlencoded({extended:true}));
app.use(express.json());



app.get("/",(req,res)=>{
    res.render("form")
})

app.post("/recommend", async (req, res) => {
  try {
    await axios.post(`${ML_API_URL}/predict`, {...});
      {
        goal: req.body.goal,
        experience: req.body.experience,
        days_per_week: Number(req.body.days_per_week),
        time_per_session: Number(req.body.time_per_session),
      }
    );

    const WorkoutPlans={
      full_body :{
        title:"Full Body Workout",
        day:[
          {
            day:"Day 1",
            exercises:["Squats", "Push Ups", "Pull Ups", "Plank"]
          },
          {
          day:"Day 2",
          exercises: ["Deadlift", "Bench Press", "Lat Pulldown", "Crunches"]
          }

        ]
      },
      upper_lower: {
        title: "Upper / Lower Split",
        days: [
      {
        day: "Upper Body",
        exercises: ["Bench Press", "Shoulder Press", "Pull Ups", "Biceps Curl"]
      },
      {
        day: "Lower Body",
        exercises: ["Squats", "Leg Press", "Hamstring Curl", "Calf Raises"]
      }
    ]
  },
      push_pull_legs: {
        title: "Push Pull Legs Split",
        days: [
      {
        day: "Push",
        exercises: ["Bench Press", "Overhead Press","Incline-dumbell", "Triceps Dips"]
      },
      {
        day: "Pull",
        exercises: ["Pull Ups", "Barbell Row", "Biceps Curl","Hammer","Generator"]
      },
      {
        day: "Legs",
        exercises: ["Squats", "Lunges", "Leg Curl", "Calf Raises"]
      }
    ]
  },
      bro_split: {
    title: "Bro Split",
    days: [
      { day: "Chest", exercises: ["Bench Press", "Incline DB Press"] },
      { day: "Back", exercises: ["Deadlift", "Lat Pulldown"] },
      { day: "Legs", exercises: ["Squats", "Leg Press"] },
      { day: "Shoulders", exercises: ["Overhead Press", "Lateral Raises"] },
      { day: "Arms", exercises: ["Biceps Curl", "Triceps Pushdown"] }
    ]
  }
      
    };

    const predictedSplit = response.data.predicted_split;
    const Workout =WorkoutPlans[predictedSplit]

    res.render("result", { split: predictedSplit,Workout });

  } catch (error) {
    console.error(error.message);
    res.send("Error communicating with ML service");
  }
});


app.listen(3000,()=>{
    console.log('Node server running on port 3000')
})
