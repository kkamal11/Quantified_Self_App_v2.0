import os,csv
from jinja2 import Template
from weasyprint import HTML
from application.database import db
from Tasks.workers import celery
from application.models.userModel import User

def format_report(template_file,trackers_or_logs=None,user=None):
    #takes trackers/logs as list and username as string
    with open(template_file,'r') as f:
        template = Template(f.read())
        return template.render(trackers_or_logs=trackers_or_logs,username=user.username)
        
@celery.task
def create_pdf_report(id,item):
    user = db.session.query(User).filter_by(id = id).first()
    if user:
        email = user.email
        if item == 'mixed':
            trackers = user.trackers
            template_file_path = "./templates/mixed_report.html"
            trackers_or_logs = []
            for tracker in trackers:
                trackers_or_logs.append([tracker,tracker.logs])
        if item == 'tracker':
            trackers_or_logs = user.trackers
            template_file_path = "./templates/tracker_repot.html"
        if item == 'log':
            trackers = user.trackers
            template_file_path = "./templates/log_report.html"
            trackers_or_logs = []
            for tracker in trackers:
                trackers_or_logs.append([tracker.name,tracker.logs])
            
        msg = format_report(template_file_path,trackers_or_logs=trackers_or_logs,user=user)
        html = HTML(string=msg)
        at_index = email.index('@')
        #below is the path where files are being saved.
        file_name = "./Report_Files/PDF/{}/".format(item) + str(user.email[:at_index]) + item +".pdf"
        if os.path.exists(file_name):
            os.remove(file_name)
        html.write_pdf(target=file_name)

        return file_name

@celery.task
def tracker_csv_report(id):
    user = db.session.query(User).filter_by(id = id).first()
    if user:
        trackers = user.trackers
        ind = user.email.index("@")
        file_path ="./Report_Files/CSV/tracker/" + str(user.email[:ind]) + "tracker" + ".csv"
        if os.path.exists(file_path):
            os.remove(file_path)
        try:
            #givign char encoding to deal with non-ASCII characters
            with open(file_path,"w",encoding='UTF8',newline='') as f:
                writer = csv.writer(f)
                header = ["S. No.","Tracker Name", "Description", "Created On", "Type","Setting" ,"Last Tracked Time","Last Logged Value"]
                writer.writerow(header)
                sno = 0
                for tracker in trackers:
                    sno += 1
                    t_name = tracker.name
                    desc = tracker.description
                    created_time = tracker.time
                    type = tracker.type
                    setting = tracker.setting
                    if setting == "":
                        setting = "Setting is not applicable to this tracker"
                    last_tracked_time = tracker.last_tracked_time
                    last_logged_value = tracker.last_logged_value
                    data = [sno, t_name, desc, created_time, type, setting, last_tracked_time,last_logged_value]
                    writer.writerow(data)
        except:
            raise Exception("Error")
        
        return file_path


@celery.task
def log_csv_report(id):
    user = db.session.query(User).filter_by(id = id).first()
    if user:
        trackers = user.trackers
        ind = user.email.index("@")
        file_path = "./Report_Files/CSV/log/" + str(user.email[:ind]) + "log" + ".csv"
        if os.path.exists(file_path):
            os.remove(file_path)
        logs = []
        for tracker in trackers:
            logs.append([tracker.name,tracker.logs])
        try:
            with open(file_path,"w",encoding='UTF8',newline='') as f:
                writer = csv.writer(f)
                for row in logs:
                    tracker_name = row[0].upper()
                    writer.writerow(["Tracker Name-",tracker_name])
                    if row[1] == []:
                        data = "No value has been logged in yet for this tracker."
                        writer.writerow([data])
                    else:
                        header = ["S. No", "Logged Time", "Value", "Note"]
                        writer.writerow(header)
                        sno = 0
                        for log in row[1]:
                            sno += 1
                            log_time = log.time
                            value = log.value
                            note = log.note
                            data = [sno, log_time, value, note]
                            writer.writerow(data)
                    writer.writerow([""])
        except:
            raise Exception("Error")
        
        return file_path

