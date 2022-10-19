from application.database import db
from flask_security import UserMixin, RoleMixin
from application.models.trackerModel import Tracker

roles_users = db.Table('roles_users',
    db.Column('user_id',db.Integer(),db.ForeignKey('user.id')),
    db.Column('role_id',db.Integer(),db.ForeignKey('role.id')))


class User(db.Model,UserMixin):  #name User is reserved by flask security
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    username = db.Column(db.String(80), unique=False,nullable=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    active = db.Column(db.Boolean(),default=False)
    active_since = db.Column(db.DateTime)
    fs_uniquifier = db.Column(db.String(255), unique=True, nullable=False)
    #is is used as a key for the user to generate token Chnging this changes token
    roles = db.relationship('Role',secondary='roles_users',backref=db.backref('users',lazy="dynamic"))
    trackers = db.relationship("Tracker",backref="user",cascade='all, delete',lazy=True)
    chatlink = db.relationship("Chat",backref="user",cascade='all, delete',lazy='subquery')

class Role(db.Model,RoleMixin):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(),unique = True, nullable=False)
    description = db.Column(db.String())

class Chat(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    chat_link = db.Column(db.String())
    last_alert_status = db.Column(db.Boolean(),default=False)
    user_id=db.Column(db.Integer, db.ForeignKey('user.id'))
