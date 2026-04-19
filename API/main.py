from fastapi import FastAPI
from routes.auth_routes import auth_router
from routes.user_routes import user_router
from routes.reservation_routes import reservation_router
from routes.room_routes import room_router
from routes.quota_routes import quota_router

app = FastAPI(
    title="SICPES API FastAPI", 
    description="API Estructurada (Models, Crud, Schemas, Routes, Config)"
)

# Integración de routers
app.include_router(auth_router, prefix="/api")
app.include_router(user_router, prefix="/api")
app.include_router(reservation_router, prefix="/api")
app.include_router(room_router, prefix="/api")
app.include_router(quota_router, prefix="/api")

@app.get("/", tags=["Inicio"])
def read_root():
    return {"message": "Bienvenido a la API construida con estructura limpia en FastAPI"}
