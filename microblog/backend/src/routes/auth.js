const router = require("express").Router();
const authController = require("../controllers/authController");

// Register, login and refresh token
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh", authController.refreshToken);

module.exports = router;
