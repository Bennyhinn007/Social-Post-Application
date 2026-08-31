<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:667eea,50:764ba2,100:f093fb&height=200&section=header&text=SocialPulse&fontSize=54&fontColor=ffffff&fontAlignY=38&desc=Full-Stack%20Social%20Feed%20Platform&descAlignY=58&descSize=18&animation=fadeIn" width="100%"/>

<br/>

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io)

<br/>

[![Render](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://render.com)
[![Vercel](https://img.shields.io/badge/Frontend-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)
[![Cloudinary](https://img.shields.io/badge/Media-Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)](https://cloudinary.com)
[![MongoDB Atlas](https://img.shields.io/badge/DB-Atlas-00ED64?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)

<br/>

> **Production-ready** social feed platform inspired by Instagram &amp; Twitter patterns — with hardened security, cloud media storage, and an automated test suite.

</div>

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
- [Security Hardening](#security-hardening)
- [Deployment](#deployment)
- [Go-Live Checklist](#go-live-checklist)
- [Roadmap](#roadmap)
- [License](#license)

---

## Overview

SocialPulse is a compact but complete social application that demonstrates a full request lifecycle across the MERN stack: a React single-page app talking to a REST API backed by MongoDB, with JWT authentication, cloud image uploads, and security middleware. It is intentionally focused, easy to read, and structured the way a small production service would be.

**Live demo:** _add your Vercel URL here_
**API base:** _add your Render URL here_

---

## Features

<table>
<tr>
<td>

**Auth &amp; Users**

- JWT-based authentication
- Secure signup/login with bcrypt
- Token-protected private routes
- Rate-limited auth endpoints

</td>
<td>

**Posts &amp; Media**

- Create posts with text and/or image
- Image upload via Cloudinary (5MB limit)
- Like / unlike toggle
- Paginated feed (newest first)

</td>
<td>

**Engagement**

- Comment on any post
- Delete your own posts
- Optimistic UI updates
- Material UI v5 components

</td>
</tr>
</table>

---

## Tech Stack

| Layer        | Technology                                                          |
| ------------ | ------------------------------------------------------------------- |
| **Frontend** | React 18, Vite, Material UI v5, React Router v6, Axios, Context API  |
| **Backend**  | Node.js, Express, Mongoose                                          |
| **Database** | MongoDB Atlas                                                      |
| **Auth**     | JSON Web Tokens, bcryptjs                                          |
| **Uploads**  | Multer (memory) + Cloudinary                                       |
| **Security** | Helmet, CORS allowlist, express-rate-limit                        |
| **Testing**  | Jest + Supertest                                                  |
| **Hosting**  | Vercel (frontend) + Render (backend)                              |

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
Social-Post-Application/
│
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
│
├── frontend/
│   └── src/
│       ├── api/axios.js        # Axios instance + auth interceptors
│       ├── context/            # AuthContext (session state)
│       ├── components/         # Navbar, PostCard, CommentSection, CreatePostModal
│       ├── pages/              # Login, Signup, Feed
│       ├── App.jsx             # Routes + route guards
│       └── main.jsx            # Theme + providers
│
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

> Never commit `.env` files. Only `.env.example` files are tracked, for reference.

---

## API Reference

Base path: `/api` · Auth header: `Authorization: Bearer <token>`

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

| Module | Test cases                                                                              |
| ------ | --------------------------------------------------------------------------------------- |
| Auth   | Signup success · Weak-password rejection · Login success · Invalid-credentials rejection |
| Posts  | Create post · Toggle like · Add comment · Paginated feed · Delete own post              |

---

## Security Hardening

> This project applies production-level security practices beyond typical tutorial apps.

```text
Helmet.js          → Sets secure HTTP response headers
x-powered-by       → Disabled to reduce fingerprinting
CORS allowlist     → Configurable multi-origin support
Rate limiting      → Auth (20 req / 15 min) + API (200 req / 15 min)
Payload limits     → 1MB max for JSON and URL-encoded bodies
Upload validation  → 5MB max, image MIME types only
Input validation   → Email format, password strength, username rules
Pagination bounds  → Validated on feed queries
Content limits     → Post text and comment length enforced
Ownership checks   → Users can only delete their own posts
```

No secrets are committed to the repository. Only `.env.example` files are tracked.

---

## Deployment

### Backend — Render

Config file: [`render.yaml`](render.yaml)

| Setting        | Value           |
| -------------- | --------------- |
| Service root   | `backend`       |
| Build command  | `npm install`   |
| Start command  | `npm start`     |
| Health check   | `/api/health`   |

Set all required env vars in the Render dashboard, and point `CLIENT_URL` at your Vercel origin.

### Frontend — Vercel

| Setting          | Value                   |
| ---------------- | ----------------------- |
| Project root     | `frontend`              |
| Framework        | Vite                    |
| Build command    | `npm run build`         |
| Output directory | `dist`                  |
| SPA rewrites     | `frontend/vercel.json`  |

Set `VITE_API_URL` to your Render API URL (ending in `/api`).

---

## Go-Live Checklist

<details>
<summary><b>MongoDB Atlas</b></summary>

- [ ] Create a DB user with least-privilege access
- [ ] Whitelist Render egress IP (or `0.0.0.0/0` temporarily)
- [ ] Confirm the TLS connection string works from Render

</details>

<details>
<summary><b>Render Backend</b></summary>

- [ ] Deploy successfully; verify `/api/health` returns `200`
- [ ] All required env vars set
- [ ] `CLIENT_URL` set to the Vercel production origin only
- [ ] Smoke test: signup → login → create post with image

</details>

<details>
<summary><b>Vercel Frontend</b></summary>

- [ ] `VITE_API_URL` points to the Render `/api` URL
- [ ] SPA routes (`/feed`, `/login`, `/signup`) refresh correctly
- [ ] Auth persists across reload; logout on invalid token works

</details>

<details>
<summary><b>Security Checks</b></summary>

- [ ] Rate limiting triggers on repeated auth attempts
- [ ] CORS blocks unknown origins
- [ ] No secrets committed in the repo
- [ ] Rotate credentials if any were ever exposed

</details>

<details>
<summary><b>Release Validation</b></summary>

- [ ] `npm test` passes in `/backend`
- [ ] `npm run build` succeeds in `/frontend`
- [ ] Full end-to-end smoke test in production

</details>

---

## Roadmap

- Follow system and a personalized feed
- Edit posts and comments
- User profiles with avatars
- Real-time updates via WebSockets
- Frontend component tests

---

## License

Released under the [MIT License](https://opensource.org/licenses/MIT).

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:f093fb,50:764ba2,100:667eea&height=100&section=footer" width="100%"/>

<br/>

**Built by [Bennyhinn007](https://github.com/Bennyhinn007)**

[![GitHub](https://img.shields.io/badge/GitHub-Bennyhinn007-181717?style=flat-square&logo=github)](https://github.com/Bennyhinn007)

</div>
