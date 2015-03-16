define([], function() {
  return function (module) {
    var x = [],
      y = [],
      xKey = (typeof module.axes.x.key === 'string') ? module.axes.x.key : module.axes.x.key[0],
      yKey = module.axes.y[0].key;

    x.push(xKey);
    y.push(yKey);
    _.each(module.dataSource.data, function(datum) {
      x.push(new Date(datum[xKey]));
      y.push(datum[yKey]);
    });

    return {
      data: {
        x: xKey,
        columns: [
          x,
          y
        ]
      },
      axis: {
        x: {
          type: 'timeseries',
          tick: {
            format: function (x) {
              return moment(x).format('YYYY-MM-DD - h:mm');
            }
          }
        }
      }
    };
  };

});
