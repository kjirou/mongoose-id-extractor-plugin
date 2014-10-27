var assert = require('assert');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

var idExtractor = require('../index');


describe('mongoose-id-extractor-plugin', function(){

  before(function(){
    // I could not execute the tests without to start mongod process.
    var uri = 'mongodb://localhost:27017/local';
    mongoose.connect(uri, {
      user: '',
      pass: ''
    }, function(e){
      if (e) { throw e; }
    });
  });

  it('should be defined', function(){
    assert(typeof idExtractor === 'function');
  });

  it('should be apply as mongoose-plugin', function(){
    var schema = new Schema({
      weapon: {
        type: Schema.Types.ObjectId,
        ref: 'Weapon'
      },
      armor: {
        type: Schema.Types.ObjectId,
        ref: 'Armor'
      }
    });
    schema.plugin(idExtractor, { refs:['weapon'] });

    var Character = mongoose.model('Character', schema);
    var weaponId = ObjectId();
    var armorId = ObjectId();
    var character = new Character({
      weapon: weaponId,
      armor: armorId
    });

    // And should be able to access "{fromPath}_id".
    assert(character.weapon instanceof ObjectId);
    assert(character.weapon.toString() === weaponId.toString());
    assert(character.weapon_id instanceof ObjectId);
    assert(character.weapon_id.toString() === weaponId.toString());
    assert(character.armor instanceof ObjectId);
    assert(character.armor_id === undefined);
  });

  it('should be extract _id always', function(done){
    var fooSchema = new Schema();
    var Foo = mongoose.model('Foo', fooSchema);

    var barSchema = new Schema({
      foo: {
        type: Schema.Types.ObjectId,
        ref: 'Foo'
      }
    });
    barSchema.plugin(idExtractor, { refs:['foo'] });
    var Bar = mongoose.model('Bar', barSchema);

    Foo.create({_id:ObjectId()}, function(e, foo){
      var bar = new Bar({foo:foo._id});
      bar.populate('foo', function(e, bar){
        assert(bar.populated('foo'));
        assert(bar.foo_id.toString() === foo._id.toString());
        done();
      });
    });
  });

  it('suffix option', function(){
    var schema = new Schema({
      element: Schema.Types.ObjectId
    });
    schema.plugin(idExtractor, { refs:['element'], suffix:'_idid' });
    var Magic = mongoose.model('Magic', schema);
    var magic = new Magic({ element:ObjectId() });
    assert(magic.element_idid instanceof ObjectId);
    assert(magic.element_id === undefined);
  });

  it('map option', function(){
    var schema = new Schema({
      x: Schema.Types.ObjectId,
      y: Schema.Types.ObjectId
    });
    schema.plugin(idExtractor, {
      map: {
        'x': 'xx',
        'y': 'yy'
      }
    });
    var Coords = mongoose.model('Coords', schema);
    var coords = new Coords({ x:ObjectId(), y:ObjectId() });
    assert(coords.xx instanceof ObjectId);
    assert(coords.x_id === undefined);
    assert(coords.yy instanceof ObjectId);
    assert(coords.y_id === undefined);
  });
});
