# from node 16
FROM node:20-alpine AS BUILD_IMAGE

# Work Directory
WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install --legacy-peer

COPY . .

# build application
RUN yarn build

# remove development dependencies
#RUN npm prune --production

# ------------------------ SECOND IMAGE ------------------------

FROM node:20-alpine

# Work Directory
WORKDIR /usr/src/app

COPY --from=BUILD_IMAGE /usr/src/app .

EXPOSE 13019

CMD [ "yarn", "start" ]