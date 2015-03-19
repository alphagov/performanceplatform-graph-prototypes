var _ = require('lodash'),
  Dashboard = require('performanceplatform-client.js').Dashboard,
  Table = require('performanceplatform-client.js').Table,
  Delta = require('performanceplatform-client.js').Delta;

module.exports = {
  fetchData: function (slug) {
    var dashboard = new Dashboard(slug);
    return dashboard.resolve().then(function(dashboardAndData) {
      dashboardAndData.moduleTables = [];
      _.each(dashboardAndData.modules, function(module, index) {
        var moduleTable;
        if (module.moduleConfig['module-type'] === 'grouped_timeseries') {
          dashboardAndData.modules[index] = _.extend(new Table(module), {index: index});
        } else if (module.moduleConfig['module-type'] === 'kpi') {
          dashboardAndData.modules[index] = _.extend(new Delta(module), {
            index: index,
            isKPI: true
          });
        } else {
          module.index = index;
        }
        moduleTable = _.extend(new Table(module), {index: index});
        moduleTable.data = transposeArrays(moduleTable.data);
        dashboardAndData.moduleTables.push(moduleTable);
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

  newArrays.unshift(colsArray);
  return newArrays;
}
