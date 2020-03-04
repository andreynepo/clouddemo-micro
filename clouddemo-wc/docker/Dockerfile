FROM python:3.7-slim

RUN mkdir /home/opc && mkdir /home/opc/app

RUN python3 -m pip install --no-cache-dir flask wordcloud

COPY ./context/app/ /home/opc/app/

ENV PYTHONUNBUFFERED=1
EXPOSE 8080

WORKDIR "/home/opc/app/"
CMD ["python3", "/home/opc/app/wc.py"]
