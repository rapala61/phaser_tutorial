var express = require('express');
var app = express();
var indexRouter = require('./routes/index.js');

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use('/', indexRouter);

app.listen(8081, function() {
  console.log("listening at port: 8081");
})
