var express = require('express');
var router = express.Router();
var api_helper = require('../javascripts/api_helper.js') //js?

var app = express()
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));




/* GET contact listing. */
router.post('/register', function (req, res, next) {
  let nombre = req.body.nombre
  let contraseña = req.body.contraseña


  // nombre, ciudad, longitud, latitud, telefono
  api_helper.getConnection()
    .then(
      con => {
        return api_helper.registerUsuario(con, nombre, contraseña)
      })
    .then(result => {
      for (ele in result) console.log(ele)
      if (result[0].affectedRows > 0)
        res.send(nombre)
      else
        res.send('Error al registrar usuario')
    }
    )
    .catch(error => { console.log(error) })
});



router.post('/login', function (req, res, next) {
  let nombre = req.body.nombre
  let contraseña = req.body.contraseña
  console.log(contraseña)
  // nombre, ciudad, longitud, latitud, telefono
  api_helper.getConnection()
    .then(
      con => {
        let data = api_helper.loginUsuario(con, nombre, contraseña)
        con.end()
        return data;
      })
    .then(result => {
      console.log(result[0])
      //if(result[0]==contraseña)
      res.send(result[0]);
      /* for (ele in result) console.log(ele)
      if (result[0].affectedRows > 0)
        res.send('Negocio con nombre '+nombre+' editado')
      else
        res.send('Error al editar negocio') */
    }
    )
    .catch(error => { console.log(error) })
});

module.exports = router;

