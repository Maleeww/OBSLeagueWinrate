var express = require('express');
var apirouter = require('./routes/api_router');
var dbrouter = require('./routes/db_router');
var adjustrouter = require('./routes/adjust_router');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use('/api', apirouter);
app.use('/db', dbrouter);
app.use('/adjust', adjustrouter);
app.use(express.static('public'));
/* app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
}); */

const port = 25564;
const server = app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});

module.exports = app;