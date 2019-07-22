import middy from '@middy/core'
import doNotWaitForEmptyEventLoop from '@middy/do-not-wait-for-empty-event-loop'
import httpEventNormalizer from '@middy/http-event-normalizer'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import inputOutputLogger from '@middy/error-logger'
import httpJsonBodyParser from '@middy/http-json-body-parser'
import httpResponseSerializer from '@sharecover-co/middy-http-response-serializer'
import createError from 'http-errors'
import Driver from '../../../mongoose/models/driver'
import { createConnection } from '../../../mongoose/connection'

const handler = middy(async (event, context) => {
  const body = event.body

  body.arrivedAt = body.arrivedAt || new Date()
  body.createdAt = new Date()
  body.updatedAt = new Date()

  try {
    await createConnection()
    const driver = await Driver.create(body)

    const response = { _id: driver._id }
    return response
  } catch (err) {
    // checar instancia do erro para ver se é não tratada, se não explode o erro direto
    if (!err.statusCode) throw new createError.InternalServerError()
    throw err
  }
})

handler
  .use(doNotWaitForEmptyEventLoop()) // adiciona o context.doNotWaitForEmptyEventLoop = false
  .use(httpEventNormalizer()) // normaliza queryStringParameters e pathParameters (Basicamente cria um {} caso não envie parametros)
  .use(httpJsonBodyParser()) // parseia o body em json para não precisar dar JSON.parse e fazer as devidas validações
  .use(inputOutputLogger()) // cria um console.error nos erros
  .use(httpErrorHandler({ logger: false })) // valida qualquer erro do formato http-errors
  .use(cors()) // adiciona os headers do cors (tem que ser antes do response)
  .use(httpResponseSerializer()) // serializa a resposta caso seja sucesso em statusCode 200 e repassa o objeto de retorno

export { handler }
