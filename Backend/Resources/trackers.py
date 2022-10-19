from flask_restful import Resource, fields, marshal_with,reqparse
from flask_security import auth_required
from application.database import db
from flask_login import current_user
from utils.security import user_datastore
from utils.response import success
from application.models.trackerModel import Tracker
from application.models.logsModel import Logs
from datetime import datetime as dt
from sqlalchemy import and_, desc
from utils.validation import NotFoundError, BussinessValidationError
from utils.cache_func import get_trackers

tracker_post_args = reqparse.RequestParser()
tracker_post_args.add_argument("name",required=True, help="trackername required")
tracker_post_args.add_argument("type",required=True, help="username required")
tracker_post_args.add_argument("description")
tracker_post_args.add_argument("setting")

tracker_put_args = reqparse.RequestParser()
tracker_put_args.add_argument("name", help="trackername required")
tracker_put_args.add_argument("description")

tracker_output_fileds = {
    "id":fields.Integer,
    "name":fields.String,
    "type":fields.String,
    "description":fields.String,
    "time":fields.DateTime,
    "last_tracked_time":fields.DateTime,
    "last_logged_value":fields.String,
    "setting":fields.String
}

class TrackerApi(Resource):
    @auth_required("token")
    @marshal_with(tracker_output_fileds) #cache this
    def get(self,id=None):
        user = user_datastore.find_user(email = current_user.email)
        if user:
            if id is None:
                return get_trackers(user)
            else:
                tracker = db.session.query(Tracker).filter_by(id = id).first()
                return tracker
        else:
            raise NotFoundError(status_code=404,error_message="User not found.")

    @auth_required("token")
    def post(self):
        user = user_datastore.find_user(email = current_user.email)
        args = tracker_post_args.parse_args()
        if user:
            name = args.get("name")
            trackers = user.trackers
            found = False
            for tracker in trackers:
                if tracker.name == name:
                    found = True
                    break
            if not found:
                try:
                    tracker = Tracker(
                    name = args.get("name"),
                    type = args.get("type"),
                    description = args.get("description", None),
                    time = dt.now(),
                    last_tracked_time = dt.now(),
                    setting = args.get('setting',None)
                    )
                    user.trackers.append(tracker)
                    db.session.commit()
                    return success()
                except:
                    raise BussinessValidationError(status_code=500, error_message="An error ocurred.")
            else:
                raise BussinessValidationError(status_code=409, error_message="Tracker with this name already exists.")
        else:
            raise NotFoundError(status_code=404,error_message="User not found.")
    
    @auth_required("token")
    def put(self,id=None):
        user = user_datastore.find_user(email = current_user.email)
        if user:
            if id is not None:
                tracker_to_update = db.session.query(Tracker).filter(and_(Tracker.user_id==user.id, Tracker.id==id)).first() #On
                args = tracker_put_args.parse_args()
                new_name = args.get("name",None)
                new_description = args.get("description",None)
                if new_name is not None:
                    tracker_to_update.name = new_name
                if new_description is not None:
                    tracker_to_update.description = new_description
                tracker_to_update.last_tracked_time = dt.now()
                db.session.commit()
                return success()
            else:
                raise BussinessValidationError(status_code=500, error_message="Tracker id cannot be None")
        else:
            raise NotFoundError(status_code=404,error_message="User not found.")


    @auth_required("token")
    def delete(self,id=None):
        user = user_datastore.find_user(email = current_user.email)
        if user:
            if id is None:
                try:
                    trackers = user.trackers
                    for tracker in trackers:
                        db.session.delete(tracker)
                        db.session.commit()
                    return success()
                except:
                    raise BussinessValidationError(status_code=500, error_message="An error occurred. Try again!")
            else:
                try:
                    racker_to_delete = db.session.query(Tracker).filter(and_(Tracker.user_id==user.id, Tracker.id==id)).first()
                    db.session.delete(racker_to_delete)
                    db.session.commit()
                    return success()
                except:
                    raise BussinessValidationError(status_code=500, error_message="An error occurred. Try again!")
        else:
            raise NotFoundError(status_code=404,error_message="User not found.")



