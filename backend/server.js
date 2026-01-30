const express = require("express");
const pool = require("./db");

const app = express();
app.use(express.json());

// ✅ Health check (THIS WAS MISSING)
app.get("/api/health", (req, res) => {
  res.send("Backend is healthy 🚀");
});

// Insert user
app.post("/api/user", async (req, res) => {
  const { name, email } = req.body;

  try {
    await pool.execute(
      "INSERT INTO users (name, email) VALUES (?, ?)",
      [name, email]
    );
    res.status(201).json({ message: "User saved" });
  } catch (err) {
    console.error(err);
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "User already exists" });
    }
    res.status(500).json({ error: "Database error" });
  }
});

app.listen(3000, () => {
  console.log("Backend running on port 3000");
});

