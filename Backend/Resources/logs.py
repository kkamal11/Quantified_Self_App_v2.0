from numbers import Number
from flask_restful import Resource, fields, marshal_with,reqparse
from flask_security import auth_required
from flask_login import current_user
from application.models.logsModel import Logs
from utils.security import user_datastore
from utils.response import success
from datetime import datetime as dt
from application.database import db
from application.models.trackerModel import Tracker
from utils.validation import NotFoundError, BussinessValidationError


log_post_args = reqparse.RequestParser()
log_post_args.add_argument("value", required=True)
log_post_args.add_argument("note")

log_put_args = reqparse.RequestParser()
log_put_args.add_argument("value", required=True)
log_put_args.add_argument("note")


logs_out_args = {
    "id":fields.Integer,
    "time":fields.DateTime,
    "value":fields.String,
    "note":fields.String
}

class LogAPI(Resource):
    @auth_required('token')
    @marshal_with(logs_out_args)
    def get(self,tracker_id):
        user = user_datastore.find_user(email = current_user.email)
        if user and id is not None:
            try:
                req_tracker = None
                trackers = user.trackers
                for tracker in trackers:
                    if tracker.id == tracker_id:
                        req_tracker = tracker
                        break
                return req_tracker.logs
            except:
                raise NotFoundError(status_code=404,error_message="No tracker found for this user.")
        else:
            raise NotFoundError(status_code=404,error_message="User not found.")

    @auth_required('token')
    def post(self,tracker_id):
        user = user_datastore.find_user(email = current_user.email)
        if user:
            try:
                req_tracker = None
                trackers = user.trackers
                for tracker in trackers:
                    if tracker.id == tracker_id:
                        req_tracker = tracker
                        break
                args = log_post_args.parse_args()
                logged_time = dt.now()
                value = args.get("value",None)
                note = args.get("note",None)
                if req_tracker.type == "Numerical":
                    try:
                        val = float(value)
                        if isinstance(val,Number):
                            value = val
                        else:
                            raise BussinessValidationError(status_code=400,error_message="Value should be Numerical for this.")
                    except ValueError:
                        raise BussinessValidationError(status_code=400,error_message="Value should be Numerical for this.")

                if req_tracker.type == "Boolean":
                    if value == 'Yes' or value == "No":
                        pass
                    else:
                        raise BussinessValidationError(status_code=400,error_message="Value should be boolean for this.")
                if logged_time is not None and value is not None and req_tracker is not None:
                    log_data = Logs(
                        time = logged_time,
                        value = value,
                        note = note
                    )
                    req_tracker.last_tracked_time = logged_time
                    req_tracker.last_logged_value = value
                    req_tracker.logs.append(log_data)
                    db.session.commit()
                    return success()
                else:
                    raise BussinessValidationError(400,error_message="Some error ocurred.")
            except:
                raise BussinessValidationError(status_code=500, error_message="Some error ocurred.")
        else:
            raise NotFoundError(status_code=404,error_message="User not found.")


    @auth_required('token')
    def put(self,log_id):
        user = user_datastore.find_user(email = current_user.email)
        found = False
        if user:
            trackers = user.trackers
            for tracker in trackers:
                for log in tracker.logs:
                    if log.id == log_id:
                        found = True
                        log_to_update = log
                        break
            if found:
                if log_to_update:
                    args = log_put_args.parse_args()
                    new_value = args.get("value",None)
                    new_note = args.get("note",None)
                    if new_value is not None:
                        log_to_update.value = new_value
                        log_to_update.note = new_note
                        db.session.commit()
                        return success()
                else:
                    raise NotFoundError(status_code=404,error_message="No such log found.")
            else:
                raise NotFoundError(status_code=404,error_message="No such tracker found.")
        else:
            raise NotFoundError(status_code=404, error_message="User not found")


    @auth_required('token')
    def delete(self,log_id):
        user = user_datastore.find_user(email = current_user.email)
        found = False
        if user:
            trackers = user.trackers
            for tracker in trackers:
                for log in tracker.logs:
                    if log.id == log_id:
                        found = True
                        log_to_delete = log
                        break
            if found:
                if log_to_delete:
                    db.session.delete(log_to_delete)
                    db.session.commit()
                    return success()
                else:
                    raise NotFoundError(status_code=404, error_message="No such log found")
            else:
                raise NotFoundError(status_code=404, error_message="No such tracker found")
        else:
            raise NotFoundError(status_code=404, error_message="User not found")