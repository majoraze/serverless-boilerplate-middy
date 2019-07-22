import middy from '@middy/core'
import doNotWaitForEmptyEventLoop from '@middy/do-not-wait-for-empty-event-loop'
import httpEventNormalizer from '@middy/http-event-normalizer'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import inputOutputLogger from '@middy/error-logger'
import httpResponseSerializer from '@sharecover-co/middy-http-response-serializer'
import createError from 'http-errors'

import Driver from '../../../mongoose/models/driver'
import { createConnection } from '../../../mongoose/connection'
import { generatePaginateOptions } from '../../../utils/pagination'
import { DAILY, WEEKLY, MONTHLY, POSSIBLE_PERIOD_VALUES } from '../../../utils/enums/possibile-period-values'
import validator from 'validator'
import moment from 'moment'

const handler = middy(async (event, context) => {
  try {
    const { queryStringParameters = {} } = event

    await createConnection()

    const { loaded = null, truckOwner = null, countOnly = null, period = null } = queryStringParameters
    const query = {}

    if (loaded) {
      if (!validator.isBoolean(loaded)) throw new createError.UnprocessableEntity(`You must provide a boolean value for the loaded parameter.`)
      query.loaded = loaded
    }

    if (truckOwner) {
      if (!validator.isBoolean(truckOwner)) throw new createError.UnprocessableEntity(`You must provide a boolean value for the truckOwner parameter.`)
      query.truckOwner = truckOwner
    }

    if (countOnly && !validator.isBoolean(countOnly)) throw new createError.UnprocessableEntity(`You must provide a boolean value for the countOnly parameter.`)

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

    let data
    if (!countOnly) {
      data = await Driver.paginate(query, optionsPaginate)
    } else {
      data = await Driver.countDocuments(query)
      data = { count: data }
    }

    return data
  } catch (err) {
    // checar instancia do erro para ver se é não tratada, se não explode o erro direto
    if (!err.statusCode) throw new createError.InternalServerError()
    throw err
  }
})

handler
  .use(doNotWaitForEmptyEventLoop()) // adiciona o context.doNotWaitForEmptyEventLoop = false
  .use(httpEventNormalizer()) // normaliza queryStringParameters e pathParameters (Basicamente cria um {} caso não envie parametros)
  .use(inputOutputLogger()) // cria um console.error nos erros
  .use(httpErrorHandler({ logger: false })) // valida qualquer erro do formato http-errors
  .use(cors()) // adiciona os headers do cors (tem que ser antes do response)
  .use(httpResponseSerializer()) // serializa a resposta caso seja sucesso em statusCode 200 e repassa o objeto de retorno

export { handler }
