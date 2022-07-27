FROM node:lts-alpine
LABEL MAINTAINER likun7981
RUN npm i -g hlink
EXPOSE 9090
ENV DOCKER true
ENTRYPOINT hlink start
