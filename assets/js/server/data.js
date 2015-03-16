var _ = require('lodash'),
  Dashboard = require('performanceplatform-client.js').Dashboard,
  Module = require('performanceplatform-client.js').Module,
  Delta = require('performanceplatform-client.js').Delta;

module.exports = {
  fetchData: function () {
    var dashboard = new Dashboard('carers-allowance');
    return dashboard.resolve();
  }
};
