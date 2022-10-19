#! /usr/bin/bash
echo "==========================#############==============================="
echo "Welcome to to the setup. I will start the worker."
echo "You can re-run me without any issues."
echo "-------------------------################---------------------------"
if [ -d "venv" ];
then
    echo "Enabling virtual environment and starting the worker."
else
    echo "No Virtual env. Please run setup.sh first"
    exit N
fi

# Activate virtual env
source venv/bin/activate
export ENV=development
#start the worker
celery -A app.celery worker -l info

deactivate
