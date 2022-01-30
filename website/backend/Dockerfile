# dockerfile created based on this tutorial: https://www.youtube.com/watch?v=W5Ov0H7E_o4&ab_channel=VeryAcademy

FROM python:3.8-slim-buster
WORKDIR /backend
COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt
RUN apt-get -y update
RUN apt-get -y upgrade
RUN apt-get install -y ffmpeg

COPY . .

CMD [ "python3", "manage.py", "runserver", "0.0.0.0:8000" ]
