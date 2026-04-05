const mongoose = require("mongoose");
const Post = require("../models/Post");
const { uploadBufferToCloudinary } = require("../config/cloudinary");
const { normalizeString } = require("../utils/validation");

const MAX_PAGE_SIZE = 20;
const MAX_POST_TEXT_LENGTH = 5000;
const MAX_COMMENT_TEXT_LENGTH = 1000;

/**
 * Get paginated public feed sorted by newest first.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<import("express").Response>}
 */
const getFeed = async (req, res) => {
  try {
    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(
      Math.max(Number.parseInt(req.query.limit, 10) || 10, 1),
      MAX_PAGE_SIZE,
    );
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      Post.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Post.countDocuments({}),
    ]);

    return res.status(200).json({
      data: posts,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: skip + posts.length < total,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch feed." });
  }
};

/**
 * Create a post with optional text and optional Cloudinary image.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<import("express").Response>}
 */
const createPost = async (req, res) => {
  try {
    const text = normalizeString(req.body.text);
    const hasText = text.length > 0;
    const hasImage = Boolean(req.file);

    if (text.length > MAX_POST_TEXT_LENGTH) {
      return res
        .status(400)
        .json({
          message: `Post text cannot exceed ${MAX_POST_TEXT_LENGTH} characters.`,
        });
    }

    if (!hasText && !hasImage) {
      return res
        .status(400)
        .json({ message: "A post must include text or an image." });
    }

    let imageUrl = "";
    if (hasImage) {
      try {
        const uploadResult = await uploadBufferToCloudinary(
          req.file.buffer,
          req.file.mimetype,
        );
        imageUrl = uploadResult.secure_url;
      } catch (uploadError) {
        return res
          .status(502)
          .json({ message: "Image upload failed. Please try again." });
      }
    }

    const post = await Post.create({
      author: {
        userId: req.user.userId,
        username: req.user.username,
      },
      text,
      imageUrl,
    });

    return res
      .status(201)
      .json({ message: "Post created successfully.", post });
  } catch (error) {
    if (error.message === "A post must include text or an image.") {
      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({ message: "Failed to create post." });
  }
};

/**
 * Toggle like state for the authenticated user.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<import("express").Response>}
 */
const toggleLike = async (req, res) => {
  try {
    const { postId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid post id." });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    const existingLikeIndex = post.likes.findIndex(
      (like) => String(like.userId) === String(req.user.userId),
    );

    let liked;
    if (existingLikeIndex > -1) {
      post.likes.splice(existingLikeIndex, 1);
      liked = false;
    } else {
      post.likes.push({ userId: req.user.userId, username: req.user.username });
      liked = true;
    }

    await post.save();

    return res.status(200).json({
      message: liked ? "Post liked." : "Post unliked.",
      likes: post.likes,
      likesCount: post.likes.length,
      liked,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update like." });
  }
};

/**
 * Add a comment to a post.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<import("express").Response>}
 */
const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const text = normalizeString(req.body.text);

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid post id." });
    }

    if (!text) {
      return res.status(400).json({ message: "Comment text is required." });
    }

    if (text.length > MAX_COMMENT_TEXT_LENGTH) {
      return res
        .status(400)
        .json({
          message: `Comment cannot exceed ${MAX_COMMENT_TEXT_LENGTH} characters.`,
        });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    const comment = {
      userId: req.user.userId,
      username: req.user.username,
      text,
      createdAt: new Date(),
    };

    post.comments.push(comment);
    await post.save();

    return res.status(201).json({ message: "Comment added.", comment });
  } catch (error) {
    return res.status(500).json({ message: "Failed to add comment." });
  }
};

/**
 * Delete a post owned by the authenticated user.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<import("express").Response>}
 */
const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid post id." });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    if (String(post.author.userId) !== String(req.user.userId)) {
      return res
        .status(403)
        .json({ message: "You can only delete your own posts." });
    }

    await post.deleteOne();

    return res.status(200).json({ message: "Post deleted successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete post." });
  }
};

module.exports = {
  getFeed,
  createPost,
  toggleLike,
  addComment,
  deletePost,
};
