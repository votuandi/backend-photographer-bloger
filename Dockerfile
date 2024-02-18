FROM node:20-alpine AS builder

WORKDIR /user/src/app

COPY . .

RUN npm install && npm run build

USER node

CMD ["npm", "run", "start:prod"]
