var express = require('express'),
  app = express(),
  data = require('./assets/js/server/data'),
  _ = require('lodash');

app.use('/performance/assets', express.static('assets'));
app.use('/performance/vendor', express.static('node_modules'));

app.set('view engine', 'html');
app.enable('view cache');
app.engine('html', require('hogan-express'));

function routeHandler (req, res) {
  data.fetchData(req.params.slug).then(function (dashboardAndData) {
    res.locals = {
      useC3: req.query.lib === 'c3',
      useGoogleCharts: req.query.lib === 'gc',
      useNVD3: req.query.lib === 'nvd3',
      dashboardAndData: dashboardAndData,
      escapedData: JSON.stringify(dashboardAndData)
    };
    res.render('index');
  });
}

app.get('/performance/:slug', routeHandler);

app.listen(process.env.PORT || 5000);
