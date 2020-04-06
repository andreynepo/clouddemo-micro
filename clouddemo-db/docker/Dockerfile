FROM python:3.7-slim

ENV PYTHONUNBUFFERED=1
ENV LD_LIBRARY_PATH=/opt/oracle/instantclient_19_5/
ENV TNS_ADMIN=/opt/oracle/instantclient_19_5/network/admin/
ENV TZ=Europe/Moscow
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN apt-get update && apt-get install -y unzip curl libaio1 && mkdir /home/opc && mkdir /home/opc/app && cd /home/opc \
        && curl https://download.oracle.com/otn_software/linux/instantclient/195000/instantclient-basiclite-linux.x64-19.5.0.0.0dbru.zip  -o instantclient-basiclite-linux.x64-19.5.0.0.0dbru.zip \
        && unzip instantclient-basiclite-linux.x64-19.5.0.0.0dbru.zip -d /opt/oracle/ \
        && rm instantclient-basiclite-linux.x64-19.5.0.0.0dbru.zip \
	&& sh -c "echo /opt/oracle/instantclient_19_5/ > /etc/ld.so.conf.d/oracle-instantclient.conf" && ldconfig

RUN python3 -m pip install --no-cache-dir cx_Oracle flask flask_cors requests

RUN apt-get remove -y unzip curl && apt-get autoremove -y && apt-get clean -y

#COPY ./context/.wallet/ /opt/oracle/instantclient_19_5/network/admin/
COPY ./context/app/ /home/opc/app/

EXPOSE 8080

WORKDIR "/home/opc/app/"
CMD ["python3", "/home/opc/app/db.py"]
