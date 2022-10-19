import os
from flask import Flask
from flask_restful import Api
from flask_cors import CORS
from application.config import LocalDevelopmentConfig
from utils.security import user_datastore,sec
from utils.response import success
from application.database import db
import logging
from Tasks import workers
from Cache.cache import cache

app,api, celery = None,None, None
logging.basicConfig(filename='Log/record.log', level=logging.DEBUG,
                    format=f'%(asctime)s %(levelname)s %(name)s %(threadName)s : %(message)s')

def create_app():
    app = Flask(__name__, template_folder='templates')
    if os.getenv('ENV', "development") == "production":
        raise Exception("Currently no production config is setup.")
    else:
        print("++///---------Staring Local Development----------///++".upper())
        logging.info('``````STARTED`````````````````')
        app.config.from_object(LocalDevelopmentConfig)
    CORS(app)
    db.init_app(app)
    api = Api(app)
    sec.init_app(app, user_datastore)
    cache.init_app(app)
    app.app_context().push()

    #create celery
    celery = workers.celery
    celery.conf.update(
        broker_url = app.config["CELERY_BROKER_URL"],
        result_backend = app.config["CELERY_RESULT_BACKEND"],
        timezone = 'Asia/Kolkata'
    )
    #using our context type instead of the builtin one
    celery.Task = workers.ContextTask
    
    return app,api,celery

app, api, celery = create_app()


@app.route("/")
# @auth_required('session','token')
def test():
    return success()

@app.route("/clear")
def clear_cache():
    cache.clear()
    return "<h2>Cache cleared completely</h2>"


from Resources.user import UserAPI
api.add_resource(UserAPI,"/user", "/user/<reset>")

from Resources.trackers import TrackerApi
api.add_resource(TrackerApi,"/tracker", "/tracker/<int:id>")

from Resources.logs import LogAPI
api.add_resource(LogAPI, "/logs", "/log/<int:tracker_id>", "/logDelete/<int:log_id>")

from Resources.rep_res import (
    generateTrackerReportPDF,
    generateLogReportPDF,
    generateTrackerReportCSV,
    generateConsolidatedReport)
api.add_resource(generateTrackerReportPDF,"/tracker/report")
api.add_resource(generateLogReportPDF,"/log/report")
api.add_resource(generateTrackerReportCSV, "/tracker/report/csv")
api.add_resource(generateConsolidatedReport,"/mixed/report")
from Resources.rep_res import generateLogReportCSV
api.add_resource(generateLogReportCSV,"/log/csv")

from Resources.reminder import ReminderAPI
api.add_resource(ReminderAPI,"/reminder/link")

if __name__ == "__main__":
    app.run(debug=True,port=8080)