FROM node:lts-alpine
WORKDIR /app
COPY ./dist/apps/tweet-metrics-consumer .
COPY ./package.json .
RUN npm install --production
# dependencies that nestjs needs
RUN npm install reflect-metadata tslib rxjs @nestjs/platform-express
CMD node ./main.js