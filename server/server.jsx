var express = require('express');
var path = require('path');
var bodyParser = require('body-parser')

// get db jses
// var dbUser = require('./api/user.jsx');

//create our app server
var app = express();
app.set('port', (process.env.PORT || 5000));

app.use(function(req, res, next){
  if (req.headers['x-forwarded-proto'] === 'https'){
    res.redirect('http://' + req.hostname + req.url);
  }else{
    next();
  }
});

// body-parser middleware for handling request variables
// create application/json parser
app.use(bodyParser.json());
// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: false }));

// for ajax request
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// public folder for the server
app.use(express.static('public'));

// check if app if url is looking for api
// app.use('/email', email);
//app.use('/api/user', dbUser);

// check if the url is looking for images
app.get(/\.(jpe?g|png|gif|svg)$/i, function (req, res) {
  res.sendFile(path.resolve(__dirname, req.originalUrl));
})

// check if the url is looking for fonts
app.get(/\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/, function (req, res) {
  var fileName = req.originalUrl.match(/(\w|\d)+\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/)[0];
  res.sendFile(path.resolve(__dirname, '../public/fonts', fileName));
  // res.sendFile(path.resolve(__dirname, req.originalUrl));
})

// Anything else redirect to react-router-dom
app.get("/*", handleRender);

function handleRender(req, res) {
  res.sendFile(path.resolve(__dirname, '../public', 'index.html'));
}

function sendTo404() {
  res.send('Error 404');
}

app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
});
