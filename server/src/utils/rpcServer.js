import amqp from 'amqplib'

export default class RpcServer {
  constructor (exchange) {
    this._exchange = exchange
    this._connection = null
    this._channel = null
  }

  async connect (host, port, username, password) {
    this._connection = await amqp.connect(`amqp://${username}:${password}@${host}:${port}`)
    this._channel = await this._connection.createChannel()
    this._channel.assertExchange(this._exchange, 'topic', { durable: true })

    // Create queues
    this._channel.assertQueue('image', { durable: true })
    this._channel.assertQueue('audio', { durable: true })
    this._channel.assertQueue('video', { durable: true })

    // Bind the queues to this channel
    this._channel.bindQueue(this._channel.queue, this._exchange, 'image')
    this._channel.bindQueue(this._channel.queue, this._exchange, 'audio')
    this._channel.bindQueue(this._channel.queue, this._exchange, 'video')

    this._channel.prefetch(1)
  }

  get connection () {
    return this._connection
  }

  get exchange () {
    return this._exchange
  }

  get channel () {
    return this._channel
  }
}
