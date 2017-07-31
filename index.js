const express = require('express');
const app = express();

const request = require('request'); // "Request" library
const querystring = require('querystring');
const cookieParser = require('cookie-parser');

const client_id = '9d31379391e9446bbc42ec03fc4f213a'; // Your client id
const client_secret = '7ae195b2f58d4a54bdbeed581a44ec42'; // Your secret

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.use(express.static(__dirname + '/react-weather/dist'));
app.use(express.static(__dirname + '/reactify/dist'));

app.get('/reactify/spotify-server/refresh_token', function(req, res) {
  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
});

app.get('/weather/', function(req, res) {

  var appid = req.query.appid;
  var query = req.query.q;
  var options = {
    url: 'http://api.openweathermap.org/data/2.5/forecast?appid=' + appid + '&q='+ query +',in',
    json: true
  };

  request.get(options, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      res.send(response.body);
    }
  });
});


app.use('/react-weather', express.static(__dirname + '/react-weather/dist'));
app.use('/reactify', express.static(__dirname + '/reactify/dist'));

app.listen(3000, function () {
  console.log('React Incubator listening on port 3000!')
});
