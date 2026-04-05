const express = require("express");
const multer = require("multer");
const authMiddleware = require("../middleware/authMiddleware");
const {
  getFeed,
  createPost,
  toggleLike,
  addComment,
  deletePost,
} = require("../controllers/postController");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Only image uploads are allowed."));
      return;
    }

    cb(null, true);
  },
});

router.get("/feed", getFeed);
router.post("/create", authMiddleware, upload.single("image"), createPost);
router.put("/:postId/like", authMiddleware, toggleLike);
router.post("/:postId/comment", authMiddleware, addComment);
router.delete("/:postId", authMiddleware, deletePost);

module.exports = router;
