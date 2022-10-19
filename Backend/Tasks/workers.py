from celery import Celery
from flask import current_app as app

celery = Celery("Application jobs")

#it extends built in celery task
class ContextTask(celery.Task):
    def __call__(self, *args, **kwargs):
        with app.app_context():  #if we don't run with app context thenn we won't be able to do database operation
            return self.run(*args, **kwargs)