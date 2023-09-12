const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
const userRoutes = require('./routes/user.routes'); // Импортируйте маршруты для пользователей

// Разрешить запросы с определенных источников
const allowedOrigins = ['http://localhost:5173'];
const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

app.use(cors(corsOptions));

// Используйте маршруты для пользователей
app.use('/', userRoutes);

// Далее настройка других маршрутов и middleware

app.listen(8080, () => {
  console.log('Сервер запущен на порту 8080');
});
