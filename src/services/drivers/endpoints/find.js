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
import { generatePaginateOptions } from '../../../utils/pagination'
import { DAILY, WEEKLY, MONTHLY, POSSIBLE_PERIOD_VALUES } from '../../../utils/enums/possibile-period-values'
import validator from 'validator'
import moment from 'moment'

const handler = middy(async (event, context) => {
  const { queryStringParameters = {} } = event

  try {
    await createConnection()

    const { loaded = null, truckOwner = null, period = null } = queryStringParameters
    const query = {}

    if (loaded) {
      if (!validator.isBoolean(loaded)) throw new createError.UnprocessableEntity(`You must provide a boolean value for the loaded parameter.`)
      query.loaded = loaded
    }

    if (truckOwner) {
      if (!validator.isBoolean(truckOwner)) throw new createError.UnprocessableEntity(`You must provide a boolean value for the truckOwner parameter.`)
      query.truckOwner = truckOwner
    }

    if (period) {
      if (!POSSIBLE_PERIOD_VALUES.includes(period)) throw new createError.UnprocessableEntity(`You must provide one of the following values for the period parameter: ${POSSIBLE_PERIOD_VALUES.join(', ')}.`)
      if (DAILY === period) {
        query.arrivedAt = { $gte: moment().startOf('day').toDate(), $lte: moment().toDate() }
      } else if (WEEKLY === period) {
        query.arrivedAt = { $gte: moment().startOf('week').toDate(), $lte: moment().toDate() }
      } else if (MONTHLY === period) {
        query.arrivedAt = { $gte: moment().startOf('month').toDate(), $lte: moment().toDate() }
      }
    }

    const optionsPaginate = generatePaginateOptions(queryStringParameters)

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
