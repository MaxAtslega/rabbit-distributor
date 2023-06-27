import amqp from 'amqplib'

export default class RpcServer {
  constructor (routingKey, exchange) {
    this._routingKey = routingKey
    this._exchange = exchange
    this._connection = null
    this._channel = null
  }

  async connect (host, port, username, password) {
    this._connection = await amqp.connect(`amqp://${username}:${password}@${host}:${port}`)
    this._channel = await this._connection.createChannel()
    this._channel.assertExchange(this._exchange, 'topic', { durable: false })
    this._channel.assertQueue('', { durable: false })
    this._channel.bindQueue(this._channel.queue, this._exchange, this._routingKey)
    this._channel.prefetch(1)
  }

  get routingKey () {
    return this._routingKey
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
