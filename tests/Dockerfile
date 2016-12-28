FROM ubuntu:14.04
RUN apt-get update -y && apt-get install -y wget curl git build-essential fontconfig nodejs npm nodejs-legacy
RUN wget -O get-pip.py https://bootstrap.pypa.io/get-pip.py && python get-pip.py && rm get-pip.py
