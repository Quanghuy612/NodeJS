const express = require("express");
const {
  register,
  login,
  getUsers,
  addUser,
} = require("../controllers/userController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/users", addUser);
router.get("/users", getUsers);

module.exports = router;
