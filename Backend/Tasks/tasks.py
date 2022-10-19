from Tasks.workers import celery
from datetime import datetime as dt, timedelta
from celery.schedules import crontab
from flask_login import current_user
from flask import send_file
from sqlalchemy import desc
from utils.security import user_datastore
from Mails.main import send_email
from jinja2 import Template
from json import dumps
from httplib2 import Http

from application.models.userModel import User
from application.models.userModel import Chat
from application.database import db
from PDFReport.report import create_pdf_report
from utils.validation import NotFoundError
from application.database import db
from application.models.userModel import User
from application.models.logsModel import Logs

#sending this after user signs up on the website
@celery.task
def send_welcome_mail(receiver_email, subject, username):
    with open('./Mails/mail_templates/welcome.html','r') as f:
        template = Template(f.read())
    send_email(receiver_email,subject,message=template.render(user=username))
    return "Mail sent"

#Sending this as an alert when user downloads any file.
@celery.task
def send_download_alert(receiver_email,item,file_type):
    user = user_datastore.find_user(email = receiver_email)
    subject="Download Alert"
    f = open('./Mails/mail_templates/download_alert.html','r')
    template = Template(f.read())
    ind = receiver_email.index("@")
    file_format = {
        'PDF':'.pdf',
        'CSV':'.csv'
    }
    file_to_send_path = f"./Report_Files/{file_type}/{item}/" + str(receiver_email[:ind]) + item + file_format[file_type]
    if file_to_send_path:
        send_email(receiver_email,subject=subject,message=template.render(username=user.username), attachment_files=[file_to_send_path],file_type=file_type)
    else:
        raise Exception('file not found')
    return 'alert done'

# sending this on first of every month
@celery.task
def send_MonthlyReport():
    users = db.session.query(User).all()
    f = open('./Mails/mail_templates/report.html','r')
    template = Template(f.read())
    if users:
        for user in users:
            username = user.username
            file_path = create_pdf_report(id=user.id,item="mixed")
            if file_path:
                send_email(user.email,subject="Monthly Report",message=template.render(username=username), attachment_files=[file_path])
        f.close()
        return "done"
    else:
        raise NotFoundError(status_code=404,error_message="User not found")

@celery.task
def daily_webhook_reminder():
    users = db.session.query(User).all()
    if len(users) > 0:
        for user in users:
            logged_data = False
            trackers = user.trackers
            for tracker in trackers:
                recent_log = db.session.query(Logs).filter_by(tracker_id = tracker.id).order_by(desc(Logs.time)).first()
                if recent_log:
                    yesterday = dt.now() - timedelta(1)
                    tomorrow = dt.now() + timedelta(1)
                    if recent_log.time < tomorrow and recent_log.time > yesterday:
                        logged_data = True
                        break
            if not logged_data:
                try:
                    chat = user.chatlink   #chat is a list having one element
                    if len(chat) != 0:
                        url = chat[0].chat_link
                        bot_message = {
                            'text': "Hello {}, You have not logged in data for any tracker today.".format(user.username)
                        }
                        message_headers = {'Content-Type': 'application/json; charset=UTF-8'}
                        http_obj = Http()
                        response = http_obj.request(
                            uri=url,
                            method='POST',
                            headers=message_headers,
                            body=dumps(bot_message),
                        )
                        chat_to_update = db.session.query(Chat).filter_by(id = chat[0].id).first()
                        chat_to_update.last_alert_status = True
                        db.session.commit()
                except:
                    if len(chat) != 0:
                        chat_to_update = db.session.query(Chat).filter_by(id = chat[0].id).first()
                        if chat_to_update:
                            chat_to_update.last_alert_status = False 
                            db.session.commit()
    else:
        return "No user present"


@celery.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    # sender.add_periodic_task(60.0, send_MonthlyReport.s(), name='after every 120')
    # sender.add_periodic_task(60.0, daily_webhook_reminder.s(), name='after every 60')


    #Executes daily at 6 and 7 PM
    sender.add_periodic_task(
        crontab(
            hour='18,19',
            minute=0,
        ),
        daily_webhook_reminder.s(), name='daily at 6 and 7 PM'
    )

    # Executes 1st of every month at 7:30 AM.
    sender.add_periodic_task(
        crontab(
            hour=7,
            minute=30,
            day_of_month=1
        ),
        send_MonthlyReport.s(), name='1st of every month at 7:30 AM'
    )



