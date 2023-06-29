import { config } from 'dotenv'
import fs from 'fs'
import path from 'path'

async function readConfig () {
  const data = await fs.readFileSync(path.join(path.resolve(path.dirname('')), 'config.json'))
  const object = JSON.parse(data)
  return object
}

const fileConfig = await readConfig()
config()

const { CONSUMER_ADDRESS, RABBIT_HOST, RABBIT_PORT, RABBIT_USER, RABBIT_PASSWORD, RABBIT_EXCHANGE } = process.env

export const consumerAddress = CONSUMER_ADDRESS || 'http://0.0.0.0:80'
export const rabbitHost = RABBIT_HOST || '0.0.0.0'
export const rabbitPort = RABBIT_PORT || 5672
export const rabbitUser = RABBIT_USER || 'guest'
export const rabbitPassword = RABBIT_PASSWORD || 'guest'
export const rabbitExchange = RABBIT_EXCHANGE || 'rabbit-distribute'

export const getEndpointInformationByRoutingKey = (key) => {
  return fileConfig?.endpoints[key]
}
