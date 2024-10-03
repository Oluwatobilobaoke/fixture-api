# Readme

An API that serves the latest scores of fixtures of matches in a “**Mock Premier League**”

https://documenter.getpostman.com/view/8996154/2sAXqzWJSF

## Tools/Stack

- NodeJs (TypeScript & Express)
- MongoDB
- Redis
- Docker
- POSTMAN

## Prerequisites

- Node.js (v20 or later)
- MongoDB
- Redis
- Docker (optional)

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/Oluwatobilobaoke/fixture-api.git
   cd fixture-api
   ```

2. Install dependencies:

   ```
   npm install
   ```

   or if you prefer yarn:

   ```
   yarn install
   ```

3. Set up environment variables:
   ```
   cp .env.example .env
   ```
   Edit the `.env` file and add your MongoDB connection URL and other necessary configurations.

## Running the Application

To start the development server:

1. Start the Docker containers:

   ```
   docker-compose up
   ```

2. Start the Node.js application:
   ```
   npm run start:app
   ```

## Testing

To run the tests:

1. Run e2e tests:

```
npm run test:e2e
```

2. Run unit tests:

```
npm run test:unit
```
