FROM node:22-alpine AS base

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

RUN npm ci

COPY tsconfig.json ./
COPY src ./src

RUN npx prisma generate
RUN npm run build

EXPOSE 3334

CMD ["npm", "start"]
