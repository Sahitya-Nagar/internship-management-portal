# Internship & Placement Management Portal

## Overview

The Internship & Placement Management Portal is a full-stack web application designed to streamline internship and placement activities between students, employers, and administrators.

The platform enables:

* Students to search and apply for internships
* Employers to post jobs and manage applicants
* Administrators to oversee placements and analytics
* Centralized management of internship opportunities

---

# Features

## Student Portal

* Student Registration & Login
* Profile Management
* Resume Upload
* Internship Search
* Application Tracking
* Placement History

## Employer Portal

* Employer Registration
* Company Profile Management
* Job Posting Management
* Applicant Review
* Candidate Shortlisting

## Admin Dashboard

* User Management
* Employer Management
* Job Management
* Application Monitoring
* Placement Analytics
* Report Generation

---

# Tech Stack

## Frontend

* React.js
* Vite
* Tailwind CSS
* React Router DOM
* Axios
* Recharts
* Shadcn/UI

## Backend

* Node.js
* Express.js
* JWT Authentication
* bcrypt
* Multer

## Database

* PostgreSQL
* Prisma ORM

## DevOps

* Docker
* Docker Compose
* GitHub

---

# Project Structure

```bash
internship-management-portal/
│
├── client/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── .env
│
├── server/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   ├── uploads/
│   ├── package.json
│   └── .env
│
├── docker-compose.yml
├── README.md
└── .gitignore
```

---

# Frontend Setup

## Navigate to Client Folder

```bash
cd client
```

## Install Dependencies

```bash
npm install
```

## Create Environment File

Create:

```bash
client/.env
```

Add:

```env
VITE_API_URL=http://localhost:5000/api
```

## Start Frontend

```bash
npm run dev
```

Frontend will run on:

```text
http://localhost:5173
```

---

# Backend Setup

## Navigate to Server Folder

```bash
cd server
```

## Install Dependencies

```bash
npm install
```

## Create Environment File

Create:

```bash
server/.env
```

Add:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/internship_portal

JWT_SECRET=your_jwt_secret

JWT_REFRESH_SECRET=your_refresh_secret

PORT=5000

CLIENT_URL=http://localhost:5173
```

## Generate Secure JWT Secret

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Start Backend

```bash
npm run dev
```

Backend will run on:

```text
http://localhost:5000
```

---

# Database Setup

## Install PostgreSQL

Download PostgreSQL and create a database named:

```text
internship_portal
```

## Prisma Client Generation

```bash
npx prisma generate
```

## Run Database Migration

```bash
npx prisma migrate dev --name init
```

## Open Prisma Studio

```bash
npx prisma studio
```

## Verify Database Tables

```bash
psql -U postgres -d internship_portal
```

```sql
\dt
```

Expected tables:

```text
User
StudentProfile
EmployerProfile
Job
Application
_prisma_migrations
```

---

# Docker Setup

## Build and Start Containers

```bash
docker compose up --build
```

Services:

| Service    | Port |
| ---------- | ---- |
| Frontend   | 5173 |
| Backend    | 5000 |
| PostgreSQL | 5432 |

## Check Running Containers

```bash
docker compose ps
```

## Stop Containers

```bash
docker compose down
```

## Remove Containers and Volumes

```bash
docker compose down -v
```

⚠️ This deletes database data.

---

# Useful Commands

## Backend Logs

```bash
docker compose logs -f server
```

## Frontend Logs

```bash
docker compose logs -f client
```

## Database Logs

```bash
docker compose logs -f postgres
```

## Open Backend Container

```bash
docker compose exec server sh
```

## Open PostgreSQL Shell

```bash
docker compose exec postgres psql -U postgres -d internship_portal
```

---

# API Base URL

```text
http://localhost:5000/api
```

## Health Check

```http
GET /api/health
```

Response:

```json
{
  "success": true,
  "message": "Backend is healthy"
}
```

---

# GitHub Workflow

## Clone Repository

```bash
git clone https://github.com/Sahitya-Nagar/internship-management-portal.git

cd internship-management-portal
```

## Commit Changes

```bash
git add .

git commit -m "Project setup"

git push origin main
```

---

# Team Members

* Sahitya Nagar
* Dev Kansara
* Jaimil Kothari
* Sarhan Kapadiya

---

# Academic Project

**Course:** COMP 8967 – Internship / Project I

**University:** University of Windsor

**Project:** Internship & Placement Management Portal
