🚀 SocialConnect / Connexio
Full-Stack Social Media Platform

A lightweight social networking application with authentication, posts, likes, comments, and personalized feeds.

📋 Table of Contents
Overview
System Architecture
Data Flow Diagram
Authentication Flow
Tech Stack
API Design
Project Structure
Setup & Installation
Features
Security Features
🔍 Overview

SocialConnect is a full-stack social media application where users can:

Register and login using JWT authentication
Create posts with optional images
Like and comment on posts
Manage their profile
Follow/unfollow users (optional)
View a feed of posts
🏗️ System Architecture
┌───────────────────────────────────────────────┐
│                SOCIALCONNECT                 │
│           Full-Stack Web Platform            │
└───────────────────────────────────────────────┘

   ┌─────────────────────────────────────────┐
   │         FRONTEND (Next.js + React)     │
   │         http://localhost:3000          │
   │                                         │
   │  Dashboard | Feed | Profile | Auth      │
   └─────────────────────────────────────────┘
                     │
                     ▼
   ┌─────────────────────────────────────────┐
   │       BACKEND (Next.js API Routes)      │
   │            /api/* endpoints             │
   │                                         │
   │  Auth | Users | Posts | Likes | Feed    │
   └─────────────────────────────────────────┘
                     │
         ┌───────────┼────────────┐
         ▼           ▼            ▼
 ┌────────────┐ ┌────────────┐ ┌──────────────┐
 │ Supabase   │ │ Supabase   │ │ JWT System   │
 │ PostgreSQL │ │ Storage    │ │ (jose)       │
 │ Database   │ │ (Images)   │ │              │
 └────────────┘ └────────────┘ └──────────────┘
🔄 Data Flow Diagram
Diagram is not supported.
🔐 Authentication Flow
Diagram is not supported.
🧰 Tech Stack
🎨 Frontend
Technology	Purpose
Next.js	Full-stack React framework
React	UI rendering
TypeScript	Type safety
Tailwind CSS	Styling
shadcn/ui	UI components
🧠 Backend
Technology	Purpose
Next.js API Routes	Backend logic
Middleware	Auth protection
jose	JWT handling
🗄️ Database & Storage
Technology	Purpose
Supabase (PostgreSQL)	Database
Supabase Storage	Image storage
Supabase JS Client	DB interaction
🔐 Security
Technology	Purpose
bcryptjs	Password hashing
JWT (jose)	Authentication
☁️ Deployment
Platform	Purpose
Vercel	Hosting
GitHub	Version control
🔌 API Design
Authentication
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
Users
GET /api/users
GET /api/users/{id}
PATCH /api/users/me
Posts
POST /api/posts
GET /api/posts
PATCH /api/posts/{id}
DELETE /api/posts/{id}
Social Features
POST /api/posts/{id}/like
DELETE /api/posts/{id}/like
POST /api/posts/{id}/comments
GET /api/posts/{id}/comments
Feed
GET /api/feed
📁 Project Structure
app/
 ├── api/
 │   ├── auth/
 │   ├── users/
 │   ├── posts/
 │   ├── feed/
 ├── page.tsx

lib/
 ├── supabase.ts
 ├── jwt.ts
 ├── auth-utils.ts

types/
 ├── index.ts

middleware.ts
⚙️ Setup & Installation
git clone <repo>
cd project
npm install
npm run dev
🔑 Environment Variables
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
JWT_SECRET=
✨ Features
JWT Authentication
Create/Edit/Delete Posts
Image Upload (Supabase Storage)
Like & Comment System
User Profiles
Feed System
🔐 Security Features
Password hashing (bcrypt)
JWT authentication
API route protection
Input validation
🏁 Conclusion

This project demonstrates a production-level full-stack architecture using:

Next.js (frontend + backend)
Supabase (DB + Storage)
JWT authentication
Clean API design
