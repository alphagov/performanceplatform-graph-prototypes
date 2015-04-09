requirejs.config({
  baseUrl: './',
  paths: {
    nvd3: 'vendor/nvd3/nv.d3',
    d3: 'vendor/d3/d3',
    lodash: 'vendor/lodash/index',
    moment: 'vendor/moment/moment',
    jquery: 'vendor/jquery/dist/jquery',
    nvd3Transforms: 'assets/js/client/nvd3/nvd3-transforms'
  },
  shim: {
    nvd3: {
      deps: ['d3'],
      exports: 'nv'
    }
  }
});

define(['d3', 'nvd3', 'lodash', 'moment', 'jquery', 'nvd3Transforms'], function (d3, nv, _, moment, $, nvd3Transforms) {

  function renderGraph (module, el) {
    var graph;
    try {

      nv.addGraph(function() {
        var chart = nv.models.lineChart()
          .options({
            transitionDuration: 300
          });

        chart.xScale(d3.time.scale());
        chart.yAxis
          .axisLabel('Voltage (v)')
          .tickFormat(d3.format(',.2f'))
        ;
        var newData = nvd3Transforms(module);
        d3.select(el).append('svg')
          .datum(newData)
          .call(chart);
        nv.utils.windowResize(chart.update);
        return chart;
      });

    } catch (err) {
      document.querySelector('.js-module-' + module.index + ' .js-module-heading').setAttribute('style', 'color: red');
      console.error(err);
    }
    return graph;
  }

  function graphSize (el) {
    $(el).find('svg')
      .attr('preserveAspectRatio', 'xMinYMin')
      .attr('viewBox', '0 0 ' + $(el).outerWidth() + ' ' + $(el).outerHeight());
  }


  window.graphs = {};
  _.each(dashboardAndData.modules, function (module) {
    var outer = document.querySelector('.js-module-' + module.index),
      inner = outer.querySelector('.js-module-inner'),
      graph;

    if (!$(outer).hasClass('module-kpi') &&
      (module.moduleConfig['module-type'] !== 'grouped_timeseries')) {
      graph = renderGraph(module, inner);
      graphSize(inner);
      window.graphs[module.index] = graph;
    }

  });
});

