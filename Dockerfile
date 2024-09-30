# Build stage
FROM node:18 AS builder

WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package.json yarn.lock ./

# Install dependencies, including devDependencies
RUN yarn install --frozen-lockfile --production

# Copy the rest of the application code
COPY . .

# Rebuild bcrypt
RUN npm rebuild bcrypt --build-from-source

# Production stage
FROM node:18-slim

WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json yarn.lock ./

# Install production dependencies only
RUN npm ci --only=production --omit=dev

# Copy built modules and other files from builder stage
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY . .

# # Your app's start command
# CMD ["node", "app.js"]