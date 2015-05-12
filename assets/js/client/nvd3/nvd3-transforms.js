var moment = require('moment');
var _ = require('lodash');

function transposeArrays (arrays) {
  var newArrays = [],
    colsArray = [];

  _.each(arrays, function(series, rowIndex) {
    var col = series.shift();
    colsArray.push(col);
    _.each(series, function(datum, index) {
      if (newArrays.length <= index) {
        newArrays.push([]);
      }
      if (newArrays[index].length <= rowIndex) {
        newArrays[index].push([]);
      }
      if (datum === null) {
        series[index] = 0;
      }
      newArrays[index][rowIndex] = datum;
    });
  });

  return newArrays;
}

module.exports =  function (module) {
  if (module.table) {
    module.table.data = transposeArrays(module.table.data);
  }

  var x = (_.isArray(module.axes.x)) ? module.axes.x[0] : module.axes.x,
    y = module.axes.y[0];

  _.each(module.table.data, function(datum) {

    datum.x = moment(datum[0]).valueOf();
    datum.y = datum[1];
  });

  return [{
    values: module.table.data,
    key: y.label,
    color: '#0f7f0e ',
    strokeWidth: 4,
    classed: 'dashed'
  }];
};