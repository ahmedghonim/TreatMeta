FROM node:lts-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and yarn.lock for dependency installation
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of your application code
COPY . .

# Build the Next.js application
RUN yarn build

# Start the Next.js server
CMD ["yarn", "start"]

# Expose the port the app runs on
EXPOSE 3000
