/* eslint-env jest */
import mongoose from 'mongoose'
import mockingoose from 'mockingoose'
import { createConnection } from '../../../mongoose/connection'
import faker from 'faker/locale/pt_BR'
import * as TruckType from '../../../../fixtures/truck-type'
import { handler } from './find-by-truck-type'

jest.mock('../../../mongoose/connection')

describe('Find Itineraries:', () => {
  const _id = new mongoose.Types.ObjectId().toHexString()

  const itinerariesValid = {
    _id,
    origin: {
      lat: faker.address.latitude(),
      lng: faker.address.longitude()
    },
    destination: {
      lat: faker.address.latitude(),
      lng: faker.address.longitude()
    }
  }

  const _idTruckType = new mongoose.Types.ObjectId().toHexString()
  const truckTypeValid = {
    _id: _idTruckType,
    ...TruckType.seed[0]
  }

  const context = {}

  beforeAll(() => {
    createConnection.mockImplementation(() => Promise.resolve())
  })

  it('testing finding itinerary with itinerary pathParameter', async (done) => {
    const event = {
      pathParameters: { truckType: 1 }
    }

    const truckDoc = truckTypeValid
    const doc = [itinerariesValid]

    mockingoose.Driver.toReturn(doc, 'find')
    mockingoose.TruckType.toReturn(truckDoc, 'findOne')
    const result = await handler(event, context)

    expect(result).toHaveProperty('statusCode', 200)
    expect(result).toHaveProperty('body')
    expect(JSON.parse(result.body).docs).toHaveLength(1)
    done()
  })

  it('testing finding itinerary with itinerary pathParameter error', async (done) => {
    const event = {
      pathParameters: { truckType: 'no-ecxiste' }
    }

    const truckDoc = null

    mockingoose.TruckType.toReturn(truckDoc, 'findOne')
    const result = await handler(event, context)

    expect(result).toHaveProperty('statusCode', 500)
    expect(result).toHaveProperty('body')
    expect(JSON.parse(result.body)).toHaveProperty('message', 'You must provide a valid truck type code.')
    done()
  })

  it('testing finding itinerary error', async (done) => {
    const event = {
      pathParameters: { truckType: 'no-ecxiste' }
    }

    const truckDoc = truckTypeValid
    mockingoose.TruckType.toReturn(truckDoc, 'findOne')
    mockingoose.Driver.toReturn(new Error('Timeout'), 'find')

    const result = await handler(event, context)

    expect(result).toHaveProperty('statusCode', 500)
    expect(result).toHaveProperty('body')
    expect(JSON.parse(result.body)).toHaveProperty('message', 'Timeout')
    done()
  })
})
