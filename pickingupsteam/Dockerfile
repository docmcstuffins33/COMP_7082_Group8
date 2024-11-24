FROM node:alpine
WORKDIR /react-app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build