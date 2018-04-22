const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Site = require('../models/Site.js');
const jwt = require('express-jwt');
const rsaValidation = require('auth0-api-jwt-rsa-validation');

const jwtCheck = jwt({
    secret: rsaValidation(),
    audience: 'https://historicsiteapi.com',
    issuer: "https://sabrinaio.auth0.com/",
    algorithms: ['RS256']
});

const guard = function(req, res, next) {
    if(req.method === 'GET') {
        if (req.user.scope.includes('general')) {
            next();
        } else {
            res.send(403, {message: 'Forbidden'});
        }
    }
    else {
        if (req.user.scope.includes('admin')) {
            next();
        } else {
            res.send(403, {message: 'Forbidden'});
        }
    }
};

const canEdit = function(req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({message:'Missing or invalid token'});
    }
    next();
};
/* GET ALL SITES */
router.get('/', function (req, res, next) {
    let mongoQ = Site.find({});
    if(req.query.limit) {
        mongoQ.limit(parseInt(req.query.limit));
    }
    if(req.query.skip) {
        mongoQ.skip(parseInt(req.query.skip));
    }
    if (req.query.city) {
        mongoQ.where('city', new RegExp(req.query.city, 'i') );
    }
    if (req.query.state) {
        mongoQ.where('state', req.query.state);
    }
    if (req.query.name) {
        mongoQ.where('historicName', req.query.name);
    }
    mongoQ.exec(function (err, sites) {
        if (err) return next(err);
        res.json(sites);
    });
});

/* GET SITES NEAR GEOLOCATION */
router.get('/nearby', function (req, res, next) {
    console.log('nearby route');
    const milesToMeters = (miles) => {
        return miles * 1609.344;
    }
    let miles = 5;
    if (req.query.miles) {
        miles = req.query.miles;
    }
    let geometry = {
        type: "Point",
        coordinates: [-91.202601, 47.993068]
    };
    if(req.query.point) {
        let points = req.query.point.split(',');
        geometry.coordinates[0] = Number(points[0]);
        geometry.coordinates[1] = Number(points[1]);
    }
    if (req.body && req.body.geometry) {
        geometry = req.body.geometry;
    }

    Site.find(
        {
            location: {
                $near: {
                    $maxDistance: milesToMeters(miles),
                    $geometry: geometry
                }
            }
        },
        function (err, sites) {
            if (err) return next(err);
            res.send(sites);
        });
});

/* GET SINGLE SITE BY ID */
router.get('/:id', function (req, res, next) {
    console.log('id route');
    Site.findOne({'ref': req.params.id}, function (err, site) {
        if (err) return handleError(err);
        res.send(site);

    });
});

// /* SAVE SITE */
router.post('/', jwtCheck, guard, function (req, res, next) {
    Site.create(req.body, function (err, site) {
        if (err) return next(err);
        res.json(site);
    });
});

// /* UPDATE SITE */
router.put('/:id', jwtCheck, guard, function (req, res, next) {
    console.log(req.body);
    let query = { ref:  parseInt(req.params.id)};
    Site.findOneAndUpdate(query, req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

// /* DELETE Site */
router.delete('/:id', function (req, res, next) {
    let query = { ref:  parseInt(req.params.id)};
    Site.findOneAndRemove(query, req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

module.exports = router;
