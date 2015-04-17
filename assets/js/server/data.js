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
        } else {
          //with the new graphs how should we visualise a user satisfaction graph?
          if (module.moduleConfig['module-type'] === 'user_satisfaction_graph') {
            module.axes.y = [module.axes.y[0]];
          }
          module.table = new Table(module, {formatDates: false});
        }
        
        module.index = index;
        
        // module.table.data = module.table.render();
        // module.data = transposeArrays(_.cloneDeep(module.table.data));
      });
      return dashboardAndData;
    });
  }
};