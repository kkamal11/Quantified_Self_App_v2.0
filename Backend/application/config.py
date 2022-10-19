import os
base_dir = os.path.abspath(os.path.dirname(__file__))

class Config():
    DEBUG = False
    SQLITE_DB_DIR = None
    SQLALCHEMY_DATABASE_URI = None
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    WTF_CSRF_ENABLED = False
    SECURITY_TOKEN_AUTHENTICATION_HEADER = "Authentication-Token"
    CELERY_BROKER_URL = "redis://localhost:6379/3"
    CELERY_RESULT_BACKEND = "redis://localhost:6379/3"

    CACHE_TYPE = "RedisCache"
    CACHE_KEY_PREFIX = "api_"
    CACHE_REDIS_URL = "redis://localhost:6379/2"
    CACHE_DEFAULT_TIMEOUT = 86400
    
class LocalDevelopmentConfig(Config):
    SQLITE_DB_DIR = os.path.join(base_dir, "../database")
    SQLALCHEMY_DATABASE_URI = "sqlite:///" + os.path.join(SQLITE_DB_DIR, "db.sqlite3")
    DEBUG = True
    SECRET_KEY = "5d84b5c1378ff03b2c4c6c456fc8b88ccf5488bf"
    # SECRET_KEY = os.environ.get('SECRET_KEY')
    SECURITY_PASSWORD_HASH = "bcrypt"
    SECURITY_PASSWORD_SALT = "3b1f8d5962a848e13ace1a14d5968c7e0b999869"
    SECURITY_REGISTERABLE = True 
    # SECURITY_USERNAME_ENABLE = True
    # SECURITY_USERNAME_REQUIRED = True
    # SECURITY_USERNAME_MIN_LENGTH = 8
    # SECURITY_USERNAME_MAX_LENGTH = 32
    SECURITY_CHANGEABLE = True 
    SECURITY_SEND_REGISTER_EMAIL = False
    SECURITY_UNAUTHORIZED_VIEW = None
    CELERY_BROKER_URL = "redis://localhost:6379/3"
    CELERY_RESULT_BACKEND = "redis://localhost:6379/3"

    CACHE_TYPE = "RedisCache"
    CACHE_KEY_PREFIX = "api_"
    CACHE_REDIS_URL = "redis://localhost:6379/2"
    CACHE_DEFAULT_TIMEOUT = 1000