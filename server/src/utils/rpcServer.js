import amqp from 'amqplib'

export default class RpcServer {
  constructor () {
    this._queue = 'rpc_queue'
    this._connection = null
    this.channel = null
  }

  async connect (host, port, username, password) {
    this._connection = await amqp.connect(`amqp://${username}:${password}@${host}:${port}`)
    this.channel = await this._connection.createChannel()
    this.channel.assertQueue(this._queue, { durable: false })
    this.channel.prefetch(1)
  }

  get queue () {
    return this._queue
  }

  get connection () {
    return this._connection
  }
}
