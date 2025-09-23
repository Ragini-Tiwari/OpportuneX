const express = require("express");
const { body, param, query } = require("express-validator");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const validateMiddleware = require("../middleware/validateMiddleware");
const postController = require("../controllers/postController");

const router = express.Router();

// Create post
router.post(
  "/",
  authMiddleware,
  body("title").notEmpty().withMessage("Title required"),
  body("content").notEmpty().withMessage("Content required"),
  validateMiddleware,
  postController.createPost
);

// Get all posts with pagination, sorting, filtering
router.get("/", authMiddleware, postController.getPosts);

// Get post by ID
router.get("/:id", authMiddleware, param("id").isMongoId(), validateMiddleware, postController.getPost);

// Update post
router.put("/:id", authMiddleware, param("id").isMongoId(), validateMiddleware, postController.updatePost);

// Delete post (author or admin)
router.delete("/:id", authMiddleware, param("id").isMongoId(), validateMiddleware, postController.deletePost);

module.exports = router;
