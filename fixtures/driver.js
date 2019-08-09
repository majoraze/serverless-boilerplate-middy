import faker from 'faker/locale/pt_BR'
import Driver from '../src/mongoose/models/driver'
import * as TruckTypeFixture from './truck-type'

const validDriver = () => {
  return {
    name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    birthDate: faker.date.between('1980-01-01', '1999-12-31').toISOString(),
    gender: faker.random.boolean() ? 'Masculino' : 'Feminino',
    truckOwner: faker.random.boolean(),
    licenseType: faker.helpers.shuffle(['A', 'B', 'C'])[0],
    loaded: faker.random.boolean(),
    truckType: faker.helpers.shuffle(TruckTypeFixture.seed())[0],
    origin: {
      lat: faker.address.latitude(),
      lng: faker.address.longitude()
    },
    destination: {
      lat: faker.address.latitude(),
      lng: faker.address.longitude()
    },
    arrivedAt: faker.date.recent(45), // randomize last 45 days
    updatedAt: new Date(),
    createdAt: new Date()
  }
}

const create = async () => {
  const body = []
  const driversFaked = 1000

  // faking drivers
  for (let i = 0; i < driversFaked; i++) {
    body.push(validDriver())
  }

  return Driver.create(body)
}

export { create, validDriver }
