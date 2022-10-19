#! /usr/bin/bash

echo "==========================#############==============================="
echo "Hello and Welcome." 
echo "I am initiating the development server."
echo "You can re-run me without any issues."
echo "-----------===-------------################-------------===-------------"
if [ -d "venv" ];
then
    echo "Enabling virtual env"
else
    echo "No Virtual env. Please run setup.sh first"
    exit N
fi

# Activate virtual env
source venv/bin/activate

export ENV=development
# source ./application/env_var.sh
python3 app.py
deactivate