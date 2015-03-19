define([], function() {
  return function (module) {
    var x = [],
      y = [],
      xKey = (typeof module.axes.x.key === 'string') ? module.axes.x.key : module.axes.x.key[0];

    return {
      data: {
        x: 'Date',
        columns: module.data
      },
      axis: {
        x: {
          type: 'category',
          tick: {
            count: 8
          }
        }
      }
    };
  };

});
