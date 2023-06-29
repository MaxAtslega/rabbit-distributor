FROM node:alpine
ENV NODE_ENV=production

WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]

RUN yarn install

COPY . .
RUN mv ./config/endpoints.example.json ./config/endpoints.json

CMD ["yarn", "start"]