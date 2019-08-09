import middy from '@middy/core'
import doNotWaitForEmptyEventLoop from '@middy/do-not-wait-for-empty-event-loop'
import httpEventNormalizer from '@middy/http-event-normalizer'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import httpResponseSerializer from '@sharecover-co/middy-http-response-serializer'
import createError from 'http-errors'
import Log from '@dazn/lambda-powertools-logger'
import awsXrayTracing from '@sharecover-co/middy-aws-xray-tracing'
import warmup from '@middy/warmup'
import epsagon from 'epsagon'
import { createConnection } from '../../../mongoose/connection'
import { generatePaginateOptions } from '../../../utils/pagination'
import Driver from '../../../mongoose/models/driver'
import TruckType from '../../../mongoose/models/truck-type'

const handler = middy(async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false

  try {
    const { truckType = 'not-found' } = event.pathParameters
    const { queryStringParameters = {} } = event

    await createConnection()

    // checking if the truck type exists in collection
    const checkTruckType = await TruckType.findOne({ cod: parseInt(truckType) }).lean()
    if (!checkTruckType) throw new createError.UnprocessableEntity(`You must provide a valid truck type code.`)

    const query = { 'truckType.cod': parseInt(truckType, 10) }

    const optionsPaginate = generatePaginateOptions(queryStringParameters)
    optionsPaginate.select = 'origin destination'

    const data = await Driver.paginate(query, optionsPaginate)

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
