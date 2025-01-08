# Use an official Node.js image as a base
FROM node:18-alpine AS build

# Set working directory in the container
WORKDIR /app

# Copy package.json and yarn.lock to the container
COPY package.json yarn.lock ./

# Install dependencies (yarn install)
RUN yarn install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the Next.js app (production build)
RUN yarn build

# Use a minimal image to run the app
FROM node:18-alpine AS runtime

WORKDIR /app

# Copy only the necessary files from the build image
COPY --from=build /app ./
RUN yarn postbuild
# Expose the port that Next.js will run on
EXPOSE 3000

# Start the Next.js app in production mode
CMD ["yarn", "start"]
