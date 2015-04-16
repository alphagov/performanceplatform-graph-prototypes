define(['lodash', 'regressionLine'], function(_, regressionLine) {
  function calculateAverage (arr) {
    var sum = 0,
        count = 0;
      _.each(arr, function(value) {
          if (!_.contains([null, undefined], value)) {
              sum += value;
              count++;
          }
      });
      if (count === 0) {
          count = 1;
      }
    return (sum / count).toFixed(1);
  }

  return function (module) {
    var config;
    config = {
      data: {
        x: module.axes.x.label,
        columns: module.table.data
      },
      axis: {
        x: {
          type: 'category',
          tick: {
            culling: {
              max: 10
            },
            centered: true,
            format: function (x) {
              var dateCol = module.table.data[0];
              return moment(dateCol[parseInt(x+1)]).format('D MMMM YYYY');
            },
          }
        },
      },
       tooltip:{
           contents: function (d, defaultTitleFormat, defaultValueFormat, color, value) {
            console.trace(d);
            console.trace("default" + defaultTitleFormat);
            console.trace("values" + d[0].value)
            if(module.table.data.length <= 2){
              return (d[0].value);
            }
            else
            var $$ = this, config = $$.config,
            titleFormat = config.tooltip_format_title || defaultTitleFormat,
            nameFormat = config.tooltip_format_name || function (name) { return name; },
            valueFormat = config.tooltip_format_value || defaultValueFormat,
            text, i, title, value, name, bgcolor;
            for (i = 0; i < d.length; i++) {
              if (! (d[i] && (d[i].value || d[i].value === 0))) { continue; }

              if (! text) {
                title = titleFormat ? titleFormat(d[i].x) : d[i].x;
                text = "<table class='" + $$.CLASS.tooltip + "'>" + (title || title === 0 ? "<tr><th colspan='2'>" + title + "</th></tr>" : "");
              }

              name = nameFormat(d[i].name);
              value = valueFormat(d[i].value, d[i].ratio, d[i].id, d[i].index);
              bgcolor = $$.levelColor ? $$.levelColor(d[i].value) : color(d[i].id);

              text += "<tr class='" + $$.CLASS.tooltipName + "-" + d[i].id + "'>";
              text += "<td class='name'><span style='background-color:" + bgcolor + "'></span>" + name + "</td>";
              text += "<td class='value'>" + value + "</td>";
              text += "</tr>";
            }
            return text + "</table>";

          },
        },
    };

    if (_.contains(['single_timeseries', 'user_satisfaction_graph', 'realtime'], module.moduleConfig['module-type'])) {
      var newSeries,
        newX,
        newY;
      newX = _.map(module.table.data[0].slice(1), function(datum) {
        return moment(datum).valueOf();
      });
      newY = module.table.data[1].slice(1);

      newY = _.map(newY, function(datum, index) {
        if (!datum) {
          datum = _.find(newY.slice(index), function (datum) {
            return datum;
          }) || parseFloat(calculateAverage(newY));
        }
        return datum;
      });
      newSeries = regressionLine(newX, newY)[1];
      newSeries.unshift('Average');
      //average line currently left out so appearance is similar to previous dashboards
      //config.data.columns.push(newSeries);
    }

    return config;
  };

});
