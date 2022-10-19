from flask import jsonify
from flask_restful import Resource, fields, marshal_with,reqparse
from flask_security import auth_required, hash_password,verify_password
from flask_login import current_user
from datetime import datetime as dt
from application.database import db
from utils.security import user_datastore
from utils.validation import NotFoundError, BussinessValidationError
from utils.cache_func import get_user
from utils.response import success
from Tasks.tasks import send_welcome_mail

user_login_args = reqparse.RequestParser()
user_login_args.add_argument("username",required=True, help="username required")
user_login_args.add_argument("email",required=True, help="email required")
user_login_args.add_argument("password",required=True, help="password required")

user_password_update_args = reqparse.RequestParser()
user_password_update_args.add_argument("old",required=True, help="email required")
user_password_update_args.add_argument("new",required=True, help="password required")

user_res_fields = {
    "email": fields.String,
    "username":fields.String,
    "active_since":fields.DateTime
}


class UserAPI(Resource):
    @auth_required('token')
    @marshal_with(user_res_fields)
    def get(self):
        user = user_datastore.find_user(email = current_user.email)
        if user:
            return get_user(user)
        else:
            raise NotFoundError(status_code=404,error_message="User not found")

    def post(self):
        args = user_login_args.parse_args()
        username = args.get("username",None)
        email = args.get("email")
        if not "@" in email:
            raise BussinessValidationError(status_code=400, error_message="Invalid email")
        password = args.get("password")
        if not user_datastore.find_user(email = email):
            user_datastore.create_user(
                username=username,
                email=email,
                password=hash_password(password),
                active_since=dt.now()
            )
            db.session.commit()
            mail_sent_id = send_welcome_mail.delay(receiver_email=email,subject='Welcome aboard!',username=username)
            return success()
        else:
            raise BussinessValidationError(status_code=409,error_message="User already exists.")

    @auth_required('token')
    def put(self):
        user = user_datastore.find_user(email = current_user.email)
        args = user_password_update_args.parse_args()
        old_password = args.get("old")
        new_password = args.get("new")
        if user:
            isSamePassword = verify_password(old_password, user.password)  #compares the hash of both password and return bool
            if isSamePassword:
                user.password = new_password
                db.session.commit()
                return success()
            else:
                raise BussinessValidationError(status_code=401,error_message="Wrong Password.")
        else:
            raise NotFoundError(status_code=404,error_message="User not found")

    @auth_required('token') #to delete user accounts
    def delete(self,reset=None):
        user = user_datastore.find_user(email = current_user.email)
        if reset is None:
            if user:
                user_datastore.delete_user(user)
                db.session.commit()
                return success()
            else:
                raise NotFoundError(status_code=404,error_message="User not found")
        else:
            if user:
                trackers = user.trackers
                for t in trackers:
                    db.session.delete(t)
                    db.session.commit()
                return success()
            else:
                raise NotFoundError(status_code=404,error_message="User not found")