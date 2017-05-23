'use strict';

const express = require('express');
const service = express();
const request = require('superagent');
const moment = require('moment');

module.exports = (config) => {
    const log = config.log();

    service.get('/service/:location', (req, res, next) => {

        request.get(`https://maps.googleapis.com/maps/api/geocode/json`)
            .query({ address: req.params.location })
            .query({ key: config.googleGeoApiKey })
            .end((err, geoResult) => {

                if (err) {
                    return next(err);
                }

                const location = geoResult.body.results[0].geometry.location;

                request.get(`http://api.openweathermap.org/data/2.5/weather`)
                
                    .query({ lat: `${location.lat}` })
                    .query({ lon: `${location.lng}` })
                    .query({ APPID: config.openWeatherApiKey })
                    .end((err, weatherResult) => {

                        if (err) {
                            return next(err);
                        }

                        const result = weatherResult.body;
                        const tempInCelsius = (parseFloat(result.main.temp) - 273.15).toFixed(2);
                        const weatherString = `${result.weather[0].main}. It has ${result.weather[0].description} and ${tempInCelsius}°C.`;

                        return res.json({result: weatherString});

                    })

            });


    });
    return service;
};