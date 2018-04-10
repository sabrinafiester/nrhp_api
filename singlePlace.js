var mongoose = require('mongoose');
var Place = require('./place');

exports.get = function(req, res) {
 
    Place.findOne({ 'ref': req.params.id }, function (err, place) {
        if (err) return handleError(err);
            res.send(place);

    });
 
};