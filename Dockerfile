FROM phusion/baseimage:0.9.17
MAINTAINER Kevin Mook <kevin@kevinmook.com>

RUN useradd --uid 1000 app

RUN apt-get update \
    && apt-get install -y \
      build-essential \
      wget

RUN curl --silent --location https://deb.nodesource.com/setup_4.x | sudo bash -
RUN apt-get install -y nodejs

COPY /code/* /home/app/app/
# COPY /container_scripts/init.d/* /etc/my_init.d/
COPY /container_scripts/services/app/run /etc/service/app/run

RUN chown -R app:app /home/app

# Forward apporpriate ports
EXPOSE 3000/tcp 3000/udp

CMD ["/sbin/my_init"]
