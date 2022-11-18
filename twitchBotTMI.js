const tmi = require('tmi.js');
require('dotenv').config();

const client = new tmi.Client({
  options: { debug: true },
  connection: {
    secure: true,
    reconnect: true
  },
  identity: {
    username: 'maleeww_bot',
    password: process.env.TWITCH_OAUTH_TOKEN
  },
  channels: ['maleeww_bot']
});

client.connect();

client.on('message', (channel, tags, message, self) => {
  // Ignore echoed messages.
  if(self) return;

  if(message.toLowerCase() === '!hello') {
    client.say(channel, `/goal`);
  }
});