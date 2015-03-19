requirejs.config({
  baseUrl: './',
  paths: {
    c3: 'vendor/c3/c3',
    d3: 'vendor/d3/d3',
    lodash: 'vendor/lodash/lodash',
    moment: 'vendor/moment/moment',
    c3Transforms: 'assets/js/client/c3/c3-transforms',
    c3TransformDefault: 'assets/js/client/c3/c3-transform-default',
    c3TransformGrouped: 'assets/js/client/c3/c3-transform-grouped',
    jquery: 'vendor/jquery/dist/jquery'
  }
});

define(['d3', 'c3', 'lodash', 'moment', 'c3Transforms', 'jquery'], function (d3, c3, _, moment, c3Transforms, $) {

  function renderGraph(module, el) {
    try {
      c3.generate(_.extend({
        bindto: el,
        size: {
          width: $(el).outerWidth(),
          height: $(el).outerHeight()
        }
      }, c3Transforms(module)));
    } catch (err) {
      document.querySelector('.js-module-' + module.index + ' .js-module-heading').setAttribute('style', 'color: red');
      console.error(err);
    }
  }
  _.each(dashboardAndData.modules, function(module) {
    var outer = document.querySelector('.js-module-' + module.index),
      inner = outer.querySelector('.js-module-inner');

    if ($(outer).hasClass('module-kpi')) {

    } else {
      renderGraph(module, inner);
    }

  });
});

