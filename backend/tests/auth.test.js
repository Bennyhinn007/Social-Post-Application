const request = require("supertest");
const bcrypt = require("bcryptjs");

process.env.JWT_SECRET = "test_jwt_secret_key";
process.env.CLIENT_URL = "http://localhost:5173";

jest.mock("../models/User", () => ({
  findOne: jest.fn(),
  create: jest.fn(),
}));

const User = require("../models/User");
const app = require("../app");

describe("Auth API", () => {
  it("registers a user and returns token", async () => {
    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({
      _id: "507f1f77bcf86cd799439011",
      username: "test_user",
      email: "test@example.com",
      avatar: "",
    });

    const response = await request(app).post("/api/auth/signup").send({
      username: "test_user",
      email: "test@example.com",
      password: "password123",
    });

    expect(response.status).toBe(201);
    expect(response.body.token).toBeDefined();
    expect(response.body.user).toMatchObject({
      username: "test_user",
      email: "test@example.com",
    });
  });

  it("rejects weak password", async () => {
    const response = await request(app).post("/api/auth/signup").send({
      username: "weak_user",
      email: "weak@example.com",
      password: "1234567",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/Password must be/);
  });

  it("logs in an existing user", async () => {
    const hashedPassword = await bcrypt.hash("password123", 10);

    User.findOne.mockResolvedValue({
      _id: "507f1f77bcf86cd799439011",
      username: "login_user",
      email: "login@example.com",
      password: hashedPassword,
    });

    const response = await request(app).post("/api/auth/login").send({
      email: "login@example.com",
      password: "password123",
    });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
    expect(response.body.user.username).toBe("login_user");
  });

  it("rejects invalid credentials", async () => {
    const hashedPassword = await bcrypt.hash("password123", 10);

    User.findOne.mockResolvedValue({
      _id: "507f1f77bcf86cd799439011",
      username: "invalid_user",
      email: "invalid@example.com",
      password: hashedPassword,
    });

    const response = await request(app).post("/api/auth/login").send({
      email: "invalid@example.com",
      password: "wrongpass123",
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid email or password.");
  });
});
