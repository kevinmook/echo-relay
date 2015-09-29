FROM phusion/baseimage:0.9.17
MAINTAINER Kevin Mook <kevin@kevinmook.com>

RUN useradd --uid 1000 app

RUN apt-get update \
    && apt-get install -y \
      build-essential \
      wget

RUN curl --silent --location https://deb.nodesource.com/setup_4.x | sudo bash -
RUN apt-get install -y nodejs

COPY /code/* /home/app/app

# Forward apporpriate ports
EXPOSE 3000/tcp 3000/udp

CMD ["/sbin/my_init"]
