FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN addgroup -S gateway && adduser -S gateway -G gateway

USER gateway

EXPOSE 8080

CMD ["node", "src/server/server.js"]