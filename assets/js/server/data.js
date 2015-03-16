var _ = require('lodash'),
  Dashboard = require('performanceplatform-client.js').Dashboard,
  Module = require('performanceplatform-client.js').Module,
  Delta = require('performanceplatform-client.js').Delta;

module.exports = {
  fetchData: function (slug) {
    var dashboard = new Dashboard(slug);
    return dashboard.resolve();
  }
};
