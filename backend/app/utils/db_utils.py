from ..models import db

def init_db():
    """Initialize the database"""
    db.create_all()

def drop_db():
    """Drop all tables"""
    db.drop_all() 