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
        if (module.moduleConfig['module-type'] === 'kpi') {
          dashboardAndData.modules[index] = _.extend(new Delta(module), {
            index: index,
            isKPI: true
          });
        }
        module.index = index;
        module.table = new Table(module, {formatDates: false});
      });
      return dashboardAndData;
    });
  }
};