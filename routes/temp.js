var express = require('express');
var router = express.Router();
var adjust_helper = require('../javascripts/adjust_helper.js') //js?
var path = require('path');
var app = express()
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

router.get('/queueSize', function (req, res) {

  // Con el '' lo casteamos a String
  res.send(''+adjust_helper.queueSize(req.query.name))
  //.then(data => console.log(data))
  //.catch(error => { console.log(error); console.error(error) })
});

router.get('/consume', function (req, res) {

  res.send(''+adjust_helper.consume(req.query.name))
  //.then(data => res.send(data))
  //.catch(error => { console.log(error); console.error(error) })
});

router.get('/win', function (req, res, next) {

  adjust_helper.win(req.query.id)
  res.send(200)
  //.then(data => res.send(data))
  //.catch(error => { console.log(error); console.error(error) })
});

router.get('/lose', function (req, res, next) {

  adjust_helper.lose(req.query.id)
//.then(data => res.send(data))
  res.send(200)
  //.catch(error => { console.log(error); console.error(error) })

});

router.get('/reset', function (req, res, next) {

  adjust_helper.reset(req.query.id)
  //.then(data => res.send(data))
  //.catch(error => { console.log(error); console.error(error) })
  res.send(200)


});

router.post('/registrarID', function (req, res, next) {

  //let result = adjust_helper.registrarID(req.query.id)
  //.then(data => res.send(data))
  //.catch(error => { console.log(error); console.error(error) })
  res.send(''+adjust_helper.registrarID(req.query.id))


})

router.get('/', function (req, res, next) {

  //let result = adjust_helper.registrarID(req.query.id)
  //.then(data => res.send(data))
  //.catch(error => { console.log(error); console.error(error) })
  //res.sendFile('/routes/index.txt')
  res.sendFile(path.join(__dirname, '../public', 'index.txt'));

})

// 9f9c73d.online-server.cloud:25564/api/win?id=NSX


module.exports = router;

