from application.database import db
from application.models.logsModel import Logs

class Tracker(db.Model):
    id=db.Column(db.Integer,primary_key=True,autoincrement=True)
    name=db.Column(db.String(100), nullable=False)
    type=db.Column(db.String(100), nullable=False)
    description = db.Column(db.String())
    time = db.Column(db.DateTime) #time of creation
    last_tracked_time = db.Column(db.DateTime)
    last_logged_value = db.Column(db.String(255),default="Not logged yet.")
    setting = db.Column(db.String())
    user_id=db.Column(db.Integer, db.ForeignKey('user.id'))
    logs = db.relationship("Logs",backref="tracker",cascade='all, delete',lazy=True)
