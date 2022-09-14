const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});

const port = 25564;
const server = app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});