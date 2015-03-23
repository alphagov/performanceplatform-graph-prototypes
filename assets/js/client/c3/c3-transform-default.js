define(['lodash', 'regressionLine'], function(_, regressionLine) {

  function calculateAverage (arr) {
    var sum = 0,
        count = 0;
      _.each(arr, function(value) {
          if (!_.contains([null, undefined], value)) {
              sum += value;
              count++;
          }
      });
      if (count === 0) {
          count = 1;
      }
    return (sum / count).toFixed(1);
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
    point: {
        r: 0,
      focus: {
        expand: {
          enabled: true,
            r: 5
        }
      }
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

    if (_.contains(['single_timeseries', 'user_satisfaction_graph', 'realtime'], module.moduleConfig['module-type'])) {
      var newSeries,
        newX,
        newY;
      newX = _.map(xValues.slice(1), function(datum) {
        return moment(datum).valueOf();
      });
      newY = yValues.slice(1);

      newY = _.map(newY, function(datum, index) {
        if (!datum) {
          datum = _.find(newY.slice(index), function(datum) { return datum; }) || parseFloat(calculateAverage(newY));
        }
        return datum;
      });
      newSeries = regressionLine(newX, newY)[1];
      newSeries.unshift('Average');
      config.data.columns.push(newSeries);
    }

    return config;
  };

});
