const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();

app.use(cors());
app.use(express.json());


// ==========================================
// HEALTH CHECK
// ==========================================

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    service: "devsecops-api"
  });
});


// ==========================================
// GET ALL TODOS
// ==========================================

app.get("/api/todos", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM todos ORDER BY id DESC"
    );

    res.status(200).json(rows);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch todos"
    });
  }
});


// ==========================================
// GET TODO BY ID
// ==========================================

app.get("/api/todos/:id", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM todos WHERE id = ?",
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        error: "Todo not found"
      });
    }

    res.status(200).json(rows[0]);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch todo"
    });
  }
});


// ==========================================
// CREATE TODO
// ==========================================

app.post("/api/todos", async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({
        error: "Title is required"
      });
    }

    const [result] = await pool.query(
      "INSERT INTO todos (title) VALUES (?)",
      [title]
    );

    res.status(201).json({
      id: result.insertId,
      title: title,
      completed: false
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to create todo"
    });
  }
});


// ==========================================
// UPDATE TODO
// ==========================================

app.put("/api/todos/:id", async (req, res) => {
  try {
    const { title, completed } = req.body;

    const [result] = await pool.query(
      "UPDATE todos SET title = ?, completed = ? WHERE id = ?",
      [title, completed, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: "Todo not found"
      });
    }

    res.status(200).json({
      message: "Todo updated successfully"
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to update todo"
    });
  }
});


// ==========================================
// DELETE TODO
// ==========================================

app.delete("/api/todos/:id", async (req, res) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM todos WHERE id = ?",
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: "Todo not found"
      });
    }

    res.status(200).json({
      message: "Todo deleted successfully"
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to delete todo"
    });
  }
});


module.exports = app;
