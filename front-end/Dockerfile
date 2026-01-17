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

# Build the Next.js app (prebuild will copy Nextra CSS automatically)
RUN yarn build

# Use a minimal image to run the app
FROM node:18-alpine AS runtime

WORKDIR /app

# Copy the standalone output
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public

# Expose the port that Next.js will run on
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the Next.js standalone server
CMD ["node", "server.js"]
