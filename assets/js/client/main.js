requirejs.config({
  baseUrl: './',
  paths: {
    c3: 'vendor/c3/c3',
    d3: 'vendor/d3/d3',
    lodash: 'vendor/lodash/lodash',
    moment: 'vendor/moment/moment',
    c3Transforms: 'assets/js/client/c3-transforms/c3-transforms',
    c3TransformDefault: 'assets/js/client/c3-transforms/c3-transform-default',
    c3TransformGrouped: 'assets/js/client/c3-transforms/c3-transform-grouped'
  }
});

define(['d3', 'c3', 'lodash', 'moment', 'c3Transforms'], function (d3, c3, _, moment, c3Transforms) {
  _.each(dashboardAndData.modules, function(module) {
    try {
      c3.generate(_.extend({
        bindto: '.js-chart-' + module.index
      }, c3Transforms(module)));
    } catch (err) {
      document.querySelector('.js-chart-heading-' + module.index).setAttribute('style', 'color: red');
      console.error(err);
    }
  });
});

