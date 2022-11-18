var express = require('express');
var router = express.Router();
var api_helper = require('../javascripts/api_helper.js') //js?

var app = express()
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));


//router.get('/getLastGameId', function (req, res, next) {
router.post('/getLastGameId', function (req, res, next) {
  api_helper.getLastGameId(req.body.puuid, req.body.region)
    .then(data => { console.log("Last game id: "+data); res.send(data); })
    .catch(error => { console.log(error) })
});

//router.get('/apiCheckLastResult', function (req, res, next) {
router.post('/apiCheckLastResult', function (req, res, next) {
  api_helper.apiCheckLastResult(req.body.puuid, req.body.region)
    .then(data => {
      res.send(''+data); })

    
    .catch(error => { console.log(error) })
});

router.post('/setSummonerName', function (req, res, next) {
  let nombre = req.body.nombre
  // nombre, ciudad, longitud, latitud, telefono

  return api_helper.setSummonerName(nombre)
});


router.post('/setApiKey', function (req, res, next) {
  let api = req.body.api
  // nombre, ciudad, longitud, latitud, telefono

  return api_helper.setApiKey(api)
    .catch(error => { console.log(error) })
});

router.post('/setRegion', function (req, res, next) {
  let region = req.body.region
  // nombre, ciudad, longitud, latitud, telefono

  return api_helper.setRegion(region)
    .catch(error => { console.log(error) })
});

router.post('/apiInit', function (req, res, next) {
  //let region = req.body.region
  // nombre, ciudad, longitud, latitud, telefono

  api_helper.apiInit(req.body.summonerName, req.body.region)
  .then(data => res.send(data))
  .catch(error => { console.log(error) })

});



module.exports = router;

