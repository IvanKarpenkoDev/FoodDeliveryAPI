const { pool } = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Функция для создания JWT-токена
const generateToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const secretKey = "your-secret-key"; // Замените на ваш секретный ключ
  const expiresIn = "1h"; // Время жизни токена

  return jwt.sign(payload, secretKey, { expiresIn });
};

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Проверка, что пользователь с таким email не существует
    const checkEmailQuery = "SELECT * FROM Users WHERE email = $1";
    const emailExists = await pool.query(checkEmailQuery, [email]);

    if (emailExists.rows.length > 0) {
      return res
        .status(400)
        .json({ message: "Пользователь с таким email уже существует" });
    }

    // Хеширование пароля
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Создание нового пользователя с хешированным паролем
    const insertUserQuery =
      "INSERT INTO Users (username, email, password) VALUES ($1, $2, $3) RETURNING *";
    const result = await pool.query(insertUserQuery, [
      username,
      email,
      hashedPassword,
    ]);

    // Генерация JWT-токена
    const user = result.rows[0];
    const token = generateToken(user);

    res
      .status(201)
      .json({
        message: "Пользователь успешно зарегистрирован",
        user,
        token,
      });
  } catch (error) {
    console.error("Ошибка при регистрации пользователя:", error);
    res.status(500).json({ message: "Ошибка при регистрации пользователя" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Поиск пользователя по email
    const findUserQuery = "SELECT * FROM Users WHERE email = $1";
    const result = await pool.query(findUserQuery, [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    // Проверка пароля
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Неверный пароль" });
    }

    // Генерация JWT-токена
    const token = generateToken(user);

    res.status(200).json({ message: "Успешная аутентификация", user, token });
  } catch (error) {
    console.error("Ошибка при аутентификации пользователя:", error);
    res.status(500).json({ message: "Ошибка при аутентификации пользователя" });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
