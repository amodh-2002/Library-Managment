import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'mysql://root:ej944934@localhost/library_db?charset=utf8mb4'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    FRAPPE_API_URL = 'https://frappe.io/api/method/frappe-library'
    
    # Disable redirects for routes without trailing slashes
    STRICT_SLASHES = False