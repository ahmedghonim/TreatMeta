FROM node:lts-alpine

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

# Ensure entrypoint script is executable
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Specify the command to run the app
CMD ["yarn", "start"]

EXPOSE 3000
