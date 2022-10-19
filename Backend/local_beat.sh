#! /usr/bin/bash
echo "==========================#############==============================="
echo "Welcome to the setup. I will setup the local virtual env."
echo "And then I will start the celery scheduler i.e. beat."
echo "You can re-run me without any issues."
echo "-------------------------################---------------------------"
if [ -d "venv" ];
then
    echo "Enabling virtual environment and starting the celery beat."
else
    echo "No Virtual env. Please run setup.sh first"
    exit N
fi


source venv/bin/activate
export ENV=development
#max-interval 1 means it checks every 1 second
celery -A app.celery beat --max-interval 1 -l info

deactivate
