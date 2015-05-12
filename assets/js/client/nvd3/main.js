var d3 = require('d3');
require('nvd3');
var _ = require('lodash');
var moment = require('moment');
var nvd3Transforms = require('./nvd3-transforms');
var $ = require('jquery');

function renderGraph (module, el) {
  var graph;
  nvd3 = window.nv;
  try {
    nvd3.addGraph(function() {
      var chart = nvd3.models.lineChart()
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
      nvd3.utils.windowResize(chart.update);
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

