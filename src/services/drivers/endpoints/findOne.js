import middy from '@middy/core'
import doNotWaitForEmptyEventLoop from '@middy/do-not-wait-for-empty-event-loop'
import httpEventNormalizer from '@middy/http-event-normalizer'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import httpResponseSerializer from '@sharecover-co/middy-http-response-serializer'
import warmup from '@middy/warmup'
import awsXrayTracing from '@sharecover-co/middy-aws-xray-tracing'
import epsagon from 'epsagon'
import createError from 'http-errors'
import Log from '@dazn/lambda-powertools-logger'

import Driver from '../../../mongoose/models/driver'
import { createConnection } from '../../../mongoose/connection'

const handler = middy(async (event, context) => {
  const { id = null } = event.pathParameters

  try {
    await createConnection()

    const data = await Driver.findById(id).lean()
    if (!data) throw new createError.NotFound(`Driver with specific id not found.`)

    return data
  } catch (err) {
    // verifica se o erro tem statusCode (ou seja é erro tratado no código com codigo http já)
    if (!err.statusCode) {
      // Erro não tratado em formato http
      const notTreated = new createError.InternalServerError()
      Log.error(err.message, { date: new Date() }, err)
      epsagon.setError(err)
      throw notTreated
    }

    Log.warn(err.message, { date: new Date() }, err)
    throw err
  }
})

handler
  .use(doNotWaitForEmptyEventLoop()) // adiciona o context.doNotWaitForEmptyEventLoop = false
  .use(warmup({ waitForEmptyEventLoop: false })) // retorna de forma rapida quando é um evento warmup
  .use(awsXrayTracing())
  .use(httpErrorHandler({ logger: Log.warn })) // valida qualquer erro do formato http-errors
  .use(cors()) // adiciona os headers do cors (tem que ser antes do response)
  .use(httpResponseSerializer()) // serializa a resposta caso seja sucesso em statusCode 200 e repassa o objeto de retorno
  .use(httpEventNormalizer()) // normaliza queryStringParameters e pathParameters (Basicamente cria um {} caso não envie parametros)

export { handler }
