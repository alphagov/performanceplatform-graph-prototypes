var regressionLine = require('./regression-line');
var _ = require('lodash');
var moment = require('moment');
var formatter = require('performanceplatform-client.js').formatter;

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

module.exports = function (module) {
  var config;

  // var titles = _.map(module.table.data, function (col) {
  //   return _.first(col);
  // });
  console.log(titles);

  config = {
    data: {
      x: module.axes.x.label,
      columns: module.table.data
      // groups : [titles]
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
            if (module.moduleConfig['module-type'] === 'realtime'){
              return moment(dateCol[parseInt(x+1)]).format('h:mm a');
            }
            else {
              return moment(dateCol[parseInt(x+1)]).format('D MMM YYYY');
            }
          },
          width: 100
        }
      },
      y: {
        tick: {
          format: function (y) {
            return formatter.format(y, module.axes.y[0].format);
          }
        },
        min: 0
      }
    }
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
    //average line currently left out so appearance is similar to previous dashboards
    //config.data.columns.push(newSeries);
  }

  return config;
};
