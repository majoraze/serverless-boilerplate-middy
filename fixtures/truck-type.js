import TruckType from '../src/mongoose/models/truck-type'

const seed = () => {
  return [
    {
      cod: 1,
      name: 'Caminhão 3/4'
    },
    {
      cod: 2,
      name: 'Caminhão Toco'
    },
    {
      cod: 3,
      name: 'Caminhão Truck'
    },
    {
      cod: 4,
      name: 'Carreta Simples'
    },
    {
      cod: 5,
      name: 'Carreta Eixo Estendido'
    }
  ]
}

const create = async () => {
  const body = seed()

  return TruckType.create(body)
}

export { create, seed }
