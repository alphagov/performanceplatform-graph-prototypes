define([], function() {
  return function (module) {
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
      },
        grid: {
            x: {
                lines: [
                    {value: 19, text: 'Publicity', class: 'annotation-positive'},
                    {value: 39, text: 'Christmas period', class: 'annotation-negative'}
                ]
            }
        }
    };
  };

});
