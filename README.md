mongoose-id-extractor-plugin [![Build Status](https://travis-ci.org/kjirou/mongoose-id-extractor-plugin.svg?branch=master)](https://travis-ci.org/kjirou/mongoose-id-extractor-plugin)
============================

Add `{path}_id` virtual-paths as [mongoose-plugin](http://mongoosejs.com/docs/plugins.html) that is able to extract `_id` always.


## Installation
```
npm install mongoose-id-extractor-plugin
```


## Examples
```
var mongoose = require('mongoose');
var idExtractor = require('mongoose-id-extractor-plugin');

var commentSchema = new mongoose.Schema({
  article: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article'
  }
});

// Apply as mongoose-plugin
commentSchema.plugin(idExtractor, { refs:['article'] });

var Comment = mongoose.model('Comment', commentSchema);

var comment = new Comment({ article:ObjectId() });

// Returns a ObjectId regardless of whether performed population.
comment.article_id;
```

`suffix` option:
```
schema.plugin(idExtractor, { refs:['foo'], suffix:'_object_id' });

doc.foo_object_id;  // Change default "_id" to "_object_id"
```

`map` option:
```
schema.plugin(idExtractor, {
  map: {
    from_path: 'to_path'
  }
});

doc.to_path;  // _id of from_path
```
