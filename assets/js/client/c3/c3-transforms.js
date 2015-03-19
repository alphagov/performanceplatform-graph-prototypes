define(['c3TransformDefault', 'c3TransformGrouped'], function(c3TransformDefault, c3TransformGrouped) {
  return function (module) {
    switch (module.moduleConfig['module-type']) {
      case 'grouped_timeseries':
        return c3TransformGrouped(module);
      default:
        return c3TransformDefault(module);
    }
  };

});
