FROM node:latest
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build