requirejs.config({
  baseUrl: './',
  paths: {
    lodash: 'vendor/lodash/lodash',
    jquery: 'vendor/jquery/dist/jquery'
  }
});

define(['lodash', 'jquery'], function (_, $) {
  _.each(dashboardAndData.moduleTables, function(module) {
    var data,
      el = document.querySelector('.js-chart-' + module.index);

    try {
      data = new google.visualization.arrayToDataTable(module.data);
      var chart = new google.visualization.LineChart(el);
      chart.draw(data, {
        width: $(el).outerWidth(),
        height: $(el).outerHeight(),
        hAxis: {
          baseline: 0
        }
      });

    } catch (err) {
      document.querySelector('.js-chart-heading-' + module.index).setAttribute('style', 'color: red');
      console.error(err);
    }
  });
});

