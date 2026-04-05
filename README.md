<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:667eea,50:764ba2,100:f093fb&height=200&section=header&text=Social%20Post%20App&fontSize=52&fontColor=ffffff&fontAlignY=38&desc=Full-Stack%20Social%20Feed%20Platform&descAlignY=58&descSize=18&animation=fadeIn" width="100%"/>

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

> 🚀 **Production-ready** social feed platform inspired by Instagram & Twitter patterns — with enterprise-grade security, cloud media storage, and full test coverage.

</div>

---

## 📌 Table of Contents

- [✨ Features](#-features)
- [🧱 Tech Stack](#-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🔐 Security Hardening](#-security-hardening)
- [⚙️ Local Setup](#%EF%B8%8F-local-setup)
- [🌐 Environment Variables](#-environment-variables)
- [🧪 API Tests](#-api-tests)
- [📡 API Reference](#-api-reference)
- [🚢 Deployment](#-deployment)
- [✅ Go-Live Checklist](#-go-live-checklist)

---

## ✨ Features

<table>
<tr>
<td>

**👤 Auth & Users**
- JWT-based authentication
- Secure signup/login with bcrypt
- Token-protected private routes
- Rate-limited auth endpoints

</td>
<td>

**📸 Posts & Media**
- Create posts with text and/or image
- Image upload via Cloudinary (5MB limit)
- Like / Unlike toggle
- Paginated feed (newest first)

</td>
<td>

**💬 Engagement**
- Comment on any post
- Delete your own posts
- Real-time context via React state
- Material UI v5 components

</td>
</tr>
</table>

---

## 🧱 Tech Stack

### Backend
| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB Atlas + Mongoose |
| Auth | JWT + bcryptjs |
| Media Upload | Multer + Cloudinary |
| Security | Helmet, express-rate-limit, CORS allowlist |
| Testing | Jest + Supertest |

### Frontend
| Layer | Technology |
|---|---|
| Framework | React 18 (Vite) |
| UI Library | Material UI v5 |
| HTTP Client | Axios |
| Routing | React Router v6 |
| State | React Context API |

---

## 📁 Project Structure

```
Social-Post-Application/
│
├── 📂 backend/
│   ├── app.js                    # Express app setup
│   ├── server.js                 # Entry point
│   ├── config/
│   │   └── cloudinary.js         # Cloudinary config
│   ├── controllers/
│   │   ├── authController.js     # Signup / Login logic
│   │   └── postController.js     # CRUD + like/comment
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT verification
│   ├── models/
│   │   ├── User.js               # User schema
│   │   └── Post.js               # Post schema
│   ├── routes/
│   │   ├── auth.js               # /api/auth
│   │   └── posts.js              # /api/posts
│   ├── tests/
│   │   ├── auth.test.js
│   │   ├── posts.test.js
│   │   └── setup.js
│   ├── utils/
│   │   └── validation.js         # Input validators
│   ├── .env.example
│   ├── jest.config.js
│   └── package.json
│
├── 📂 frontend/
│   ├── src/
│   │   ├── api/axios.js          # Axios base instance
│   │   ├── context/AuthContext.jsx
│   │   ├── components/           # Reusable UI components
│   │   ├── pages/                # Route-level views
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   ├── index.html
│   ├── vercel.json               # SPA rewrite rules
│   ├── vite.config.js
│   └── package.json
│
├── render.yaml                   # Render deploy config
└── README.md
```

---

## 🔐 Security Hardening

> This project applies **production-level security practices** beyond typical tutorial apps.

```
🛡️  Helmet.js         → Sets secure HTTP response headers
🚫  x-powered-by      → Disabled to reduce fingerprinting
🌐  CORS Allowlist     → Configurable multi-origin support
🔁  Rate Limiting      → Auth (20 req/15min) + API (200 req/15min)
📦  Payload Limits     → 1MB max for JSON and URL-encoded bodies
🖼️  Upload Validation  → 5MB max, image MIME types only
✅  Input Validation   → Email format, password strength, username rules
📄  Pagination Bounds  → Validated on feed queries
💬  Content Limits     → Post text and comment length enforced
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js ≥ 18
- MongoDB Atlas account
- Cloudinary account

### 1. Clone the repo

```bash
git clone https://github.com/Bennyhinn007/Social-Post-Application.git
cd Social-Post-Application
```

### 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
# Fill in your values in .env
npm run dev
```

### 3. Frontend setup

```bash
cd ../frontend
npm install
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000/api
npm run dev
```

> Frontend runs on `http://localhost:5173` · Backend runs on `http://localhost:5000`

---

## 🌐 Environment Variables

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

> ⚠️ Never commit `.env` files. All secrets are in `.env.example` for reference only.

---

## 🧪 API Tests

Built with **Jest + Supertest** using mocked data models for fast, isolated unit tests.

```bash
cd backend
npm test
```

### Coverage

| Module | Test Cases |
|---|---|
| Auth | ✅ Signup success · ✅ Weak password rejection · ✅ Login success · ✅ Invalid credentials |
| Posts | ✅ Create post · ✅ Toggle like · ✅ Add comment · ✅ Paginated feed · ✅ Delete own post |

---

## 📡 API Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/signup` | ❌ | Register user, returns JWT + user |
| `POST` | `/api/auth/login` | ❌ | Login, returns JWT + user |
| `GET` | `/api/posts/feed?page=1&limit=10` | ❌ | Paginated feed, newest first |
| `POST` | `/api/posts/create` | ✅ | Create post (`multipart/form-data`: `text?`, `image?`) |
| `PUT` | `/api/posts/:postId/like` | ✅ | Toggle like on a post |
| `POST` | `/api/posts/:postId/comment` | ✅ | Add comment `{ text }` |
| `DELETE` | `/api/posts/:postId` | ✅ | Delete own post |

---

## 🚢 Deployment

### 🔵 Backend — Render

Config file: `render.yaml`

| Setting | Value |
|---|---|
| Service root | `backend` |
| Build command | `npm install` |
| Start command | `npm start` |
| Health check | `/api/health` |

**Required env vars on Render:**

```
NODE_ENV=production
PORT=5000
MONGO_URI
JWT_SECRET
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
CLIENT_URL          ← Set to your Vercel production URL
AUTH_RATE_LIMIT_WINDOW_MS
AUTH_RATE_LIMIT_MAX
API_RATE_LIMIT_WINDOW_MS
API_RATE_LIMIT_MAX
```

### ⚫ Frontend — Vercel

| Setting | Value |
|---|---|
| Project root | `frontend` |
| Framework | Vite |
| Build command | `npm run build` |
| Output directory | `dist` |
| SPA rewrites | `frontend/vercel.json` |

**Required env var on Vercel:**

```
VITE_API_URL=https://<your-render-backend-domain>/api
```

---

## ✅ Go-Live Checklist

<details>
<summary><b>🍃 MongoDB Atlas</b></summary>

- [ ] Create DB user with least-privilege access
- [ ] Whitelist Render egress IP (or `0.0.0.0/0` temporarily)
- [ ] Confirm TLS connection string works from Render

</details>

<details>
<summary><b>🔵 Render Backend</b></summary>

- [ ] Deploy successfully, verify `/api/health` returns `200`
- [ ] All required env vars set
- [ ] `CLIENT_URL` set to Vercel production origin only
- [ ] Smoke test: signup → login → create post with image

</details>

<details>
<summary><b>⚫ Vercel Frontend</b></summary>

- [ ] `VITE_API_URL` points to Render `/api`
- [ ] SPA routes (`/feed`, `/login`, `/signup`) refresh correctly
- [ ] Auth persists across reload; logout on invalid token works

</details>

<details>
<summary><b>🔐 Security Checks</b></summary>

- [ ] Rate limiting triggers on repeated auth attempts
- [ ] CORS blocks unknown origins
- [ ] No secrets committed in repo
- [ ] Rotate credentials if ever exposed

</details>

<details>
<summary><b>🚀 Release Validation</b></summary>

- [ ] `npm test` passes in `/backend`
- [ ] `npm run build` succeeds in `/frontend`
- [ ] Full E2E smoke test in production

</details>

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:f093fb,50:764ba2,100:667eea&height=100&section=footer" width="100%"/>

<br/>

**Built with 💜 by [Benny Sangnalkar](https://github.com/Bennyhinn007)**

[![GitHub](https://img.shields.io/badge/GitHub-Bennyhinn007-181717?style=flat-square&logo=github)](https://github.com/Bennyhinn007)

</div>
