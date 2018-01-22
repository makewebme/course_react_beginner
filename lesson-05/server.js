var express = require('express');

var app = express();

app.use(express.static('public'));

app.use(function log (req, res, next) {
  console.log([req.method, req.url].join(' '));
  next();
});

app.listen(3333, function() {
  console.log('Listening on 3333..');
});
