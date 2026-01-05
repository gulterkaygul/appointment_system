from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import auth, patients, appointments, public, doctor, admin, users
from app.database import SessionLocal

app = FastAPI(
    title="Dentist Appointment System",
    description="Dentist Appointment API",
    version="1.0.0",
    swagger_ui_parameters={"defaultModelsExpandDepth": -1}
)

#CORS (routersdan once)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#ROUTERS
app.include_router(auth.router)
app.include_router(patients.router)
app.include_router(appointments.router)
app.include_router(public.router)
app.include_router(doctor.router)
app.include_router(admin.router)
app.include_router(users.router)

#DB Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

#Root
@app.get("/")
def home():
    return {"message": "Welcome to the Dentist Appointment System!"}
