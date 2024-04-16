const express = require("express");

const userController = require('../controllers/userController');
const { verifyToken } = require("../middlewares/authentication.js");

const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);

router.get('/profile', verifyToken, userController.viewProfile);
router.put('/profile/update', verifyToken, userController.updateProfile);

module.exports = router;