# Task-02: Employee Management System (MERN)

An admin-controlled CRUD app for managing employee records, built on the same auth system
as Task-01 (JWT in httpOnly cookies, bcrypt, role-based access).

## Stack
- Backend: Node.js, Express, MongoDB (Mongoose), JWT, bcryptjs, express-validator
- Frontend: React (Vite), React Router, Axios

## Features
- Full auth (register/login/logout) reused from Task-01
- Employee model: name, email, phone, department, position, salary, status, date of joining
- CRUD API for employees, fully validated (express-validator + Mongoose schema validation)
- **Role-based access**: any logged-in user can view/search employees; only `admin` users can
  create, edit, or delete — enforced both in the API (`authorize('admin')` middleware) and in
  the UI (`AdminRoute` hides/blocks the forms and buttons for non-admins)
- Search by name/email, pagination-ready API (`?search=&page=&limit=`)
- Duplicate-email prevention on create

## Setup

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env
# edit .env: set MONGO_URI and a strong JWT_SECRET
npm run dev
```
Runs on `http://localhost:5001` (kept separate from Task-01's port 5000 so both can run together).

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
Runs on `http://localhost:5174`.

## Making a user an admin
New accounts default to `role: "user"`. To test admin features, update a user's role directly in MongoDB:
```js
db.users.updateOne({ email: "you@example.com" }, { $set: { role: "admin" } })
```

## API Endpoints
| Method | Endpoint             | Access        | Description                  |
|--------|-----------------------|---------------|-------------------------------|
| POST   | /api/auth/register     | Public        | Create account                |
| POST   | /api/auth/login        | Public        | Log in                        |
| POST   | /api/auth/logout       | Public        | Log out                       |
| GET    | /api/auth/me           | Private       | Current user                  |
| GET    | /api/employees          | Private       | List/search employees         |
| GET    | /api/employees/:id      | Private       | Get one employee              |
| POST   | /api/employees          | Admin only    | Create employee               |
| PUT    | /api/employees/:id      | Admin only    | Update employee               |
| DELETE | /api/employees/:id      | Admin only    | Delete employee               |

## Notes
- This project has its own MongoDB database (`task02_ems`) — separate from Task-01, so users
  registered here are independent of Task-01's users.
- If you want the two tasks to truly share one auth system, point both `.env` files' `MONGO_URI`
  at the same database.
