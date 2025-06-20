# 🧠 Eskalate Job Portal API

A RESTful API built with **NestJS** for a job portal system where **companies** can post job listings and **applicants** can apply, browse jobs, and track applications.

---

## 📦 Tech Stack

- **Backend Framework**: [NestJS](https://nestjs.com)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Database**: PostgreSQL
- **Authentication**: JWT (role-based)
- **Validation**: `class-validator`

---

## 🛠️ Features

### 👤 Applicant
- Sign up / Login
- Browse job listings with search & pagination
- Apply for jobs (without file upload)
- Track submitted applications

### 🏢 Company
- Sign up / Login
- Create, update, and delete job postings
- View all jobs they posted
- View applications for a job
- Change application status (e.g., Reviewed, Interview, etc.)

---

## ⚙️ Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/eskalate-job-portal.git
cd eskalate-job-portal


---

### 1. Clone the Repository
```bash
npm install

Create a .env file in the root directory and add the following:

DATABASE_URL=postgresql://your_pg_user:your_pg_password@localhost:5432/your_db_name
JWT_SECRET=your_jwt_secret_key

###next run 
npm run db:push



###
Run the NestJS server in development mode:

npm run start:dev

The API will be accessible at: localhost:3000



## reason for choosing nestjs 
NestJS is considered one of the best backend frameworks for building scalable, maintainable, and production-ready applications—especially in a TypeScript ecosystem.

Why NestJS is a Great Tech Stack

Built with TypeScript
→ Full type safety, better IDE support, fewer bugs.

Modular Architecture
→ Encourages separation of concerns, scalable project structure.

Dependency Injection
→ Promotes clean, testable, and maintainable code.

Out-of-the-Box Features
→ Includes powerful tools like Guards, Pipes, Interceptors, Exception Filters.

Powerful CLI
→ Quickly generate modules, controllers, services with commands like nest g resource.

