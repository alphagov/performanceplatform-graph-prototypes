define(['c3TransformDefault', 'c3TransformGrouped', 'lodash'], function(c3TransformDefault, c3TransformGrouped, _) {
  return function (module) {
    var config;
    switch (module.moduleConfig['module-type']) {
      case 'grouped_timeseries':
        config = c3TransformGrouped(module);
        break;
      default:
        config = c3TransformDefault(module);
    }
    return _.extend({
      point: {
        show: false
      }
    }, config);
  };

});
