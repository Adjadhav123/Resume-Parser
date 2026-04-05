from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session 
from app.database.db import get_db
from app.schemas.admin_schemas import AdminSchema, AdminLoginSchema, AdminResponseSchema
from app.crud.admin_crud import create_admin, login_admin
from app.core.helpers import is_authenticated


admin_router = APIRouter(prefix="/admin", tags=["admin"])

@admin_router.post("/register", response_model=AdminResponseSchema)
def register_admin(admin : AdminSchema, db: Session = Depends(get_db)):
    return create_admin(admin, db)

@admin_router.post("/login")
def login_admin_route(admin : AdminLoginSchema , db: Session = Depends(get_db)):
    return login_admin(admin, db)


