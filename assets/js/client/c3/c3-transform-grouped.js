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
                    {value: 40, text: 'Christmas period'}
                ]
            }
        }
    };
  };

});
