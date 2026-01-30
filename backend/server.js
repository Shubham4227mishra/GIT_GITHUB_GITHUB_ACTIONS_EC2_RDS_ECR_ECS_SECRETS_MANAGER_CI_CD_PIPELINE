const express = require("express");
const pool = require("./db");

const app = express();
app.use(express.json());

// Insert user (NO duplicates)
app.post("/api/user", async (req, res) => {
  const { name, email } = req.body;

  try {
    await pool.execute(
      "INSERT INTO users (name, email) VALUES (?, ?)",
      [name, email]
    );
    res.status(201).json({ message: "User saved" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "User already exists" });
    }
    res.status(500).json({ error: "Database error" });
  }
});

// Fetch users
app.get("/api/users", async (req, res) => {
  const [rows] = await pool.query("SELECT name, email FROM users");
  res.json(rows);
});

app.listen(3000, () => {
  console.log("Backend running on port 3000");
});

