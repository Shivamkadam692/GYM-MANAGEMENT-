const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const mysql = require("mysql2");
const methodOverride = require("method-override");

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// MySQL Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root", 
    password: "Spk111*", 
    database: "gym_management",
});

db.connect((err) => {
    if (err) {
        console.error("Error connecting to MySQL:", err);
    } else {
        console.log("Connected to MySQL database");
    }
});




app.get("/", (req, res) => {
    res.render("landing.ejs");
});


app.get("/workouts", (req, res) => {
    const query = "SELECT * FROM workouts";
    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching workouts:", err);
            res.status(500).send("Internal Server Error");
        } else {
            res.render("index.ejs", { workouts: results });
        }
    });
});

app.get("/workouts/new", (req, res) => {
    res.render("new.ejs");
});


app.post("/workouts", (req, res) => {
    const { memberName, planName, dob, weight, startDate } = req.body;
    const query = "INSERT INTO workouts (memberName, planName, dob, weight, startDate) VALUES (?, ?, ?, ?, ?)";
    db.query(query, [memberName, planName, dob, weight, startDate], (err, results) => {
        if (err) {
            console.error("Error creating workout:", err);
            res.status(500).send("Internal Server Error");
        } else {
            res.redirect("/workouts");
        }
    });
});


app.get("/workouts/:id/edit", (req, res) => {
    const { id } = req.params;
    const query = "SELECT * FROM workouts WHERE id = ?";
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error("Error fetching workout:", err);
            res.status(500).send("Internal Server Error");
        } else {
            res.render("edit.ejs", { workout: results[0] });
        }
    });
});

app.put("/workouts/:id", (req, res) => {
    const { id } = req.params;
    const { memberName, planName, dob, weight, startDate } = req.body;
    const query = "UPDATE workouts SET memberName = ?, planName = ?, dob = ?, weight = ?, startDate = ? WHERE id = ?";
    db.query(query, [memberName, planName, dob, weight, startDate, id], (err, results) => {
        if (err) {
            console.error("Error updating workout:", err);
            res.status(500).send("Internal Server Error");
        } else {
            res.redirect("/workouts");
        }
    });
});

app.delete("/workouts/:id", (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM workouts WHERE id = ?";
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error("Error deleting workout:", err);
            res.status(500).send("Internal Server Error");
        } else {
            res.redirect("/workouts");
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});