var csv = require('fast-csv');
var mongoose = require('mongoose');
var Place = require('./place');
// var Promise = require('promise');
var googleMapsClient = require('@google/maps').createClient({
  key: process.env.GOOGLE_MAPS_KEY,
  Promise: Promise
});
var fetch = require("node-fetch");

exports.post = function (req, res) {
    if (!req.files)
        return res.status(400).send('No files were uploaded.');
     
    var placeFile = req.files.file;
 
    var places = [];
    csv
     .fromString(placeFile.data.toString(), {
         headers: true,
         ignoreEmpty: true
     })
     .on("data", function(data){
        if(data['restricted'] !== 'TRUE' && data['address'].indexOf('ounded by ') < 0) {
            data['_id'] = new mongoose.Types.ObjectId();
            var addressStr = data['address'] + ', ' + data['city'] + ', ' + data['state'];
            googleMapsClient.geocode({
                address: addressStr
            })
            .asPromise()
            .then(response =>  {
                if(response.json.results.length > 0) {
                    data['location'] = {
                        'type': 'Point',
                        'coordinates': [response.json.results[0].geometry.location.lng, response.json.results[0].geometry.location.lat]
                    }
                     const url = "https://en.wikipedia.org/w/api.php?action=query&prop=info&titles=" + data['historicName'] + "&inprop=url&format=json&formatversion=2";
            fetch(url)
              .then(res => {
                res.json().then(json => {
                    if(json.query.pages[0].pageid) {
                        data['wikiUrl'] = json.query.pages[0].fullurl;
                    }
                    places.push(data);
                        var savePlace = new Place(data);
                        
                        savePlace.save(function(err, savePlace) {
                            if(err) return console.error(err);
                        })
                });
              })
              .catch(error => {
                console.log(error);
              });
                }
                
               
            })
            .catch(err => console.log(err))
            
        }
     })
     .on("end", function(){
         // Place.create(places, function(err, documents) {
         //    if (err) throw err;
         // });
          // console.log(places);
         res.send('places have been successfully uploaded.');
     });
};