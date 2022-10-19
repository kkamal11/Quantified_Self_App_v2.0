from werkzeug.exceptions import HTTPException
from flask import make_response
from flask import json

class NotFoundError(HTTPException):
    def __init__(self,status_code,error_message):
        msg = {"error_message":error_message}
        self.response = make_response(json.dumps(msg),status_code)
    
class BussinessValidationError(HTTPException):
    def __init__(self,status_code, error_message):
        msg = {"error_message":error_message}
        self.response = make_response(json.dumps(msg),status_code)