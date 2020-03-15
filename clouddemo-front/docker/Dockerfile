FROM debian:buster-slim

ENV TZ=Europe/Moscow
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN apt-get update -y && apt-get install -y nginx-light libnginx-mod-http-subs-filter

COPY ./context/default /etc/nginx/sites-enabled/
COPY ./context/app /var/www/demo/

RUN chown -R www-data:www-data /var/www/demo/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
