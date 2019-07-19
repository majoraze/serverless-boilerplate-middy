import Driver from '../../../mongoose/models/driver'
import { createConnection } from '../../../mongoose/connection'
import { generatePaginateOptions } from '../../../utils/pagination'
import { responseSuccess, responseInternalError } from '../../../utils/response'
import { DAILY, WEEKLY, MONTHLY, POSSIBLE_PERIOD_VALUES } from '../../../utils/enums/possibile-period-values'
import validator from 'validator'
import moment from 'moment'

const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false

  try {
    let { queryStringParameters } = event
    queryStringParameters = queryStringParameters || {}

    await createConnection()

    const { loaded = null, truckOwner = null, countOnly = null, period = null } = queryStringParameters
    const query = {}

    if (loaded) {
      if (!validator.isBoolean(loaded)) return responseInternalError({ message: `You must provide a boolean value for the loaded parameter.` })
      query.loaded = loaded
    }

    if (truckOwner) {
      if (!validator.isBoolean(truckOwner)) return responseInternalError({ message: `You must provide a boolean value for the truckOwner parameter.` })
      query.truckOwner = truckOwner
    }

    if (countOnly && !validator.isBoolean(countOnly)) return responseInternalError({ message: `You must provide a boolean value for the countOnly parameter.` })

    if (period) {
      if (!POSSIBLE_PERIOD_VALUES.includes(period)) return responseInternalError({ message: `You must provide one of the following values for the period parameter: ${POSSIBLE_PERIOD_VALUES.join(', ')}.` })
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

    return responseSuccess(data)
  } catch (error) {
    return responseInternalError(error)
  }
}

export { handler }
