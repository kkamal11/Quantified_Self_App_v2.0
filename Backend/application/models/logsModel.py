from application.database import db

class Logs(db.Model):
    id=db.Column(db.Integer,primary_key=True,autoincrement=True)
    time=db.Column(db.DateTime, nullable=False)
    value = db.Column(db.String(255))
    note=db.Column(db.String())
    tracker_id=db.Column(db.Integer, db.ForeignKey('tracker.id'))
