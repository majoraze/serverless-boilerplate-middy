const mongoose = require('mongoose')

let hasConnection = false

const createConnection = async (uri = process.env.MONGO_URI) => {
  if (hasConnection) return
  const connection = await mongoose.connect(uri, {
    useNewUrlParser: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 1000,
    bufferCommands: false,
    bufferMaxEntries: 0,
    keepAlive: true
  })
  hasConnection = true
  return connection
}

const closeConnection = () => {
  mongoose.connection.close()
}

mongoose.connection.on('connected', () => {
  console.log(`Mongo connected`)
})

mongoose.connection.on('disconnected', () => {
  console.log(`Mongo has disconnected`)
  hasConnection = false
})

export { createConnection, closeConnection }
