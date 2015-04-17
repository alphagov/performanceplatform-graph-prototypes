var d3 = require('d3');
var c3 = require('c3');
var _ = require('lodash');
var moment = require('moment');
var c3Transforms = require('./c3-transforms');
var regressionLine = require('./regression-line');
var $ = require('jquery');


function renderGraph(module, el) {
  var graph;
  try {
    graph = c3.generate(_.extend({
      bindto: el,
      size: {
        width: $(el).outerWidth(),
        height: $(el).outerHeight()
      },
      onresize: function() {
        graph.resize({
          width: $(el).outerWidth(),
          height: $(el).outerHeight()
        });
      }
    }, c3Transforms(module)));
  } catch (err) {
    document.querySelector('.js-module-' + module.index + ' .js-module-heading').setAttribute('style', 'color: red');
    console.error(err);
  }
  return graph;
}

function graphSize(el) {
  $(el).find('svg')
    .attr('preserveAspectRatio', 'xMinYMin')
    .attr('viewBox', '0 0 ' + $(el).outerWidth() + ' ' + $(el).outerHeight());
}

function setupTypeSwitcher(graph, container) {
    $(container).find('input[type="radio"]').on('change', function() {
       var newType = $(this).val();
        graph.transform(newType);
    });
}

window.graphs = {};

_.each(dashboardAndData.modules, function (module) {
  var outer = document.querySelector('.js-module-' + module.index),
    inner = outer.querySelector('.js-module-inner'),
      graph;

  if (!$(outer).hasClass('module-kpi')) {
    graph = renderGraph(module, inner);
    graphSize(inner);
      setupTypeSwitcher(graph, outer);
      window.graphs[module.index] = graph;
  }

  //fix tick issues
  $(inner).find('.tick').each(function (index) {
    if ($(this).find('text').is(':hidden')) {
      $(this).find('line').hide();
      $(this).find('text').css('width', 100);
    }
  });

});
