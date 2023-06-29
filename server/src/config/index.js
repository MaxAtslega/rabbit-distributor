import { config } from 'dotenv'
import fs from 'fs'
import path from 'path'

async function readConfig (file) {
  try {
    const data = await fs.readFileSync(path.join(path.resolve(path.dirname('')), file))
    const object = JSON.parse(data)
    return object
  } catch (e) {
    console.error(e)
    return {}
  }
}

const endpointsConfig = await readConfig('config/endpoints.json')
config()

const { CONSUMER_ADDRESS, RABBIT_HOST, RABBIT_PORT, RABBIT_USER, RABBIT_PASSWORD, RABBIT_EXCHANGE } = process.env

export const consumerAddress = CONSUMER_ADDRESS || 'http://0.0.0.0:80'
export const rabbitHost = RABBIT_HOST || '0.0.0.0'
export const rabbitPort = RABBIT_PORT || 5672
export const rabbitUser = RABBIT_USER || 'guest'
export const rabbitPassword = RABBIT_PASSWORD || 'guest'
export const rabbitExchange = RABBIT_EXCHANGE || 'rabbit-distribute'

export { endpointsConfig }

export const getEndpointInformationByRoutingKey = (key) => {
  return endpointsConfig?.queues[key]
}
