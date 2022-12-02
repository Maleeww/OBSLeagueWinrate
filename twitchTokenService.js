var express = require('express');
var twitchrouter = require('./routes/twitch_router');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use('/twitch', twitchrouter);
app.use(express.static('public'));


const port = 25563;
const server = app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});

module.exports = app;