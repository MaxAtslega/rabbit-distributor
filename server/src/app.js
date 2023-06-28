import { rabbitHost, rabbitPort, rabbitPassword, rabbitUser, rabbitExchange } from './config/index.js'
import RpcServer from './utils/rpcServer.js'

const amqpConnection = new RpcServer(rabbitExchange)
await amqpConnection.connect(rabbitHost, rabbitPort, rabbitUser, rabbitPassword)

amqpConnection.channel.consume(amqpConnection.queue, function reply (msg) {
  const message = msg.content.toString()
  console.log(' [.] [' + msg.fields.routingKey + '] ' + message)

  setTimeout(function () {
    amqpConnection.channel.sendToQueue(msg.properties.replyTo,
      Buffer.from(message.toString() + ' -> Antwort'), { correlationId: msg.properties.correlationId })
    amqpConnection.channel.ack(msg)
    console.log(' [x] [' + msg.fields.routingKey + '] Done')
  }, 5 * 1000)
})

export default amqpConnection
