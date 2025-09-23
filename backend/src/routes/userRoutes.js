const express = require("express");
const { body, param, query } = require("express-validator");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const validateMiddleware = require("../middleware/validateMiddleware");
const userController = require("../controllers/userController");

const router = express.Router();

// Create User (admin only)
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  body("name").notEmpty().withMessage("Name required"),
  body("email").isEmail().withMessage("Valid email required"),
  body("password").isLength({ min: 6 }).withMessage("Password >= 6 chars"),
  validateMiddleware,
  userController.createUser
);

// Get all users with pagination & filtering
router.get("/", authMiddleware, roleMiddleware("admin"), userController.getUsers);

// Get single user by ID
router.get("/:id", authMiddleware, roleMiddleware("admin"), param("id").isMongoId(), validateMiddleware, userController.getUser);

// Update user
router.put("/:id", authMiddleware, roleMiddleware("admin"), param("id").isMongoId(), validateMiddleware, userController.updateUser);

// Delete user
router.delete("/:id", authMiddleware, roleMiddleware("admin"), param("id").isMongoId(), validateMiddleware, userController.deleteUser);

module.exports = router;
