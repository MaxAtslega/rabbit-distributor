# Rabbit Distributor
Rabbit Distributor is an example RabbitMQ distributor written in Node.js and in PHP framework Symfony. 
This project demonstrates the usage of RabbitMQ, specifically in the context of data delivery between a client and a consumer.

This repo uses the [rabbitmq](https://hub.docker.com/_/rabbitmq) docker image from DockerHub.

## Documentation
- [RabbitMQ](https://www.rabbitmq.com/)
- [Symfony](https://symfony.com/)
- [NodeJS](https://nodejs.org/)
- [Docker](https://www.docker.com/)

## Client
The client is based on Symfony.

### API Reference
#### Send message to rabbit

```http
  POST /send
```

| Parameter     | Type     | Description                |
|:--------------| :------- |:---------------------------|
| `message`     | `string` | **Required**. Your message |
| `routing_key` | `string` | **Required**. The queue    |

### Environment Variables
To run the client, you will need to add the following environment variables to your .env file
`RABBIT_HOST`
`RABBIT_PORT`
`RABBIT_USER`
`RABBIT_PASSWORD`
`RABBIT_EXCHANGE`

## Consumer
The consumer is based on Symfony.

### API Reference
#### Get a sample answer

```http
  POST /audio
  POST /video
  POST /image
```

| Parameter    | Type     | Description                |
|:-------------| :------- |:---------------------------|
| `message`    | `string` | **Required**. Your message |

## Server
The server is based on NodeJS.

### Environment Variables
To run the server, you will need to add the following environment variables to your .env file
`RABBIT_HOST`
`RABBIT_PORT`
`RABBIT_USER`
`RABBIT_PASSWORD`
`RABBIT_EXCHANGE`