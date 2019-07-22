/* eslint-env jest */
import mongoose from 'mongoose'
import mockingoose from 'mockingoose'
import { createConnection } from '../../../mongoose/connection'
import * as Driver from '../../../../fixtures/driver'
import { handler } from './create'

jest.mock('../../../mongoose/connection')

describe('Create Driver:', () => {
  const _id = new mongoose.Types.ObjectId().toHexString()

  const driverValid = {
    _id,
    ...Driver.validDriver()
  }

  const context = {}

  beforeAll(() => {
    createConnection.mockImplementation(() => Promise.resolve())
  })

  it('testing creation driver success', async (done) => {
    const event = { body: driverValid } // sem stringify
    // const response = { _id }

    mockingoose.Driver.toReturn(driverValid, 'save')
    const result = await handler(event, context)

    expect(result).toHaveProperty('statusCode', 200)
    expect(result).toHaveProperty('body')
    expect(JSON.parse(result.body)).toHaveProperty('_id', _id)
    done()
  })

  it('testing creation driver error', async (done) => {
    const context = {}
    const event = { body: driverValid } // sem stringify

    mockingoose.Driver.toReturn(new Error('Timeout'), 'save')

    const result = await handler(event, context)

    expect(result).toHaveProperty('statusCode', 500)
    expect(result).toHaveProperty('body')
    // expect(JSON.parse(result.body)).toHaveProperty('message', 'Timeout')
    done()
  })
})
