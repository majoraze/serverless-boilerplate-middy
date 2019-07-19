import { createConnection } from '../../../mongoose/connection'
import { responseSuccess, responseInternalError, responseNotfound } from '../../../utils/response'
import Driver from '../../../mongoose/models/driver'

const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false

  const { id } = event.pathParameters
  const body = JSON.parse(event.body)

  try {
    await createConnection()

    body.updatedAt = new Date()

    const driver = await Driver.findByIdAndUpdate(id, body)
    if (!driver) return responseNotfound({ message: `Driver id: ${id} not found` })

    return responseSuccess({ _id: driver.id })
  } catch (error) {
    return responseInternalError(error)
  }
}

export { handler }
