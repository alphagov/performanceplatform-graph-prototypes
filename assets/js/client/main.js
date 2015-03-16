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
  var chart;
  chart = c3.generate(_.extend({
    bindto: '.js-chart'
  }, transformForC3(module)));
});

function transformForC3 (module) {
  var x = ['_id'],
    y = ['Unique visitors'];
  _.each(module.dataSource.data, function(datum) {
    x.push(new Date(datum._id));
    y.push(datum.unique_visitors);
  });

  return {
    data: {
      x: '_id',
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
            return moment(x).format('ddd h:mm');
          }
        }
      }
    }
  };
}
