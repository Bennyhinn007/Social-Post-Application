const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false },
);

const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false },
);

const postSchema = new mongoose.Schema(
  {
    author: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
      },
      username: {
        type: String,
        required: true,
        trim: true,
      },
    },
    text: {
      type: String,
      trim: true,
      default: "",
      maxlength: 5000,
    },
    imageUrl: {
      type: String,
      default: "",
    },
    likes: {
      type: [likeSchema],
      default: [],
    },
    comments: {
      type: [commentSchema],
      default: [],
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    collection: "posts",
  },
);

postSchema.pre("validate", function enforcePostContent(next) {
  const hasText = Boolean(this.text && this.text.trim().length > 0);
  const hasImage = Boolean(this.imageUrl && this.imageUrl.trim().length > 0);

  if (!hasText && !hasImage) {
    return next(new Error("A post must include text or an image."));
  }

  return next();
});

module.exports = mongoose.model("Post", postSchema);
