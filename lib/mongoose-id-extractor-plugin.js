module.exports = function idExtractor(schema, options){
  options = options || {};
  var suffix = 'suffix' in options ? options.suffix : '_id';
  var refs = 'refs' in options ? options.refs: [];
  var map = 'map' in options ? options.map: {};

  if (refs.length > 0) {
    refs.forEach(function(fromPath){
      map[fromPath] = fromPath + suffix;
    });
  }

  for (var fromPath in map) {
    var toPath = map[fromPath];
    (function(){
      schema.virtual(toPath).get(function(){
        return this.populated(fromPath) || this[fromPath];
      });
    })(fromPath, toPath);
  }
};
