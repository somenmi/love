const express = require("express");
const session = require("express-session");
const cors = require("cors");
const path = require("path");

const app = express();

// Конфигурация CORS (обновлённая)
app.use(cors({
  origin: [
    "https://somenmi.github.io", // Основной домен GitHub Pages
    "https://love-three-sandy.vercel.app", // Ваш домен Vercel
    "http://localhost:5500" // Для локальной разработки
  ],
  credentials: true,
  methods: ["GET", "POST", "OPTIONS"] // Явно указываем разрешённые методы
}));

// Улучшенная конфигурация сессий
app.use(session({
  secret: process.env.SESSION_SECRET || "your-secret-key-here", // Лучше использовать переменные окружения
  resave: false,
  saveUninitialized: false, // Изменено на false для GDPR
  cookie: {
    secure: process.env.NODE_ENV === "production", // Автоматическое переключение для HTTPS
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Важно для кросс-доменных запросов
    maxAge: 24 * 60 * 60 * 1000
  },
  store: process.env.NODE_ENV === "production" ? new (require('connect-pg-simple')(session))() : null // Хранилище для продакшена
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Статические файлы (если нужно)
app.use(express.static(path.join(__dirname, 'public')));

// API Endpoints
app.post("/api/fullscreen", (req, res) => {
  try {
    req.session.fullscreen = Boolean(req.body.fullscreen);
    res.json({ success: true });
  } catch (error) {
    console.error("Session error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/fullscreen", (req, res) => {
  res.json({
    fullscreen: Boolean(req.session.fullscreen),
    timestamp: new Date().toISOString()
  });
});

// Health Check
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// Обработка 404
app.use((req, res) => {
  res.status(404).send("Not Found");
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Internal Server Error");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
});