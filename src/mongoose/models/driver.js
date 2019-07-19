const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')

const Schema = mongoose.Schema

const LocationSchema = new Schema({
  lat: { type: String, required: true },
  lng: { type: String, required: true }
}, { _id: false })

const DriverSchema = new Schema({
  name: { type: String, required: true },
  birthDate: { type: Date, required: true },
  gender: { type: String, required: true },
  truckOwner: { type: Boolean, required: true },
  licenseType: { type: String, required: true },
  loaded: { type: Boolean, required: true },
  truckType: { type: Schema.Types.Mixed, required: true },
  origin: { type: LocationSchema, required: true },
  destination: { type: LocationSchema, required: true },
  arrivedAt: { type: Date, required: true },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true }
})

DriverSchema.plugin(mongoosePaginate)

if (process.env.IS_OFFLINE) delete mongoose.connection.models.Driver // to live reload development environment
export default mongoose.model('Driver', DriverSchema)
