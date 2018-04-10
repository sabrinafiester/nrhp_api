var mongoose = require('mongoose');
 
var placeSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    historicName: String,
    city: String,
    county: String,
    state: String,
    address: String,
    secondaryCode: String,
    ref: Number,
    wikiUrl: String,
    location: {'type': String, 'coordinates': Array},
    lat: Number,
    lon: Number
}, { typeKey: '$type' });
 
var Place = mongoose.model('Place', placeSchema);
 
module.exports = Place;