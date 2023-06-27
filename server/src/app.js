import { rabbitHost, rabbitPort, rabbitPassword, rabbitUser, rabbitExchange, rabbitRoutingKey } from './config/index.js'
import RpcServer from './utils/rpcServer.js'

const amqpConnection = new RpcServer(rabbitRoutingKey, rabbitExchange)
await amqpConnection.connect(rabbitHost, rabbitPort, rabbitUser, rabbitPassword)

amqpConnection.channel.consume(amqpConnection.queue, function reply (msg) {
  const message = msg.content.toString()
  console.log(' [.] ' + message)

  amqpConnection.channel.sendToQueue(msg.properties.replyTo,
    Buffer.from(message.toString() + ' -> Antwort2'), { correlationId: msg.properties.correlationId })

  amqpConnection.channel.ack(msg)
})

export default amqpConnection
