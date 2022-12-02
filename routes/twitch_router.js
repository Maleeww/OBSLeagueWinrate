var express = require('express');
var router = express.Router();
var twitch_helper = require('../javascripts/twitchToken_helper.js') //js?

var app = express()
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));




router.post('/registerToken', function (req, res, next) {
  //let region = req.body.region
  // nombre, ciudad, longitud, latitud, telefono

  twitch_helper.registerToken(req.body.channel, req.body.token, req.body.refresh_token)
  .then(data => {console.log(data);res.send(data)})
  .catch(error => { console.log(error) })

});
router.post('/sendAnnouncement', function (req, res, next) {
  //let region = req.body.region
  // nombre, ciudad, longitud, latitud, telefono

  twitch_helper.sendAnnouncement(req.body.channel, req.body.msg)
  .then(data => {console.log(data);res.send(data)})
  .catch(error => { console.log(error) })

});
router.post('/makePoll', function (req, res, next) {
  //let region = req.body.region
  // nombre, ciudad, longitud, latitud, telefono

  twitch_helper.makePoll(req.body.client_id, req.body.client_secret)
  .then(data => {console.log(data);res.send(data)})
  .catch(error => { console.log(error) })

});






module.exports = router;

