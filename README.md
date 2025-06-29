# 🎟️ Event Management Backend

A robust and scalable **Event Management System backend** built using **Node.js**, **Express**, **TypeScript**, **Prisma**, and **PostgreSQL**.

This backend supports:
- Admin operations: user and event management
- User operations: event registration, cancellation, and profile management
- Secure authentication flow with JWT tokens
- Password reset on first login for new users

---

## 🌟 Features

- ✅ **Role-based Access Control** (Admin & User)
- 🔐 **JWT Authentication & First Login Password Reset**
- 📅 **Event Lifecycle Management** (Create, Update, Delete, List)
- 🧑‍💼 **Admin Panel APIs** for managing users and events
- 🙋‍♂️ **User APIs** for registering and cancelling events
- ⚙️ **Type-safe backend** using TypeScript and Prisma
- 📦 Modular project structure following best practices

---

## 🧰 Tech Stack

| Category         | Technology             |
|------------------|------------------------|
| Language         | TypeScript             |
| Framework        | Express.js             |
| ORM              | Prisma                 |
| Database         | PostgreSQL             |
| Auth             | JWT                    |
| Validation       | Zod                    |
| Dev Tools        | Nodemon, ts-node       |

---
## 🚀 Getting Started

### 🔽 Clone the Repository

git clone https://github.com/AravindAnkamalla/event-management-BE.git
cd event-management-BE

## Install Dependencies
npm install

## Configure Environment Variables

DATABASE_URL="postgresql://<user>:<password>@localhost:5432/eventdb"
JWT_SECRET="your_secret_key"
PORT=5000

## Initialize Database
npx prisma migrate dev --name init

## Start the Development Server
npm run dev


