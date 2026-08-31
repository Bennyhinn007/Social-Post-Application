# SocialPulse — Full-Stack Social Feed App

A production-ready social feed application where users can sign up, share posts with text and images, and interact through likes and comments. Built with the MERN stack (MongoDB, Express, React, Node.js) and hardened for real-world deployment.

<p align="left">
  <img alt="React" src="https://img.shields.io/badge/React-18-149ECA?logo=react&logoColor=white" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white" />
  <img alt="MUI" src="https://img.shields.io/badge/MUI-5-007FFF?logo=mui&logoColor=white" />
  <img alt="Node.js" src="https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white" />
  <img alt="MongoDB" src="https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white" />
  <img alt="JWT" src="https://img.shields.io/badge/Auth-JWT-000000?logo=jsonwebtokens&logoColor=white" />
  <img alt="Tests" src="https://img.shields.io/badge/Tests-Jest%20%2B%20Supertest-C21325?logo=jest&logoColor=white" />
  <img alt="License" src="https://img.shields.io/badge/License-MIT-blue" />
</p>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Screenshots](#screenshots)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Testing](#testing)
- [Security](#security)
- [Deployment](#deployment)
- [Roadmap](#roadmap)
- [License](#license)

---

## Overview

SocialPulse is a compact but complete social application that demonstrates a full request lifecycle across a modern JavaScript stack: a React single-page app talking to a REST API backed by MongoDB, with JWT authentication, cloud image uploads, and security middleware. It is intentionally focused, easy to read, and structured the way a small production service would be.

**Live demo:** _add your Vercel URL here_
**API base:** _add your Render URL here_

---

## Features

- **Authentication** — Sign up and log in with JWT-based sessions and bcrypt-hashed passwords.
- **Create posts** — Share text, an image, or both. Images are uploaded to Cloudinary.
- **Engagement** — Like/unlike posts and add comments, with optimistic UI updates for a snappy feel.
- **Ownership control** — Users can only delete their own posts (enforced server-side).
- **Paginated feed** — Newest-first feed with server-side pagination.
- **Responsive UI** — Clean Material UI interface that works on mobile and desktop.
- **Resilient client** — Automatic logout on expired tokens and clear error messaging.

---

## Tech Stack

| Layer        | Technology                                                        |
| ------------ | ----------------------------------------------------------------- |
| **Frontend** | React 18, Vite, Material UI v5, React Router v6, Axios, Context API |
| **Backend**  | Node.js, Express, Mongoose                                        |
| **Database** | MongoDB Atlas                                                    |
| **Auth**     | JSON Web Tokens, bcryptjs                                        |
| **Uploads**  | Multer (memory) + Cloudinary                                     |
| **Security** | Helmet, CORS allowlist, express-rate-limit                      |
| **Testing**  | Jest + Supertest                                                |
| **Hosting**  | Vercel (frontend) + Render (backend)                            |

---

## Screenshots

> Add screenshots or a short GIF here to make the project stand out. Suggested shots:
>
> - Login / Signup screen
> - Feed with posts
> - Create-post modal
> - A post with comments expanded
>
> ```md
> ![Feed](docs/feed.png)
> ![Create Post](docs/create-post.png)
> ```

---

## Architecture

```text
┌─────────────────────┐         HTTPS / JSON         ┌──────────────────────┐
│   React (Vite SPA)   │  ─────────────────────────▶  │  Express REST API     │
│   Material UI        │  ◀─────────────────────────  │  JWT auth middleware   │
│   Axios + Context    │                              │  Rate limiting, CORS   │
└─────────────────────┘                              └──────────┬───────────┘
        │                                                        │
        │ image file (multipart)                                 │ Mongoose
        ▼                                                        ▼
┌─────────────────────┐                              ┌──────────────────────┐
│     Cloudinary       │                              │   MongoDB Atlas        │
│  (image storage)     │                              │  users, posts          │
└─────────────────────┘                              └──────────────────────┘
```

**Request flow (create post with image):**

1. Client sends `multipart/form-data` with a JWT in the `Authorization` header.
2. `authMiddleware` verifies the token and attaches the user to the request.
3. Multer buffers the image in memory; it is streamed to Cloudinary.
4. The returned image URL is stored on the post document in MongoDB.
5. The created post is returned and rendered optimistically in the feed.

---

## Project Structure

```text
/
├── backend/
│   ├── app.js                 # Express app: middleware, routes, error handling
│   ├── server.js              # DB connection + server bootstrap
│   ├── config/cloudinary.js   # Cloudinary config + upload helper
│   ├── controllers/           # authController, postController
│   ├── middleware/            # JWT auth guard
│   ├── models/                # User, Post (Mongoose schemas)
│   ├── routes/                # /api/auth, /api/posts
│   ├── utils/validation.js    # Email/username/password validators
│   └── tests/                 # Jest + Supertest API tests
├── frontend/
│   └── src/
│       ├── api/axios.js        # Axios instance + auth interceptors
│       ├── context/            # AuthContext (session state)
│       ├── components/         # Navbar, PostCard, CommentSection, CreatePostModal
│       ├── pages/              # Login, Signup, Feed
│       ├── App.jsx             # Routes + route guards
│       └── main.jsx            # Theme + providers
├── render.yaml                 # Backend deploy config (Render)
├── frontend/vercel.json        # SPA rewrite config (Vercel)
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- A MongoDB Atlas connection string (or local MongoDB)
- A Cloudinary account (for image uploads)

### 1. Clone

```bash
git clone https://github.com/Bennyhinn007/Social-Post-Application.git
cd Social-Post-Application
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env   # then fill in real values
npm run dev            # starts on http://localhost:5000
```

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env   # set VITE_API_URL if not default
npm run dev            # starts on http://localhost:5173
```

Open `http://localhost:5173`, create an account, and start posting.

---

## Environment Variables

### `backend/.env`

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173,http://localhost:4173
AUTH_RATE_LIMIT_WINDOW_MS=900000
AUTH_RATE_LIMIT_MAX=20
API_RATE_LIMIT_WINDOW_MS=900000
API_RATE_LIMIT_MAX=200
```

### `frontend/.env`

```env
VITE_API_URL=http://localhost:5000/api
```

---

## API Reference

Base path: `/api`

| Method   | Endpoint                          | Auth | Description                                            |
| -------- | --------------------------------- | ---- | ------------------------------------------------------ |
| `POST`   | `/auth/signup`                    | No   | Register a user, returns JWT + user                    |
| `POST`   | `/auth/login`                     | No   | Log in, returns JWT + user                             |
| `GET`    | `/posts/feed?page=1&limit=10`     | No   | Paginated feed, newest first                           |
| `POST`   | `/posts/create`                   | Yes  | Create post (`multipart/form-data`: `text?`, `image?`) |
| `PUT`    | `/posts/:postId/like`             | Yes  | Toggle like                                            |
| `POST`   | `/posts/:postId/comment`          | Yes  | Add comment `{ text }`                                 |
| `DELETE` | `/posts/:postId`                  | Yes  | Delete your own post                                   |
| `GET`    | `/health`                         | No   | Health check, returns `{ status: "ok" }`               |

**Auth header format:** `Authorization: Bearer <token>`

### Example: sign up

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"jane","email":"jane@example.com","password":"secret123"}'
```

---

## Testing

The backend includes an API test suite using Jest and Supertest with mocked data models (no live database required).

```bash
cd backend
npm test
```

**Covered scenarios:**

- Auth: signup success, weak-password rejection, login success, invalid-credentials rejection
- Posts: create post, toggle like, add comment, paginated feed, delete own post

---

## Security

Security measures baked into the backend:

- **Password hashing** with bcrypt.
- **JWT authentication** with a protected-route middleware.
- **Ownership checks** so users can only delete their own content.
- **Helmet** security headers; `x-powered-by` disabled.
- **CORS allowlist** with configurable multi-origin support.
- **Rate limiting** on auth and general API routes.
- **Payload limits** (`1mb`) and **upload restrictions** (image-only, max 5MB).
- **Input validation** for email, username, password strength, comment/post length, and pagination bounds.

No secrets are committed to the repository. Only `.env.example` files are tracked.

---

## Deployment

### Backend — Render

- Config: [`render.yaml`](render.yaml)
- Root directory: `backend`
- Build: `npm install` · Start: `npm start`
- Health check: `/api/health`
- Set all required env vars in the Render dashboard, and point `CLIENT_URL` at your Vercel origin.

### Frontend — Vercel

- Root directory: `frontend`
- Framework: Vite · Build: `npm run build` · Output: `dist`
- SPA routing handled by [`frontend/vercel.json`](frontend/vercel.json)
- Set `VITE_API_URL` to your Render API URL (ending in `/api`).

### Go-live checklist

1. Create a least-privilege MongoDB Atlas user and confirm the connection from Render.
2. Deploy the backend and verify `/api/health` returns `200`.
3. Deploy the frontend and confirm `/feed`, `/login`, `/signup` refresh correctly (SPA rewrites).
4. Test signup, login, and image posting end-to-end from the production frontend.
5. Confirm CORS blocks unknown origins and rate limits behave as expected.

---

## Roadmap

Ideas for future iterations:

- Follow system and a personalized feed
- Edit posts and comments
- User profiles with avatars
- Real-time updates via WebSockets
- Frontend component tests

---

## License

Released under the [MIT License](https://opensource.org/licenses/MIT).

---

Built by [Bennyhinn007](https://github.com/Bennyhinn007).
