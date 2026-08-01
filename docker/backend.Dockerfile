FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN addgroup -S backend && adduser -S backend -G backend

USER backend

EXPOSE 8001

CMD ["node", "src/backend/server.js"]