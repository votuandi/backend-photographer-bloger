FROM node:20-alpine AS builder

WORKDIR /user/src/app

COPY . .

RUN npm install && npm run build

RUN chmod -R 777 /user/src/app/public/*

USER node

CMD ["npm", "run", "start:prod"]
