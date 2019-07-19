const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')

const TruckTypeSchema = new mongoose.Schema({
  cod: { type: String, required: true },
  name: { type: String, required: true }
})

TruckTypeSchema.plugin(mongoosePaginate)

if (process.env.IS_OFFLINE) delete mongoose.connection.models.TruckType // to live reload development environment
export default mongoose.model('TruckType', TruckTypeSchema)
