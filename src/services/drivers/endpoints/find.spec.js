/* eslint-env jest */
import mongoose from 'mongoose'
import mockingoose from 'mockingoose'
import { createConnection } from '../../../mongoose/connection'
import { handler } from './find'
import * as Driver from '../../../../fixtures/driver'

jest.mock('../../../mongoose/connection')

describe('Find Driver:', () => {
  const _id = new mongoose.Types.ObjectId().toHexString()

  const driverValid = {
    _id,
    ...Driver.validDriver()
  }

  const context = {}

  beforeAll(() => {
    createConnection.mockImplementation(() => Promise.resolve())
  })

  it('testing finding driver without params', async (done) => {
    const doc = [driverValid]

    const event = { }

    mockingoose.Driver.toReturn(doc, 'find')
    const result = await handler(event, context)

    expect(result).toHaveProperty('statusCode', 200)
    expect(result).toHaveProperty('body')
    expect(JSON.parse(result.body).docs).toHaveLength(1)
    done()
  })

  it('testing finding driver with params', async (done) => {
    const event = {
      queryStringParameters: {
        limit: 10,
        page: 1,
        sort: '-name'
      }
    }

    const doc = [driverValid]

    mockingoose.Driver.toReturn(doc, 'find')
    const result = await handler(event, context)

    expect(result).toHaveProperty('statusCode', 200)
    expect(result).toHaveProperty('body')
    expect(JSON.parse(result.body).docs).toHaveLength(1)
    done()
  })

  it('testing finding driver with countOnly parameter', async (done) => {
    const event = {
      queryStringParameters: {
        countOnly: 'true'
      }
    }

    const doc = { count: 1 }

    mockingoose.Driver.toReturn(doc, 'countDocuments')
    const result = await handler(event, context)

    expect(result).toHaveProperty('statusCode', 200)
    expect(result).toHaveProperty('body')
    expect(JSON.parse(result.body)).toHaveProperty('count')
    done()
  })

  it('testing finding driver with countOnly parameter error', async (done) => {
    const event = {
      queryStringParameters: {
        countOnly: 'error'
      }
    }

    const doc = { count: 1 }

    mockingoose.Driver.toReturn(doc, 'find')
    const result = await handler(event, context)

    expect(result).toHaveProperty('statusCode', 422)
    expect(result).toHaveProperty('body')
    done()
  })

  it('testing finding driver with period parameter (day)', async (done) => {
    const event = {
      queryStringParameters: {
        period: 'day'
      }
    }

    const doc = [driverValid]

    mockingoose.Driver.toReturn(doc, 'find')
    const result = await handler(event, context)

    expect(result).toHaveProperty('statusCode', 200)
    expect(result).toHaveProperty('body')
    expect(JSON.parse(result.body).docs).toHaveLength(1)
    done()
  })

  it('testing finding driver with period parameter (week)', async (done) => {
    const event = {
      queryStringParameters: {
        period: 'week'
      }
    }

    const doc = [driverValid]

    mockingoose.Driver.toReturn(doc, 'find')
    const result = await handler(event, context)

    expect(result).toHaveProperty('statusCode', 200)
    expect(result).toHaveProperty('body')
    expect(JSON.parse(result.body).docs).toHaveLength(1)
    done()
  })

  it('testing finding driver with period parameter (month)', async (done) => {
    const event = {
      queryStringParameters: {
        period: 'month'
      }
    }

    const doc = [driverValid]

    mockingoose.Driver.toReturn(doc, 'find')
    const result = await handler(event, context)

    expect(result).toHaveProperty('statusCode', 200)
    expect(result).toHaveProperty('body')
    expect(JSON.parse(result.body).docs).toHaveLength(1)
    done()
  })

  it('testing finding driver with period parameter error', async (done) => {
    const event = {
      queryStringParameters: {
        period: 'error'
      }
    }

    const doc = { count: 1 }

    mockingoose.Driver.toReturn(doc, 'find')
    const result = await handler(event, context)

    expect(result).toHaveProperty('statusCode', 422)
    expect(result).toHaveProperty('body')
    done()
  })

  it('testing finding driver with truckOwner parameter', async (done) => {
    const event = {
      queryStringParameters: {
        truckOwner: 'true'
      }
    }

    const doc = [driverValid]

    mockingoose.Driver.toReturn(doc, 'find')
    const result = await handler(event, context)

    expect(result).toHaveProperty('statusCode', 200)
    expect(result).toHaveProperty('body')
    expect(JSON.parse(result.body).docs).toHaveLength(1)
    done()
  })

  it('testing finding driver with truckOwner parameter error', async (done) => {
    const event = {
      queryStringParameters: {
        truckOwner: 'error'
      }
    }

    const doc = { count: 1 }

    mockingoose.Driver.toReturn(doc, 'find')
    const result = await handler(event, context)

    expect(result).toHaveProperty('statusCode', 422)
    expect(result).toHaveProperty('body')
    done()
  })

  it('testing finding driver with loaded parameter', async (done) => {
    const event = {
      queryStringParameters: {
        loaded: 'true'
      }
    }

    const doc = [driverValid]

    mockingoose.Driver.toReturn(doc, 'find')
    const result = await handler(event, context)

    expect(result).toHaveProperty('statusCode', 200)
    expect(result).toHaveProperty('body')
    expect(JSON.parse(result.body).docs).toHaveLength(1)
    done()
  })

  it('testing finding driver with loaded parameter error', async (done) => {
    const event = {
      queryStringParameters: {
        loaded: 'error'
      }
    }

    const doc = { count: 1 }

    mockingoose.Driver.toReturn(doc, 'find')
    const result = await handler(event, context)

    expect(result).toHaveProperty('statusCode', 422)
    expect(result).toHaveProperty('body')
    done()
  })

  it('testing finding driver error', async (done) => {
    const event = { queryStringParameters: {} }

    mockingoose.Driver.toReturn(new Error('Timeout'), 'find')

    const result = await handler(event, context)

    expect(result).toHaveProperty('statusCode', 500)
    expect(result).toHaveProperty('body')
    done()
  })
})
