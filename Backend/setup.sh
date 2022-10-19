#! /bin/sh
echo "/////////////////////========================\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"
echo "Welcome to the setup. I will setup the local virtual env." 
echo "And then I will install all the required python libraries and packages."
echo "You can re-run me without any issues."
echo "---------------------===========================-------------------------------"
if [ -d "venv" ];
then
    echo ".venv folder already exists. Activating it..."
else
    echo "creating .venv and installing dependencies using pip"
    python3 -m virtualenv venv
fi

# Activate virtual env
source venv/bin/activate

pip3 install --upgrade pip
pip3 install -r requirements.txt

deactivate
