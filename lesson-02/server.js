var express = require('express'); // Подключаем express
var app = express(); // В app теперь лежит функционал нашего веб-сервера

// Считаем корнем нашего локального сайта папку public
app.use(express.static('public'));

app.use(function log (req, res, next) {
  console.log([req.method, req.url].join(' '));
  next();
});

// Слушаем на порту 3333 и сообщаем об этом console.log'ом
app.listen(3333, function() {
  console.log('Listening on 3333..');
});
