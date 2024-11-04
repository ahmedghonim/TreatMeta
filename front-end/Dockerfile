FROM node:lts-alpine

WORKDIR /app

COPY package.json .

RUN yarn

COPY . .

RUN yarn build

CMD ["yarn", "start"]

EXPOSE 3000