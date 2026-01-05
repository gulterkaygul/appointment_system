# Dentist Appointment System – Backend

This repository contains the backend implementation of the Dentist Appointment System.
The backend handles authentication, role-based authorization, appointment management,
and database operations.

The system is developed using FastAPI, PostgreSQL, SQLAlchemy, Alembic, and JWT.

---

## Technologies Used

- FastAPI – RESTful API framework
- PostgreSQL – Relational database
- SQLAlchemy ORM – Database modeling
- Alembic – Database migrations
- JWT (JSON Web Token) – Authentication & authorization
- bcrypt / passlib – Secure password hashing
- Uvicorn – ASGI server

---

## Project Structure

backend/
├── app/
│   ├── main.py              # FastAPI entry point
│   ├── database.py          # Database configuration
│   ├── models.py            # SQLAlchemy models
│   ├── schemas.py           # Pydantic schemas
│   ├── security.py          # JWT & role-based security
│   ├── crud.py              # Database operations
│   └── routers/
│       ├── auth.py          # Authentication endpoints
│       ├── patients.py      # Patient management
│       └── appointments.py  # Appointment management
├── alembic/
│   └── versions/            # Migration files
├── alembic.ini
└── README.md

---

## Authentication & Authorization

The system uses JWT-based authentication.

### Roles
- Doctor
  - Can log in
  - Can view own appointments
  - Can view all appointments
  - Can update and delete appointments
  - Can access doctor dashboard endpoints

Passwords are stored as hashed values.
JWT tokens include:
- sub → user email
- role → user role

---

## Doctor Login

### Endpoint
POST /auth/login

### Request Body
```json
{
  "email": "ahmet.kaya@clinic.com",
  "password": "doctor123"
}


