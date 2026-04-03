# 🚀 SocialConnect / Connexio
### Full-Stack Social Media Platform

> A lightweight social networking application with authentication, posts, likes, comments, and personalized feeds.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [System Architecture](#-system-architecture)
- [Data Flow Diagram](#-data-flow-diagram)
- [Authentication Flow](#-authentication-flow)
- [Tech Stack](#-tech-stack)
- [API Design](#-api-design)
- [Project Structure](#-project-structure)
- [Setup & Installation](#-setup--installation)
- [Features](#-features)
- [Security Features](#-security-features)

---

## 🔍 Overview

**SocialConnect** is a full-stack social media application where users can:

- 🔐 Register and login using JWT authentication
- 📝 Create posts with optional images
- ❤️ Like and comment on posts
- 👤 Manage their profile
- 👥 Follow/unfollow users (optional)
- 📰 View a feed of posts

---

## 🏗️ System Architecture

```mermaid
graph TB
    subgraph Client["🖥️ Client Layer"]
        UI[Next.js Frontend]
        RC[React Components]
        TW[Tailwind CSS + shadcn/ui]
    end

    subgraph Server["⚙️ Server Layer"]
        API[Next.js API Routes /api]
        MW[JWT Middleware]
        AUTH[Auth Utils]
    end

    subgraph Database["🗄️ Data Layer"]
        SB[(Supabase PostgreSQL)]
        SS[Supabase Storage]
    end

    UI --> RC
    RC --> API
    API --> MW
    MW --> AUTH
    AUTH --> SB
    API --> SS
```

---

## 🔄 Data Flow Diagram

```mermaid
flowchart TD
    U([👤 User]) -->|HTTP Request| FE[Next.js Frontend]
    FE -->|API Call with JWT| MW{🔐 Middleware\nJWT Verification}

    MW -->|❌ Invalid Token| ERR[401 Unauthorized]
    MW -->|✅ Valid Token| API[API Route Handler]

    API -->|Query| DB[(Supabase\nPostgreSQL)]
    API -->|Upload/Fetch| ST[Supabase Storage]

    DB -->|Data Response| API
    ST -->|File URL| API

    API -->|JSON Response| FE
    FE -->|Rendered UI| U
```

---

## 🔐 Authentication Flow

```mermaid
sequenceDiagram
    actor User
    participant FE as Next.js Frontend
    participant API as API Routes
    participant DB as Supabase DB
    participant JWT as JWT (jose)

    User->>FE: Enter credentials
    FE->>API: POST /api/auth/register or /login
    API->>DB: Check / Create user record
    DB-->>API: User data
    API->>JWT: Sign JWT with secret
    JWT-->>API: Signed token
    API-->>FE: Set HTTP-only cookie with JWT
    FE-->>User: Redirect to feed

    Note over User,JWT: Subsequent Requests

    User->>FE: Access protected page
    FE->>API: Request + JWT cookie
    API->>JWT: Verify token via Middleware
    JWT-->>API: Decoded payload
    API->>DB: Fetch requested data
    DB-->>API: Response data
    API-->>FE: Protected resource
    FE-->>User: Render content
```

---

## 🧰 Tech Stack

### 🎨 Frontend

| Technology | Purpose |
|------------|---------|
| ![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=nextdotjs&logoColor=white) | Full-stack React framework |
| ![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB) | UI component library |
| ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white) | Type-safe JavaScript |
| ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white) | Utility-first styling |
| `shadcn/ui` | Accessible component primitives |

### 🧠 Backend

| Technology | Purpose |
|------------|---------|
| Next.js API Routes (`/api`) | Serverless backend endpoints |
| Middleware | JWT verification layer |
| `jose` | JWT signing & verification |

### 🗄️ Database & Storage

| Technology | Purpose |
|------------|---------|
| ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white) | PostgreSQL database |
| Supabase Storage | Image & file storage |
| Supabase JS Client | Database SDK |

### 🔐 Security

| Technology | Purpose |
|------------|---------|
| `bcryptjs` | Password hashing |
| JWT | Stateless authentication |

### ☁️ Deployment

| Technology | Purpose |
|------------|---------|
| ![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white) | Hosting & CI/CD |
| ![GitHub](https://img.shields.io/badge/GitHub-100000?style=flat&logo=github&logoColor=white) | Source control |

---

## 🔌 API Design

### 🔐 Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login and receive JWT |
| `POST` | `/api/auth/logout` | Clear auth cookie |

### 👤 Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/users` | List all users |
| `GET` | `/api/users/{id}` | Get user by ID |
| `PATCH` | `/api/users/me` | Update current user profile |

### 📝 Posts

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/posts` | Create a new post |
| `GET` | `/api/posts` | Retrieve all posts |
| `PATCH` | `/api/posts/{id}` | Edit a post |
| `DELETE` | `/api/posts/{id}` | Delete a post |

### ❤️ Social Features

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/posts/{id}/like` | Like a post |
| `DELETE` | `/api/posts/{id}/like` | Unlike a post |
| `POST` | `/api/posts/{id}/comments` | Add a comment |
| `GET` | `/api/posts/{id}/comments` | Get post comments |

### 📰 Feed

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/feed` | Get personalized user feed |

---

## 📁 Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── register/
│   │   │   ├── login/
│   │   │   └── logout/
│   │   ├── users/
│   │   │   ├── [id]/
│   │   │   └── me/
│   │   ├── posts/
│   │   │   └── [id]/
│   │   │       ├── like/
│   │   │       └── comments/
│   │   └── feed/
│   └── page.tsx
│
├── lib/
│   ├── supabase.ts
│   ├── jwt.ts
│   └── auth-utils.ts
│
├── types/
│   └── index.ts
│
└── middleware.ts
```

---

## ⚙️ Setup & Installation

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd project
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
JWT_SECRET=your_jwt_secret_key
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ✨ Features

- [x] JWT Authentication (register, login, logout)
- [x] Create / Edit / Delete Posts
- [x] Image Upload via Supabase Storage
- [x] Like & Comment System
- [x] User Profiles
- [x] Personalized Feed System
- [ ] Follow / Unfollow Users *(optional)*

---

## 🔐 Security Features

- 🔒 **Password hashing** using `bcryptjs`
- 🪪 **JWT-based authentication** via `jose`
- 🛡️ **Protected API routes** with middleware
- ✅ **Input validation** on all endpoints
- 🍪 **HTTP-only cookies** for token storage

---

## 🏁 Conclusion

This project demonstrates a production-level full-stack application using:

| Layer | Technology |
|-------|------------|
| Frontend + Backend | Next.js (App Router + API Routes) |
| Database + Storage | Supabase (PostgreSQL + Supabase Storage) |
| Authentication | JWT with `jose` + `bcryptjs` |
| Deployment | Vercel + GitHub |

> Built with clean API architecture, type safety, and security best practices throughout.
