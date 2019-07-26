import middy from '@middy/core'
import doNotWaitForEmptyEventLoop from '@middy/do-not-wait-for-empty-event-loop'
import httpEventNormalizer from '@middy/http-event-normalizer'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import httpJsonBodyParser from '@middy/http-json-body-parser'
import validator from '@middy/validator'
import httpResponseSerializer from '@sharecover-co/middy-http-response-serializer'
import createError from 'http-errors'
import Log from '@dazn/lambda-powertools-logger'

import { createConnection } from '../../../mongoose/connection'
import Driver from '../../../mongoose/models/driver'

import jsonRequest from '../../../../models/drivers/requests/update.json'

const handler = middy(async (event, context) => {
  const { id = null } = event.pathParameters
  const body = event.body

  try {
    await createConnection()

    body.updatedAt = new Date()

    const data = await Driver.findByIdAndUpdate(id, body)

    if (!data) {
      throw new createError.NotFound(`Driver id: ${id} not found`)
    }

    return { _id: data.id }
  } catch (err) {
    // verifica se o erro tem statusCode (ou seja é erro tratado no código com codigo http já)
    if (!err.statusCode) {
      // Erro não tratado em formato http
      const notTreated = new createError.InternalServerError()
      Log.error(err.message, { date: new Date() }, err)
      throw notTreated
    }

    Log.warn(err.message, { date: new Date() }, err)
    throw err
  }
})

handler
  .use(doNotWaitForEmptyEventLoop()) // adiciona o context.doNotWaitForEmptyEventLoop = false
  .use(httpEventNormalizer()) // normaliza queryStringParameters e pathParameters (Basicamente cria um {} caso não envie parametros)
  .use(httpJsonBodyParser()) // parseia o body em json para não precisar dar JSON.parse e fazer as devidas validações
  .use(validator({ inputSchema: jsonRequest }))
  .use(httpErrorHandler()) // valida qualquer erro do formato http-errors
  .use(cors()) // adiciona os headers do cors (tem que ser antes do response)
  .use(httpResponseSerializer()) // serializa a resposta caso seja sucesso em statusCode 200 e repassa o objeto de retorno

export { handler }
