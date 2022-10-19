from flask_security import Security, SQLAlchemyUserDatastore
from application.models.userModel import db, User, Role
import flask_security.core as fc

user_datastore = SQLAlchemyUserDatastore(db, User, Role)
sec = Security()
