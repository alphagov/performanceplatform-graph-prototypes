var express = require('express'),
  app = express(),
  data = require('./assets/js/server/data');

app.use('/assets', express.static('assets'));
app.use('/vendor', express.static('node_modules'));

app.set('view engine', 'html');
app.enable('view cache');
app.engine('html', require('hogan-express'));

function index_html (req, res) {
  data.fetchData().then(function (dashboardAndData) {
    var module = dashboardAndData.modules[3];
    res.locals = {
      title: module.title,
      module: JSON.stringify(module)
    };
    res.render('index');
  });
}

app.get('/', index_html);
app.get('/index.html', index_html);

app.listen(4000);
