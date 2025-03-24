const express = require("express");
const session = require("express-session");
const cors = require("cors");
const path = require("path");

const app = express();

// Настройка CORS для GitHub Pages и локального развития
app.use(cors({
  origin: ["https://somenmi.github.io", "http://localhost:5500"],
  credentials: true
}));

// Настройка сессий с постоянным хранилищем
app.use(session({
  secret: "your-secret-key-here",
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: false, // Для GitHub Pages нужно true + HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 1 день
  }
}));

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API для FullScreen
app.post("/api/fullscreen", (req, res) => {
  req.session.fullscreen = req.body.fullscreen;
  res.json({ success: true });
});

app.get("/api/fullscreen", (req, res) => {
  res.json({ fullscreen: req.session.fullscreen || false });
});

// Статический файл для проверки
app.get("/test", (req, res) => {
  res.send("Server is running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});