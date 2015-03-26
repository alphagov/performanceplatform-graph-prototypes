(function(global) {

  var mainUrl = '//localhost:5000/performance/assets/js/syndication/2.js';

  // Globals
  if(!global.PPGraph) { global.PPGraph = {}; }
  var PPGraph = global.PPGraph;

  // To keep track of which embeds we have already processed
  if(!PPGraph.foundEls) PPGraph.foundEls = [];
  var foundEls = PPGraph.foundEls;

  if(!PPGraph.settings) PPGraph.settings = [];
  var settings = PPGraph.settings;

  var els = document.getElementsByTagName('script');
  var re = /.*shootitlive\.load\.([^/]+\.)?js/;

  for(var i = 0; i < nEls; i++) {
    var el = els[i];

    if(el.src.match(re) && foundEls.indexOf(el) < 0) {
      foundEls.push(el);

      var info = utils.parseQueryString(el.src);

      // Create container div
      var d = document.createElement('div');
      var container = document.createElement('div');
      el.parentNode.insertBefore(container, el);
      info['container'] = container;

      settings.push(info);
    }
  }

  // Load main javascript
  var s = document.createElement('script');
  s.async = true; s.src = mainUrl;
  document.body.appendChild(s);

  //
  // Utility methods
  //

  var parseQueryString = function(url) {
    var a = document.createElement('a');
    a.href = url;
    str = a.search.replace(/\?/, '');

    return deparam(str, true /* coerce values, eg. 'false' into false */);
  };

  // deparam
  //
  // Inverse of $.param()
  //
  // Taken from jquery-bbq by Ben Alman
  // https://github.com/cowboy/jquery-bbq/blob/master/jquery.ba-bbq.js

  // FIXME: add isNaN() method used below

  var isArray = Array.isArray || function(obj) {
      return Object.prototype.toString.call(obj) == '[object Array]';
    };

  var deparam = function( params, coerce ) {
    var obj = {},
      coerce_types = { 'true': !0, 'false': !1, 'null': null };

    // Iterate over all name=value pairs.
    each( params.replace( /\+/g, ' ' ).split( '&' ), function(v, j){
      var param = v.split( '=' ),
        key = decodeURIComponent( param[0] ),
        val,
        cur = obj,
        i = 0,

      // If key is more complex than 'foo', like 'a[]' or 'a[b][c]', split it
      // into its component parts.
        keys = key.split( '][' ),
        keys_last = keys.length - 1;

      // If the first keys part contains [ and the last ends with ], then []
      // are correctly balanced.
      if ( /\[/.test( keys[0] ) && /\]$/.test( keys[ keys_last ] ) ) {
        // Remove the trailing ] from the last keys part.
        keys[ keys_last ] = keys[ keys_last ].replace( /\]$/, '' );

        // Split first keys part into two parts on the [ and add them back onto
        // the beginning of the keys array.
        keys = keys.shift().split('[').concat( keys );

        keys_last = keys.length - 1;
      } else {
        // Basic 'foo' style key.
        keys_last = 0;
      }

      // Are we dealing with a name=value pair, or just a name?
      if ( param.length === 2 ) {
        val = decodeURIComponent( param[1] );

        // Coerce values.
        if ( coerce ) {
          val = val && !isNaN(val)            ? +val              // number
            : val === 'undefined'             ? undefined         // undefined
            : coerce_types[val] !== undefined ? coerce_types[val] // true, false, null
            : val;                                                // string
        }

        if ( keys_last ) {
          // Complex key, build deep object structure based on a few rules:
          // * The 'cur' pointer starts at the object top-level.
          // * [] = array push (n is set to array length), [n] = array if n is
          //   numeric, otherwise object.
          // * If at the last keys part, set the value.
          // * For each keys part, if the current level is undefined create an
          //   object or array based on the type of the next keys part.
          // * Move the 'cur' pointer to the next level.
          // * Rinse & repeat.
          for ( ; i <= keys_last; i++ ) {
            key = keys[i] === '' ? cur.length : keys[i];
            cur = cur[key] = i < keys_last
              ? cur[key] || ( keys[i+1] && isNaN( keys[i+1] ) ? {} : [] )
              : val;
          }

        } else {
          // Simple key, even simpler rules, since only scalars and shallow
          // arrays are allowed.

          if ( isArray( obj[key] ) ) {
            // val is already an array, so push on the next value.
            obj[key].push( val );

          } else if ( obj[key] !== undefined ) {
            // val isn't an array, but since a second value has been specified,
            // convert val into an array.
            obj[key] = [ obj[key], val ];

          } else {
            // val is a scalar.
            obj[key] = val;
          }
        }

      } else if ( key ) {
        // No value was defined, so set something meaningful.
        obj[key] = coerce
          ? undefined
          : '';
      }
    });

    return obj;
  };

}(this));
