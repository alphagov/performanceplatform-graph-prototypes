requirejs.config({
  baseUrl: './',
  paths: {
    c3: 'vendor/c3/c3',
    d3: 'vendor/d3/d3',
    lodash: 'vendor/lodash/lodash',
    moment: 'vendor/moment/moment'
  }
});

define(['d3', 'c3', 'lodash', 'moment'], function (d3, c3, _, moment) {
  _.each(dashboardAndData.modules, function(module) {

    c3.generate(_.extend({
      bindto: '.js-chart-' + module.index
    }, transformForC3(module)));
  });
});

function transformForC3 (module) {
  var x = [],
    y = [],
    xKey = (typeof module.axes.x.key === 'string') ? module.axes.x.key : module.axes.x.key[0],
    yKey = module.axes.y[0].key;

  x.push(xKey);
  y.push(yKey);
  _.each(module.dataSource.data, function(datum) {
    x.push(new Date(datum[xKey]));
    y.push(datum[yKey]);
  });

  return {
    data: {
      x: xKey,
      columns: [
        x,
        y
      ]
    },
    axis: {
      x: {
        type: 'timeseries',
        tick: {
          format: function (x) {
            return moment(x).format('YYYY-MM-DD - h:mm');
          }
        }
      }
    }
  };
}
