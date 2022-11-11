var express = require('express');
var router = express.Router();
var adjust_helper = require('./adjust_helper.js') //js?

var app = express()
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));



router.get('/win', function (req, res, next) {

  adjust_helper.win(req.query.id)
  //.then(data => res.send(data))
  .catch(error => { console.log(error); console.error(error) })
});

router.get('/lose', function (req, res, next) {

  adjust_helper.lose(req.query.id)
  //.then(data => res.send(data))
  .catch(error => { console.log(error); console.error(error) })

});

router.get('/reset', function (req, res, next) {

  adjust_helper.lose(req.query.id)
  //.then(data => res.send(data))
  .catch(error => { console.log(error); console.error(error) })

});

// 9f9c73d.online-server.cloud:25564/api/win?id=NSX


module.exports = router;

