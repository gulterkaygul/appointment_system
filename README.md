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

#### Admin
- Can log in
- Can view all users (doctors and patients)
- Can create, update, and delete doctors
- Can view all appointments
- Can delete any appointment
- Can access all administrative endpoints

---

#### Doctor
- Can log in
- Can view own appointments
- Can view all appointments
- Can update and delete appointments
- Can access doctor dashboard endpoints

---

Passwords are stored as hashed values.

JWT tokens include:
- sub → user email
- role → user role

---

## Admin Login

### Endpoint
POST /auth/login

### Request Body
```json
{
  "email": "admin@system.com",
  "password": "admin123"
}

## Doctor Login

Doctors authenticate using their email and password to access doctor-only endpoints.

### Endpoint
POST /auth/login

### Request Body
```json
{
  "email": "ahmet.kaya@clinic.com",
  "password": "doctor123"
}

---

# Dentist Appointment System – Frontend

This repository contains the frontend implementation of the Dentist Appointment System.
The frontend provides a modern, responsive, and user-friendly interface for patients
and doctors, and safely integrates with the existing backend API.

The system is developed using React (Vite) and Tailwind CSS, focusing on UI consistency,
usability, and backend integration safety.

---

## Technologies Used

* React (Vite) – Frontend framework
* Tailwind CSS – Utility-first CSS framework
* React Router – Client-side routing
* JavaScript (ES Modules)
* Axios / Fetch API – Backend communication
* LocalStorage – JWT token persistence
* Git & GitHub – Version control

---

## Project Structure

frontend/

```
src/
├── components/
│   ├── Navbar.jsx
│   ├── Header.jsx
│   └── AppointmentModal.jsx
├── pages/
│   ├── Home.jsx
│   ├── Doctors.jsx
│   ├── Contact.jsx
│   ├── Corporate.jsx
│   └── Partners.jsx
├── assets/
│   └── logo.png
├── App.jsx
├── main.jsx
└── index.css
```

The structure follows React best practices by separating reusable UI components,
page-level views, and static assets.

---

## Implemented Frontend Features

### Patient-Facing Pages

* **Home** – Hospital information and appointment booking modal
* **Doctors** – Card-based doctor listing with responsive layout
* **Contact** – Contact details, working hours, and Google Maps integration
* **Corporate** – Institutional information
* **Partners & Insurance** – Insurance companies and partner institutions

---

### Appointment Booking System

Patients can create appointments without authentication.

The appointment modal includes:

* Patient name and phone number
* Doctor selection and department
* Appointment date and time
* Optional complaint
* Mandatory KVKK consent checkbox

Form data is sent to the backend using the exact payload format expected by the API,
without modifying any backend logic.

---

## UI & Design Decisions

* Consistent blue background across all pages
* Burgundy gradient decorations to remove white empty areas
* Reusable card components with rounded corners, borders, and hover effects
* Fully responsive design using Tailwind CSS
* Corporate header with logo, institution name, and navigation

---

## Backend Integration Safety

Strict rules were followed to ensure backend stability:

* API endpoints were not changed
* Payload structures remained identical
* Backend business logic was untouched
* No backend files were edited

---

## Planned Future Work

* Doctor / Nurse panel
* Appointment list and detail views for staff
* Extended role-based access control
* UI feedback for appointment creation

---

## Conclusion

The frontend implementation provides a professional, responsive, and scalable user
interface while preserving backend stability and real-world healthcare workflow logic.

