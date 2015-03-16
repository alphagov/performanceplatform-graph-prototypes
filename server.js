var express = require('express'),
  app = express(),
  data = require('./assets/js/server/data'),
  _ = require('lodash');

app.use('/assets', express.static('assets'));
app.use('/vendor', express.static('node_modules'));

app.set('view engine', 'html');
app.enable('view cache');
app.engine('html', require('hogan-express'));

function index_html (req, res) {
  data.fetchData().then(function (dashboardAndData) {
    dashboardAndData.modules = _.reject(dashboardAndData.modules, function(module) {
      return module.moduleConfig['module-type'] === 'grouped_timeseries';
    });
    _.each(dashboardAndData.modules, function(module, index) {
      module.index = index;
    });
    res.locals = {
      dashboardAndData: dashboardAndData,
      escapedData: JSON.stringify(dashboardAndData)
    };
    res.render('index');
  });
}

app.get('/', index_html);
app.get('/index.html', index_html);

app.listen(4000);
