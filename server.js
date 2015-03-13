var app, browserify, express, path;

express = require('express');
path = require('path');
browserify = require('browserify-middleware');

app = express();

app.set('views', __dirname);
app.set('view engine', 'jade');
app.use('/app.js', browserify('./js/app.js'));
app.use(require('less-middleware')(path.join(__dirname, 'less')));
app.use(express["static"](__dirname));

app.use(function(req, res) {
  return res.status(404).send('Not found');
});

if (require.main === module) {
  app.listen(process.env.PORT || 3000);
} else {
  module.exports = app;
}
