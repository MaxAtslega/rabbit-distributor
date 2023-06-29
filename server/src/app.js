import { rabbitHost, rabbitPort, rabbitPassword, rabbitUser, rabbitExchange, getEndpointInformationByRoutingKey, endpointsConfig } from './config/index.js'
import RpcServer from './utils/rpcServer.js'

// Check whether a config exists or not
if (Object.keys(endpointsConfig).length !== 0) {
  // Initialize AMQP connection
  const amqpConnection = new RpcServer(rabbitExchange)
  await amqpConnection.connect(rabbitHost, rabbitPort, rabbitUser, rabbitPassword)

  // Consume messages from the queue
  amqpConnection.channel.consume(amqpConnection.queue, async function reply (msg) {
    const message = msg.content.toString()
    const routingKey = msg.fields.routingKey
    let response = 'error'

    console.log(' [.] [Queue: ' + msg.fields.routingKey + '] [From: ' + msg.properties.replyTo + '] ' + message)

    const endpoint = getEndpointInformationByRoutingKey(routingKey)

    // Fetch data from the consumer
    await fetch(endpoint.url, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...endpoint.headers
      },
      method: 'POST',
      body: JSON.stringify({ message, ...endpoint.body })
    })
      .then(response => response.json())
      .then(data => { response = data?.message })
      .catch((error) => {
        console.error(error)
      })

    // Send the response to the queue
    amqpConnection.channel.sendToQueue(msg.properties.replyTo,
      Buffer.from(response), { correlationId: msg.properties.correlationId })
    amqpConnection.channel.ack(msg)
    console.log(' [x] Done')
  })
} else {
  console.error('Please, provide a config/endpoints.json with all endpoints for the queues.')
}
