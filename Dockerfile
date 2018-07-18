FROM node:8

WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn
COPY . ./
RUN yarn add react
ADD package.json yarn.lock /tmp/
CMD [ "yarn", "dev" ]