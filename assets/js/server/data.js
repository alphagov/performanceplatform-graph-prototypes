var _ = require('lodash'),
  Dashboard = require('performanceplatform-client.js').Dashboard,
  Table = require('performanceplatform-client.js').Table;

module.exports = {
  fetchData: function (slug) {
    var dashboard = new Dashboard(slug);
    return dashboard.resolve().then(function(dashboardAndData) {
      _.each(dashboardAndData.modules, function(module, index) {
        if (module.moduleConfig['module-type'] === 'grouped_timeseries') {
          dashboardAndData.modules[index] = _.extend(new Table(module), {index: index});
        } else {
          module.index = index;
        }

      });
      return dashboardAndData;
    });
  }
};
