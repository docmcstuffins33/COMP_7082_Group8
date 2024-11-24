FROM node:latest

COPY package.json package-lock.json ./

RUN npm install
COPY . .
EXPOSE 8080
CMD ["npm", "start", "dev"]