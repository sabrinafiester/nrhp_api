const mongoose = require('mongoose');

const siteSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    historicName: String,
    city: String,
    county: String,
    state: String,
    address: String,
    otherNames: String,
    listingDate: Date,
    significantPerson: String,
    architect: String,
    ref: {$type: Number, unique: true, required: true, dropDups: true},
    wikiUrl: String,
    location: {type: String, coordinates: Array},
    lat: Number,
    lon: Number
}, {typeKey: '$type'});
siteSchema.index({ location: "2dsphere" });
const Site = mongoose.model('Site', siteSchema);

module.exports = Site;