# Build stage
FROM node:20 AS builder

WORKDIR /usr/src/app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install ALL dependencies (including devDependencies)
RUN yarn install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Compile TypeScript to JavaScript
RUN yarn tsc

# Production stage
FROM node:20-slim

WORKDIR /usr/src/app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install only production dependencies
RUN yarn install --frozen-lockfile --production

# Copy compiled JavaScript from builder stage
COPY --from=builder /usr/src/app/dist ./dist


# Your app's start command (adjust as needed)
# CMD ["node", "dist/app.js"]