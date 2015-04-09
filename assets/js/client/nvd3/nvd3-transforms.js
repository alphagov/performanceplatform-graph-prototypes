define(['moment', 'lodash'], function(moment, _) {
  return function (module) {

    var x = (_.isArray(module.axes.x)) ? module.axes.x[0] : module.axes.x,
      y = module.axes.y[0];

    _.each(module.data, function(datum) {

      datum.x = moment(datum[0]).valueOf();
      datum.y = datum[1];
    });

    return [{
      values: module.data,
      key: y.label,
      color: '#0f7f0e ',
      strokeWidth: 4,
      classed: 'dashed'
    }];

  };

});