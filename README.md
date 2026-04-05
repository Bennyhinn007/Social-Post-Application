# Social Post Application

Production-ready full-stack social feed app inspired by Instagram/Twitter patterns. Users can sign up, create posts with text/image, like, comment, and delete their own posts.

## Stack

### Frontend

- React (Vite)
- Material UI v5
- Axios
- React Router v6
- React Context API

### Backend

- Node.js + Express
- MongoDB + Mongoose
- JWT auth
- bcryptjs
- Multer + Cloudinary
- Helmet + express-rate-limit
- dotenv + cors

### Database

- MongoDB Atlas
- Collections: `users`, `posts`

## Project Structure

```text
/
├── backend/
│   ├── app.js
│   ├── server.js
│   ├── config/
│   │   └── cloudinary.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── postController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   └── Post.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── posts.js
│   ├── tests/
│   │   ├── auth.test.js
│   │   ├── posts.test.js
│   │   └── setup.js
│   ├── utils/
│   │   └── validation.js
│   ├── .env.example
│   ├── jest.config.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/axios.js
│   │   ├── context/AuthContext.jsx
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   ├── index.html
│   ├── vercel.json
│   ├── vite.config.js
│   └── package.json
├── render.yaml
└── README.md
```

## Environment Variables

### backend/.env.example

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

### frontend/.env.example

```env
VITE_API_URL=http://localhost:5000/api
```

## Local Setup

1. Install backend dependencies:

```bash
cd backend
npm install
```

2. Install frontend dependencies:

```bash
cd ../frontend
npm install
```

3. Create `.env` files from examples and fill real values.

4. Start backend:

```bash
cd ../backend
npm run dev
```

5. Start frontend:

```bash
cd ../frontend
npm run dev
```

## Security Hardening Included

- Helmet security headers enabled.
- `x-powered-by` disabled.
- CORS allowlist with configurable multi-origin support.
- Auth and API route rate limiting (`express-rate-limit`).
- Stricter payload limits (`1mb` JSON/urlencoded).
- Upload restrictions:
  - max image size 5MB
  - image mime types only
- Stricter validation for:
  - email format
  - username format
  - password strength
  - pagination bounds
  - post/comment length limits

## API Tests

Small backend API suite using Jest + Supertest with mocked data models.

Run tests:

```bash
cd backend
npm test
```

Current coverage scope:

- Auth
  - signup success
  - signup weak-password rejection
  - login success
  - login invalid-credentials rejection
- Posts
  - create post
  - toggle like
  - add comment
  - paginated feed
  - delete own post

## API Endpoints

| Method | Endpoint                          | Auth | Description                                            |
| ------ | --------------------------------- | ---- | ------------------------------------------------------ |
| POST   | `/api/auth/signup`                | No   | Register user and return JWT + user                    |
| POST   | `/api/auth/login`                 | No   | Login and return JWT + user                            |
| GET    | `/api/posts/feed?page=1&limit=10` | No   | Paginated feed sorted newest first                     |
| POST   | `/api/posts/create`               | Yes  | Create post (`multipart/form-data`: `text?`, `image?`) |
| PUT    | `/api/posts/:postId/like`         | Yes  | Toggle like                                            |
| POST   | `/api/posts/:postId/comment`      | Yes  | Add comment `{ text }`                                 |
| DELETE | `/api/posts/:postId`              | Yes  | Delete own post                                        |

## Deployment

### Backend (Render)

- Config file: `render.yaml`
- Service root: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Health check: `/api/health`

Required Render environment variables:

- `NODE_ENV=production`
- `PORT=5000`
- `MONGO_URI`
- `JWT_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `CLIENT_URL` (set to Vercel URL)
- `AUTH_RATE_LIMIT_WINDOW_MS`
- `AUTH_RATE_LIMIT_MAX`
- `API_RATE_LIMIT_WINDOW_MS`
- `API_RATE_LIMIT_MAX`

### Frontend (Vercel)

- Project root: `frontend`
- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`
- SPA rewrite config: `frontend/vercel.json`

Required Vercel environment variable:

- `VITE_API_URL=https://<your-render-backend-domain>/api`

## Final Go-Live Checklist

1. MongoDB Atlas

- Create DB user with least privilege.
- Whitelist Render egress (or `0.0.0.0/0` temporarily).
- Confirm TLS connection string works from Render.

2. Render backend

- Deploy successfully and verify `/api/health` returns `200`.
- Confirm all required env vars are set.
- Set `CLIENT_URL` to your Vercel production origin only.
- Verify signup/login and post create (with image) from production frontend.

3. Vercel frontend

- Confirm `VITE_API_URL` points to Render `/api` URL.
- Verify routes refresh correctly (`/feed`, `/login`, `/signup`) due SPA rewrites.
- Confirm auth flow persists and logout on invalid token works.

4. Security checks

- Validate rate limit behavior on repeated auth attempts.
- Verify CORS blocks unknown origins.
- Ensure no secrets are committed in repo.
- Rotate credentials if any secrets were ever exposed.

5. Release validation

- Run backend tests: `npm test` in `backend`.
- Run frontend build: `npm run build` in `frontend`.
- Smoke test critical flows end-to-end in production.
