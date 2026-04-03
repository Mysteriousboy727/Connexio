SocialConnect / Connexio
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
🔄 Data Flow Diagram
Diagram is not supported.
🔐 Authentication Flow
Diagram is not supported.
🧰 Tech Stack
🎨 Frontend
Next.js
React
TypeScript
Tailwind CSS
shadcn/ui
🧠 Backend
Next.js API Routes (/api)
Middleware (JWT verification)
jose (JWT handling)
🗄️ Database & Storage
Supabase (PostgreSQL)
Supabase Storage
Supabase JS Client
🔐 Security
bcryptjs (password hashing)
JWT authentication
☁️ Deployment
Vercel
GitHub
🔌 API Design
🔐 Authentication
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
👤 Users
GET /api/users
GET /api/users/{id}
PATCH /api/users/me
📝 Posts
POST /api/posts
GET /api/posts
PATCH /api/posts/{id}
DELETE /api/posts/{id}
❤️ Social Features
POST /api/posts/{id}/like
DELETE /api/posts/{id}/like
POST /api/posts/{id}/comments
GET /api/posts/{id}/comments
📰 Feed
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
git clone <your-repo-url>
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
Password hashing using bcrypt
JWT-based authentication
Protected API routes
Input validation
🏁 Conclusion

This project demonstrates a production-level full-stack application using:

Next.js (frontend + backend)
Supabase (database + storage)
JWT authentication
Clean API architecture
