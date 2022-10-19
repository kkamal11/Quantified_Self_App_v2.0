from flask_restful import Resource, fields, marshal_with,reqparse
from flask_security import auth_required
from application.database import db
from application.models.userModel import User
from flask import send_file
from flask_login import current_user
from utils.security import user_datastore
from PDFReport.report import create_pdf_report,tracker_csv_report, log_csv_report
from Tasks.tasks import send_download_alert
from utils.validation import NotFoundError, BussinessValidationError

class generateConsolidatedReport(Resource):
    @auth_required('token')
    def get(self):
        user = user_datastore.find_user(email = current_user.email)
        if user:
            email = user.email
            ind = email.index('@')
            #wait here till pdf is generated and send an alert that file is ready. download
            pdf_id = create_pdf_report.delay(id=user.id,item="mixed")# file_path = "./Report_Files/PDF/mixed/" + str(user.email[:ind]) + "mixed" + ".pdf"
            try:
                file_path =  pdf_id.get()
                if file_path:
                    id = send_download_alert.delay(receiver_email=email,item='mixed',file_type='PDF')
                    return send_file(file_path)
            except:
                raise NotFoundError(status_code=404,error_message="File not found.")
        else:
            raise NotFoundError(status_code=404,error_message="User not found.")

class generateTrackerReportPDF(Resource):
    @auth_required('token')
    def get(self):
        user = user_datastore.find_user(email = current_user.email)
        if user:
            ind = user.email.index("@")
            pdf_id = create_pdf_report.delay(id=user.id,item="tracker")
            try:
                file_path =  pdf_id.get()
                if file_path:
                    id = send_download_alert.delay(receiver_email=user.email,item='Tracker',file_type='PDF')
                    return send_file(file_path)
            except FileNotFoundError:
                raise NotFoundError(status_code=404,error_message="File not found.")
        else:
            raise NotFoundError(status_code=404,error_message="User not found.")

class generateLogReportPDF(Resource):
    @auth_required('token')
    def get(self):
        user = user_datastore.find_user(email = current_user.email)
        if user:
            ind = user.email.index("@")
            pdf_id = create_pdf_report.delay(id = user.id,item="log")
            try:
                file_path = pdf_id.get()
                if file_path:
                    id = send_download_alert.delay(receiver_email=user.email,item='log',file_type='PDF')
                    return send_file(file_path)
            except FileNotFoundError:
                raise NotFoundError(status_code=404,error_message="File not found.")
        else:
            raise NotFoundError(status_code=404,error_message="User not found.")


class generateTrackerReportCSV(Resource):
    @auth_required('token')
    def get(self):
        user = user_datastore.find_user(email = current_user.email)
        if user:
            csv_id = tracker_csv_report.delay(id = user.id)
            try:
                file_path = csv_id.get()
                if file_path:
                    id = send_download_alert.delay(receiver_email=user.email,item='Tracker',file_type='CSV')
                    return send_file(file_path)
            except:
                raise BussinessValidationError(status_code=404,error_message="Some Error.")
        else:
            raise NotFoundError(status_code=404,error_message="User not found.")

class generateLogReportCSV(Resource):
    @auth_required('token')
    def get(self):
        user = user_datastore.find_user(email = current_user.email)
        if user:
            csv_id = log_csv_report.delay(id = user.id)
            try:
                file_path = csv_id.get()
                if file_path:
                    id = send_download_alert.delay(receiver_email=user.email,item='log',file_type='CSV')
                    return send_file(file_path)
            except:
                raise BussinessValidationError(status_code=404,error_message="Some Error.")
        else:
            raise NotFoundError(status_code=404,error_message="User not found.")

