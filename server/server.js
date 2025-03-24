const express = require("express");
const session = require("express-session");
const cors = require("cors");

const app = express();

// Настройка CORS
app.use(cors({
  origin: "http://localhost:5500", // Разрешить запросы от клиента
  credentials: true, // Разрешить передачу куки и заголовков авторизации
}));

// Настройка сессий
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Для localhost используйте false, для HTTPS — true
  })
);

// Middleware для обработки JSON
app.use(express.json());

// API для обновления состояния FullScreen
app.post("/api/fullscreen", (req, res) => {
  const { fullscreen } = req.body;
  req.session.fullscreen = fullscreen; // Сохраняем состояние в сессии
  res.sendStatus(200);
});

// API для получения состояния FullScreen
app.get("/api/fullscreen", (req, res) => {
  const fullscreen = req.session.fullscreen || false; // Получаем состояние из сессии
  res.json({ fullscreen });
});

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

// Запуск сервера
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});