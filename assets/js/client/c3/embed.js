var c3 = require('c3');
var _ = require('lodash');
var c3Transforms = require('./c3-transforms');
var $ = require('jquery');
var Module = require('performanceplatform-client.js').Module;
var Dashboard = require('performanceplatform-client.js').Dashboard;
var Table = require('performanceplatform-client.js').Table;

var bundlePath = '{{host}}/embed.js';

var scriptTags = document.getElementsByTagName('script');

if(!global.PerformancePlatform) {
  global.PerformancePlatform = {};
  global.PerformancePlatform.moduleConfig = [];
}

_.each(scriptTags, function (scriptTag) {
  if (scriptTag.src.indexOf(bundlePath) !== -1) {
    // add the style tag into the head (once only)
    if(!global.PerformancePlatform.styleTags) {
      global.PerformancePlatform.styleTags = [];
    }
    var styleTags = PerformancePlatform.styleTags;

    if(styleTags.length === 0) {
      // add a style tag to the head
      var styleTag = document.createElement("link");
      styleTag.rel = "stylesheet";
      styleTag.type = "text/css";
      styleTag.href =  "{{host}}/performance/assets/css/bundle.css";
      styleTag.media = "all";
      document.getElementsByTagName('head')[0].appendChild(styleTag);
      styleTags.push(styleTag);
    }

    var dashboardAndModuleName = scriptTag.src.split('?module=')[1];

    if (dashboardAndModuleName.indexOf('&ref=') !== -1) {
      dashboardAndModuleName = dashboardAndModuleName.split('&ref=')[0];
    }

    var config = global.PerformancePlatform.moduleConfig[dashboardAndModuleName];

    if (!config) {
      global.PerformancePlatform.moduleConfig[dashboardAndModuleName] = {
        loaded: true
      };
      var dashboardName = dashboardAndModuleName.split('/')[0];
      var moduleName = dashboardAndModuleName.split('/')[1];
      var dashboard = new Dashboard(dashboardName);
      dashboard.getConfig().then(function (dashboardConfig) {
        var moduleConfig = _.where(dashboardConfig.modules, {'slug': moduleName})[0];
        global.PerformancePlatform.moduleConfig[dashboardAndModuleName] = moduleConfig;
        createModule(global.PerformancePlatform.moduleConfig[dashboardAndModuleName],
          dashboardAndModuleName, dashboardConfig);
      });
    } else {
      if (!config.loaded) {
        createModule(config, dashboardAndModuleName);
      }
    }
  }
});

function createModule(moduleConfig, dashboardAndModuleName, dashboardConfig) {
  moduleConfig.loaded = true;
  var idConfig = dashboardAndModuleName.replace('/', '-');
  var module = new Module(moduleConfig);

  var $embedEl = $('<div id="' + idConfig + '-container"></div>');

  if (dashboardConfig) {
    $embedEl.append('<h1>' + dashboardConfig.title + '</h1>');
  }

  $embedEl.append('<h2>' + moduleConfig.title + '</h2><div id="' + idConfig + '-graph"></div></div>');

  module.resolve().then(function (moduleData) {
    moduleData.table = new Table(module, {formatDates: false});
    $($embedEl).insertBefore('#' + idConfig);

    var graphId = $('#' + idConfig + '-graph')[0];
    var graph = renderGraph(moduleData, graphId);
    graphSize(graphId);

    //fix tick issues
    $embedEl.find('.tick').each(function (index) {
      if ($(this).find('text').is(':hidden')) {
        $(this).find('line').hide();
        $(this).find('text').css('width', 100);
      }
    });
  });
}

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
