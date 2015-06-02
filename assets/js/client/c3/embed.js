var c3 = require('c3');
var _ = require('lodash');
var c3Transforms = require('./c3-transforms');
var $ = require('jquery');
var Module = require('performanceplatform-client.js').Module;
var Table = require('performanceplatform-client.js').Table;

var bundlePath = '{{host}}/embed.js';

var scriptTags = document.getElementsByTagName('script');
_.each(scriptTags, function (scriptTag) {
  if (scriptTag.src.indexOf(bundlePath) !== -1) {
    // add the style tag into the head (once only)
    if(!PerformancePlatform.styleTags) {
      PerformancePlatform.styleTags = [];
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

    var moduleConfig = scriptTag.src.split('?module=')[1];
    var config = global.PerformancePlatform.moduleConfig[moduleConfig];
    var idConfig = moduleConfig.replace('/', '-');

    if (!config.loaded) {
      config.loaded = true;
      var module = new Module(config);

      var $embedEl = $('<div class="' + idConfig + '-graph" class="cleanslate module"></div>');

      module.resolve().then(function (moduleData) {
        moduleData.table = new Table(module, {formatDates: false});
        $($embedEl).insertBefore('#' + moduleConfig.replace('/', '-'));

        var graph = renderGraph(moduleData, $embedEl[0]);
        graphSize($embedEl[0]);

        //fix tick issues
        $embedEl.find('.tick').each(function (index) {
          if ($(this).find('text').is(':hidden')) {
            $(this).find('line').hide();
            $(this).find('text').css('width', 100);
          }
        });
      });
    }
  }
});

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
