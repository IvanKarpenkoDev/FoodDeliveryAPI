const express = require('express');
const router = express.Router();

const userController = require('../controller/user.controller');


// Маршруты для создания и получения пользователей
router.post('/users/register', userController.registerUser);
router.post('/users/login', userController.loginUser);
// router.get('/users', userController.getUserById);

// // Маршруты для получения, обновления и удаления конкретного пользователя по его id
// router.get('/users/:id', userController.getUserById);
// router.put('/users/:id', userController.updateUser);
// router.delete('/users/:id', userController.deleteUser);

// Защищенный маршрут, требующий JWT-токена
// router.get('/protected', userController.verifyToken, userController.protectedRoute);

module.exports = router;
