import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "/api/todos";

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch todos
  const fetchTodos = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error("Failed to fetch todos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Create todo
  const addTodo = async (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title,
        }),
      });

      const newTodo = await response.json();

      setTodos((currentTodos) => [newTodo, ...currentTodos]);
      setTitle("");
    } catch (error) {
      console.error("Failed to create todo:", error);
    }
  };

  // Toggle todo
  const toggleTodo = async (todo) => {
    try {
      await fetch(`${API_URL}/${todo.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: todo.title,
          completed: !todo.completed,
        }),
      });

      setTodos((currentTodos) =>
        currentTodos.map((item) =>
          item.id === todo.id
            ? { ...item, completed: !item.completed }
            : item
        )
      );
    } catch (error) {
      console.error("Failed to update todo:", error);
    }
  };

  // Delete todo
  const deleteTodo = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      setTodos((currentTodos) =>
        currentTodos.filter((todo) => todo.id !== id)
      );
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  };

  return (
    <div className="app">
      <div className="container">
        <h1>DevSecOps Todo</h1>

        <p className="subtitle">
          React + Node.js + MySQL
        </p>

        <form onSubmit={addTodo} className="todo-form">
          <input
            type="text"
            placeholder="Enter a todo..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <button type="submit">
            Add Todo
          </button>
        </form>

        {loading ? (
          <p>Loading...</p>
        ) : todos.length === 0 ? (
          <p className="empty">No todos found.</p>
        ) : (
          <div className="todo-list">
            {todos.map((todo) => (
              <div className="todo" key={todo.id}>
                <div className="todo-content">
                  <input
                    type="checkbox"
                    checked={Boolean(todo.completed)}
                    onChange={() => toggleTodo(todo)}
                  />

                  <span className={todo.completed ? "completed" : ""}>
                    {todo.title}
                  </span>
                </div>

                <button
                  className="delete"
                  onClick={() => deleteTodo(todo.id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
