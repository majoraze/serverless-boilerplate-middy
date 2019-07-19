import { createConnection } from '../../../mongoose/connection'
import { generatePaginateOptions } from '../../../utils/pagination'
import { responseSuccess, responseInternalError } from '../../../utils/response'
import Driver from '../../../mongoose/models/driver'
import TruckType from '../../../mongoose/models/truck-type'

const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false

  try {
    const { truckType = 'not-found' } = event.pathParameters
    let { queryStringParameters } = event
    queryStringParameters = queryStringParameters || {}

    await createConnection()

    // checking if the truck type exists in collection
    const checkTruckType = await TruckType.findOne({ cod: truckType }).lean()
    if (!checkTruckType) return responseInternalError({ message: `You must provide a valid truck type code.` })

    const query = { 'truckType.cod': parseInt(truckType, 10) }

    const optionsPaginate = generatePaginateOptions(queryStringParameters)
    optionsPaginate.select = 'origin destination'

    const data = await Driver.paginate(query, optionsPaginate)

    return responseSuccess(data)
  } catch (error) {
    return responseInternalError(error)
  }
}

export { handler }
