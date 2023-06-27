import { config } from 'dotenv'
config()

const {CONSUMER_ADDRESS, RABBIT_HOST, RABBIT_PORT, RABBIT_USER, RABBIT_PASSWORD} = process.env

export const consumerAddress = CONSUMER_ADDRESS || "http://localhost:80"
export const rabbitHost = RABBIT_HOST || "localhost"
