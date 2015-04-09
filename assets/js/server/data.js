var _ = require('lodash'),
  Dashboard = require('performanceplatform-client.js').Dashboard,
  Table = require('performanceplatform-client.js').Table,
  Delta = require('performanceplatform-client.js').Delta;

module.exports = {
  fetchData: function (slug) {
    var dashboard = new Dashboard(slug);
    return dashboard.resolve().then(function(dashboardAndData) {
      _.each(dashboardAndData.modules, function(module, index) {
        var moduleTable;
        if (module.moduleConfig['module-type'] === 'kpi') {
          dashboardAndData.modules[index] = _.extend(new Delta(module), {
            index: index,
            isKPI: true
          });
        }
        module.index = index;
        module.table = new Table(module, {formatDates: false});
        module.data = transposeArrays(_.cloneDeep(module.table.data));
      });
      return dashboardAndData;
    });
  }
};

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