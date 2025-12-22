from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel

from app.routers import auth, patients, appointments
from app import crud, models, schemas
from app.database import SessionLocal, engine

app = FastAPI(
    title="Dentist Appointment System",
    description="Dentist Appointment API",
    version="1.0.0",
    swagger_ui_parameters={"defaultModelsExpandDepth": -1}
)

from fastapi.openapi.utils import get_openapi

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="Dentist Appointment System",
        version="1.0.0",
        description="API for managing dentist appointments and doctors.",
        routes=app.routes,
    )
    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
        }
    }
    openapi_schema["security"] = [{"BearerAuth": []}]
    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi


# include routers
app.include_router(auth.router)
app.include_router(patients.router)
app.include_router(appointments.router)

# ---------- CORS ----------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- DB Dependency ----------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ---------- Root ----------
@app.get("/")
def home():
    return {"message": "Welcome to the Dentist Appointment System!"}
