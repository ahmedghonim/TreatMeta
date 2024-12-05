# Step 1: Use Bun as the base image
FROM oven/bun:latest AS builder

# Set the working directory to /app
WORKDIR /app

# Copy package.json and bun.lockb (if it exists) for efficient caching of dependencies
COPY bun.lockb ./

# Install dependencies using Bun
RUN bun install

# Copy the rest of the Next.js app source code
COPY . .

# Build the Next.js app
RUN bun build

# Step 2: Set up the production environment
FROM oven/bun:latest

# Set the working directory to /app
WORKDIR /app

# Copy the built Next.js app and dependencies from the builder stage
COPY --from=builder /app ./

# Expose port 3000 for Next.js
EXPOSE 3000

# Run Next.js using Bun in production mode
CMD ["bun", "start"]
