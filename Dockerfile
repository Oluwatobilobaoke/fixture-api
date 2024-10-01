# Build stage
FROM node:18 AS builder

RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package.json yarn.lock ./

# Install dependencies, including devDependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the application (assuming you have a build script)
RUN npm run build

# Production stage
FROM node:18-slim

WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json yarn.lock ./

# Install production dependencies only
RUN yarn install --frozen-lockfile --production

# Copy built files from builder stage
COPY --from=builder /usr/src/app/dist ./dist

# Rebuild bcrypt
RUN npm rebuild bcrypt --build-from-source

# Your app's start command
# CMD ["node", "dist/app.js"]