# from node 16
FROM node:16 AS BUILD_IMAGE

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

FROM node:16

# Work Directory
WORKDIR /usr/src/app

COPY --from=BUILD_IMAGE /usr/src/app .

EXPOSE 7077

CMD [ "yarn", "start" ]