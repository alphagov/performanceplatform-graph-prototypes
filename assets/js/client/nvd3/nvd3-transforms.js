define(['moment', 'lodash'], function(moment, _) {
  return function (module) {
    var xKey = (typeof module.axes.x.key === 'string') ? module.axes.x.key : module.axes.x.key[0],
      yKey = module.axes.y[0].key;

    _.each(module.dataSource.data, function(datum) {
      datum.x = moment(datum[xKey]).valueOf();
      datum.y = datum[yKey];
    });
    return [{
      values: module.dataSource.data,
      key: "Sine Wave",
      color: "#ff7f0e ",
      strokeWidth: 4,
      classed: 'dashed'
    }];
  };

});