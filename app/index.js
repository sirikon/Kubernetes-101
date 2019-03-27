const express = require('express');
const app = express();

const port = process.env.PORT || 3000;

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(port, '0.0.0.0', function () {
  console.log(`App listening on port ${port}!`);
});
