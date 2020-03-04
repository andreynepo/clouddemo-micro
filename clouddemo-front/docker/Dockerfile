FROM debian:buster-slim

RUN apt-get update -y && apt-get install -y apache2

COPY ./context/000-default.conf /etc/apache2/sites-enabled/
COPY ./context/app /var/www/demo/

ARG BACKEND=docker.clouddemo.ru
RUN echo Backend: ${BACKEND}

RUN sed -i -e 's/^Listen.*/Listen 80/' /etc/apache2/ports.conf \
 && sed -i -e "\$aServerName localhost" /etc/apache2/apache2.conf \
 && sed -i -e 's/^\([[:blank:]]*\)Substitute.*$/\1Substitute "s|backend.clouddemo.ru|'${BACKEND}'|ni"/' /etc/apache2/sites-enabled/000-default.conf

RUN chown -R www-data:www-data /var/www/demo/ && a2enmod proxy && a2enmod proxy_http && a2enmod substitute && a2enmod headers

EXPOSE 80

CMD ["apachectl", "-D", "FOREGROUND"]
