FROM node:18-alpine

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install 

COPY . .

RUN yarn build

# Specify the command to run the app
CMD ["yarn", "start"]

EXPOSE 3000
