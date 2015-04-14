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
    };
  }

  return function (module) {
    var config;
    config = {
      data: {
        x: module.axes.x.label,
        columns: module.table.data
      },
      axis: {
        x: {
          type: 'category',
          tick: {
            culling: {
              max: 10
            },
            centered: true,
            format: function (x) {
              var dateCol = module.table.data[0];
              return moment(dateCol[parseInt(x+1)]).format('D MMMM YYYY');
            }
          }
        }
      },
    };

    if (_.contains(['single_timeseries', 'user_satisfaction_graph', 'realtime'], module.moduleConfig['module-type'])) {
      var newSeries,
        newX,
        newY;
      newX = _.map(module.table.data[0].slice(1), function(datum) {
        return moment(datum).valueOf();
      });
      newY = module.table.data[1].slice(1);

      newY = _.map(newY, function(datum, index) {
        if (!datum) {
          datum = _.find(newY.slice(index), function (datum) {
            return datum;
          }) || parseFloat(calculateAverage(newY));
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
