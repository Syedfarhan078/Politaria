#!/bin/bash
python3 -m pip install -r requirements.txt
export PYTHONPATH="${PYTHONPATH}:$(python3 -m site --user-site)"
export PATH="${PATH}:$(python3 -m site --user-base)/bin"
python3 manage.py collectstatic --noinput --clear
