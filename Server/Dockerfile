FROM node:latest

WORKDIR /app

COPY . /app

RUN npm install
COPY . .
CMD ["npm", "start", "dev"]