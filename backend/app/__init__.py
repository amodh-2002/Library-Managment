from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate
from .config import Config

db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Configure CORS with multiple origins
    CORS(app, 
         resources={r"/api/*": {
             "origins": [
                 "http://localhost:5173",
                 "https://lib.amobitsx7.tech"
             ]
         }},
         allow_headers=["Content-Type"],
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    )
    
    db.init_app(app)
    migrate.init_app(app, db)
    
    from .views import books, members, transactions, api_integration
    
    app.register_blueprint(books.bp)
    app.register_blueprint(members.bp)
    app.register_blueprint(transactions.bp)
    app.register_blueprint(api_integration.bp)
    
    return app