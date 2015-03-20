define([], function() {

  function calculateAverage (arr) {
    var average = _.reduce(arr, function(memo, num) {
        return memo + num;
      }, 0) / (arr.length === 0 ? 1 : arr.length);
    return average.toFixed(1);
  }

  function averageLineConfig (yValues) {
    var average = calculateAverage(yValues);
   return {
      y: {
        lines: [
          {value: average, text: 'Average: ' + average}
        ]
      }
    }
  }
  return function (module) {
    var config,
      xValues = [],
      yValues = [],
      xKey = (typeof module.axes.x.key === 'string') ? module.axes.x.key : module.axes.x.key[0],
      yKey = module.axes.y[0].key;

    xValues.push(xKey);
    yValues.push(yKey);
    _.each(module.dataSource.data, function(datum) {
      xValues.push(datum[xKey]);
      yValues.push(datum[yKey]);
    });

    config = {
      data: {
        x: xKey,
        xFormat: '%Y-%m-%dT%H:%M:%S+00:00', //2014-02-24T00:00:00+00:00
        columns: [
          xValues,
          yValues
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
        },
        y: {
            min: 0,
          tick: {
            format: function (y) {
              var f = parseFloat(y),
                i = parseInt(y);
              if (!isNaN(f) && (f !== i)) {
                return y.toFixed(1);
              } else {
                return y;
              }
            }
          }
        }
      }
    };

    if (module.moduleConfig['module-type'] === 'single_timeseries') {
      config.grid = averageLineConfig(yValues.slice(1));
    }
    return config;
  };

});
