const request = require("supertest");
const jwt = require("jsonwebtoken");

process.env.JWT_SECRET = "test_jwt_secret_key";
process.env.CLIENT_URL = "http://localhost:5173";

jest.mock("../models/Post", () => ({
  create: jest.fn(),
  findById: jest.fn(),
  find: jest.fn(),
  countDocuments: jest.fn(),
}));

jest.mock("../config/cloudinary", () => ({
  uploadBufferToCloudinary: jest.fn(),
}));

const Post = require("../models/Post");
const app = require("../app");

const tokenFor = (userId, username) =>
  jwt.sign({ userId, username }, process.env.JWT_SECRET, { expiresIn: "1h" });

describe("Posts API", () => {
  it("creates a text post and returns it", async () => {
    const token = tokenFor("507f1f77bcf86cd799439011", "create_user");
    Post.create.mockResolvedValue({
      _id: "507f1f77bcf86cd799439012",
      author: { userId: "507f1f77bcf86cd799439011", username: "create_user" },
      text: "Hello from tests",
      imageUrl: "",
      likes: [],
      comments: [],
      createdAt: new Date().toISOString(),
    });

    const response = await request(app)
      .post("/api/posts/create")
      .set("Authorization", `Bearer ${token}`)
      .field("text", "Hello from tests");

    expect(response.status).toBe(201);
    expect(response.body.post.text).toBe("Hello from tests");
    expect(response.body.post.author.username).toBe("create_user");
  });

  it("toggles like on a post", async () => {
    const token = tokenFor("507f1f77bcf86cd799439011", "like_user");
    const postDoc = {
      likes: [],
      save: jest.fn().mockResolvedValue(undefined),
    };
    Post.findById.mockResolvedValue(postDoc);

    const likeResponse = await request(app)
      .put("/api/posts/507f1f77bcf86cd799439013/like")
      .set("Authorization", `Bearer ${token}`);

    expect(likeResponse.status).toBe(200);
    expect(likeResponse.body.liked).toBe(true);
    expect(likeResponse.body.likesCount).toBe(1);

    const unlikeResponse = await request(app)
      .put("/api/posts/507f1f77bcf86cd799439013/like")
      .set("Authorization", `Bearer ${token}`);

    expect(unlikeResponse.status).toBe(200);
    expect(unlikeResponse.body.liked).toBe(false);
    expect(unlikeResponse.body.likesCount).toBe(0);
  });

  it("adds a comment to a post", async () => {
    const token = tokenFor("507f1f77bcf86cd799439011", "comment_user");
    const postDoc = {
      comments: [],
      save: jest.fn().mockResolvedValue(undefined),
    };
    Post.findById.mockResolvedValue(postDoc);

    const commentResponse = await request(app)
      .post("/api/posts/507f1f77bcf86cd799439014/comment")
      .set("Authorization", `Bearer ${token}`)
      .send({ text: "Nice post" });

    expect(commentResponse.status).toBe(201);
    expect(commentResponse.body.comment.text).toBe("Nice post");
  });

  it("returns paginated feed", async () => {
    const mockPosts = [{ _id: "1", text: "Feed post" }];
    const limitMock = jest.fn().mockResolvedValue(mockPosts);
    const skipMock = jest.fn(() => ({ limit: limitMock }));
    const sortMock = jest.fn(() => ({ skip: skipMock }));

    Post.find.mockReturnValue({ sort: sortMock });
    Post.countDocuments.mockResolvedValue(1);

    const feedResponse = await request(app).get(
      "/api/posts/feed?page=1&limit=10",
    );

    expect(feedResponse.status).toBe(200);
    expect(Array.isArray(feedResponse.body.data)).toBe(true);
    expect(feedResponse.body.page).toBe(1);
  });

  it("deletes own post", async () => {
    const token = tokenFor("507f1f77bcf86cd799439011", "delete_user");
    const postDoc = {
      author: { userId: "507f1f77bcf86cd799439011", username: "delete_user" },
      deleteOne: jest.fn().mockResolvedValue(undefined),
    };
    Post.findById.mockResolvedValue(postDoc);

    const deleteResponse = await request(app)
      .delete("/api/posts/507f1f77bcf86cd799439015")
      .set("Authorization", `Bearer ${token}`);

    expect(deleteResponse.status).toBe(200);
  });
});
