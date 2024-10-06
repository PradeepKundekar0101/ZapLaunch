
FROM node:20-alpine


RUN apk add --no-cache git bash


WORKDIR /home/app


COPY package*.json ./
RUN npm install


COPY main.sh .
COPY script.js .


RUN chmod +x main.sh script.js


ENTRYPOINT ["/bin/bash", "/home/app/main.sh"]