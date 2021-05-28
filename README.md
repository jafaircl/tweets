

# Tweets

This exposes a PATCH endpoint that allows you to send a request to store tweet metrics. That endpoint sends a message through RabbitMQ which is handled by a microservice that stores the metrics in a Postgres database. RabbitMQ will handle delegating responsibility. The reasons for handling updates this way this are:
 - If many updates come in at once, we a) don't risk crashing the server due to memory errors, b) don't slow down the rest of the API by occupying the main thread, c) can distribute the work over time instead of creating huge spikes of work
 - We can scale the number of consumers (and server costs) with demand.
 - If the consumer dies before handling the update, we can retry it.
 - It will allow us to keep track of messages that were not handled so that we can debug.

GET endpoints are cached with Redis (with a configurable timeout and cache size) to ease the load on the API.

There is also a GraphQL endpoint that exposes a `findMetricsByTweetID` query (backed by the same Redis cache as GET REST operations) and a `subscribeToMetricsByTweetIDs` subscription. The subscription uses Redis for Pub/Sub operations for resiliency.

## Starting up

Add a `.env` file in the root directory with this shape:

```shell
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=admin
POSTGRES_PASSWORD=admin
POSTGRES_DB=nestjs
PGADMIN_DEFAULT_EMAIL=admin@admin.com
PGADMIN_DEFAULT_PASSWORD=admin
RABBITMQ_DEFAULT_USER=admin
RABBITMQ_DEFAULT_PASS=admin
RABBITMQ_USER=admin
RABBITMQ_PASSWORD=admin
RABBITMQ_HOST=localhost:5672
RABBITMQ_QUEUE_NAME=tweet-metrics
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_CACHE_TTL=5
REDIS_CACHE_SIZE=100
REDIS_HOSTS=local:redis:6379
HTTP_USER=admin
HTTP_PASSWORD=admin
```

## Running the apps

First of all, make sure you don't have anything running (postgres, redis, rabbitmq, etc) on ports 5432, 5672, 6379, 8080, 8081, or 15672. Then, from the root, run:
 - `docker compose up` to start the postgres database, pgAdmin, RabbitMQ and redis
 - `npm run start-services-dev` to start the API and microservices in development mode

 - Your Postgres admin panel will be at `http://localhost:8080`
 - Your RabbitMQ admin panel will be at `http://localhost:15672`
 - Your Redis admin panel will be at `http://localhost:8081`
 - Your Swagger documentation will be at `http://localhost:3333/api`
 - Your GraphQL playground will be at `http://localhost:3333/api`

This project was generated using [Nx](https://nx.dev).