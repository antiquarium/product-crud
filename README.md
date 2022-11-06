## Prerequisites

A running Docker container of Postgres. Following command can be used to make it work with the app's default DB config:
```bash
$ docker run \
    --name postgres-product-crud \
    -p 5433:5432 \
    -e POSTGRES_DB=product-crud-db \
    -e POSTGRES_USER=product-crud-user \
    -e POSTGRES_PASSWORD=postgres \
    -d postgres
```

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```