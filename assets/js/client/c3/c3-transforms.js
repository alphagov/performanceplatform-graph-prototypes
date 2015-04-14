define(['c3TransformDefault', 'lodash'], function(c3TransformDefault, _) {
  return function (module) {
    var config;
    switch (module.moduleConfig['module-type']) {
      default:
        config = c3TransformDefault(module);
    }
    return _.extend({
      point: {
        show: true,
        r: 1,
        focus: {
          expand: {
            r: 5
          }
        }
      },
      legend: {
        position: 'right'
      },
      color: {
        pattern: ['#097F96', '#112684', '#ffbb78', '#2ca02c', '#98df8a', '#d62728', '#ff9896', '#9467bd']
      }
    }, config);
  };

});
