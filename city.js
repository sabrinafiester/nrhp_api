var mongoose = require('mongoose');
var Place = require('./place');

exports.get = function(req, res) {
 
    Place.find({ city: new RegExp(req.params.cityName, 'i') }, 'historicName city', function (err, places) {
    	if (err) return handleError(err);
            res.send(places);
     })
  
 
};