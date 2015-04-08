define(['c3TransformDefault', 'lodash'], function(c3TransformDefault, _) {
  return function (module) {
    var config;
    switch (module.moduleConfig['module-type']) {
      default:
        config = c3TransformDefault(module);
    }
    return _.extend({
      point: {
        show: false
      },
      legend: {
        position: 'right'
      }
    }, config);
  };

});
