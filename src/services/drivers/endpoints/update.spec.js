/* eslint-env jest */
import mongoose from 'mongoose'
import mockingoose from 'mockingoose'
import { createConnection } from '../../../mongoose/connection'
import * as Driver from '../../../../fixtures/driver'
import { handler } from './update'

jest.mock('../../../mongoose/connection')

describe('Update Driver:', () => {
  const context = {}

  const _id = new mongoose.Types.ObjectId().toHexString()

  const driverValid = {
    _id,
    ...Driver.validDriver()
  }

  beforeAll(() => {
    createConnection.mockImplementation(() => Promise.resolve())
  })

  it('testing update driver success', async (done) => {
    const event = {
      body: driverValid,
      pathParameters: { id: _id }
    }

    mockingoose.Driver.toReturn(driverValid, 'findOneAndUpdate')

    const result = await handler(event, context)

    expect(result).toHaveProperty('statusCode', 200)
    expect(result).toHaveProperty('body')
    expect(JSON.parse(result.body)).toHaveProperty('_id', _id)
    done()
  })

  it('testing update driver not exists', async (done) => {
    const event = {
      body: driverValid,
      pathParameters: { id: _id }
    }

    const doc = null
    mockingoose.Driver.toReturn(doc, 'findOneAndUpdate')

    const result = await handler(event, context)

    expect(result).toHaveProperty('statusCode', 404)
    expect(result).toHaveProperty('body')
    done()
  })

  it('testing update driver error', async (done) => {
    const event = {
      body: driverValid,
      pathParameters: { id: _id }
    }

    mockingoose.Driver.toReturn(new Error('Timeout'), 'findOneAndUpdate')

    const result = await handler(event, context)
    expect(result).toHaveProperty('statusCode', 500)
    expect(result).toHaveProperty('body')
    done()
  })
})
