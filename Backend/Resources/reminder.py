from flask_restful import Resource, marshal_with, fields,reqparse
from flask_login import current_user
from flask_security import auth_required
from utils.security import user_datastore
from application.models.userModel import Chat
from application.database import db
from utils.validation import NotFoundError,BussinessValidationError
from utils.response import success
from Cache.cache import cache
from utils.cache_func import get_user,chatlink
from datetime import datetime as dt

chat_post_args = reqparse.RequestParser()
chat_post_args.add_argument('chat_link',required=True,help='Provide chat link')

chat_out_args = {
    "chat_link":fields.String,
    "last_alert_status":fields.Boolean
}

class ReminderAPI(Resource):
    @auth_required('token')
    @marshal_with(chat_out_args)
    def get(self):
        user = user_datastore.find_user(email = current_user.email)
        if user:
            #clearing the cache at specified time to get updated value
            current_time = dt.now()
            if current_time.hour > 18 and current_time.hour < 20:
                cache.delete_memoized(chatlink,user)
            return chatlink(user)
        else:
            raise NotFoundError(status_code=404,error_message="User not found")
    
    @auth_required('token')
    def post(self):
        user = user_datastore.find_user(email = current_user.email)
        if user:
            args = chat_post_args.parse_args()
            chat_link = args.get('chat_link',None)
            if chat_link:
                if chat_link.find('chat.googleapis') == -1:
                    raise BussinessValidationError(status_code=502,error_message="Invalid Link")
                chat = db.session.query(Chat).filter_by(user_id = user.id).first()
                if chat:
                    db.session.delete(chat)
                    db.session.commit()
                new_chat = Chat(
                    chat_link = chat_link
                )
                user.chatlink.append(new_chat)
                db.session.commit()
                return success()
        else:
            raise NotFoundError(status_code=404,error_message="User not found")
    
    @auth_required('token')
    def delete(self):
        user = user_datastore.find_user(email = current_user.email)
        if user:
            chat_link_to_delete = user.chatlink
            if chat_link_to_delete:
                cache.delete_memoized(chatlink,user)
                db.session.delete(chat_link_to_delete[-1])
                db.session.commit()
                return success()
        else:
            raise NotFoundError(status_code=404,error_message="User not found")