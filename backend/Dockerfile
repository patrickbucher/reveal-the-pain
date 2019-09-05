FROM node:8.16.1-alpine
LABEL maintainer="Patrick Bucher <patrick.bucher@stud.hslu.ch>"
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production
COPY src/* ./
EXPOSE 8000
CMD ["node", "server.js"]
