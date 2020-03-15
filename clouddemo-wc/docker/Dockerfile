FROM python:3.7-slim

ENV PYTHONUNBUFFERED=1
ENV TZ=Europe/Moscow
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN mkdir /home/opc && mkdir /home/opc/app

RUN python3 -m pip install --no-cache-dir flask wordcloud

COPY ./context/app/ /home/opc/app/

EXPOSE 8080

WORKDIR "/home/opc/app/"
CMD ["python3", "/home/opc/app/wc.py"]
