import * as dotenv from 'dotenv'

const NODE_ENV = process.env.NODE_ENV === 'production' ? 'production.env' : 'dev.env'
dotenv.config({ path: NODE_ENV })

export const Env = {
  NODE_ENV,
  MONGO_CONNECTION: {
    URI: process.env.MONGO_URI ?? '',
    OPTIONS: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      ssl: true,
      sslValidate: true,
      socketTimeoutMS: 60000,
      connectTimeoutMS: 30000,
      serverSelectionTimeoutMS: 5000
    }
  },
  REDIS_CONNECTION: {
    URI: process.env.REDIS_URI ?? ''
  }
}
