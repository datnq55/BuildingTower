/********************* Ground *********************/
var Ground = function(game, x, y, width, height) {
    Phaser.TileSprite.call(this, game, x, y, width, height, 'ground');
    this.game.physics.p2.enableBody(this);
    this.body.allowGravity = false;
    this.body.immovable = true;
    this.body.static = true;
};

Ground.prototype = Object.create(Phaser.TileSprite.prototype);  
Ground.prototype.constructor = Ground;

Ground.prototype.update = function() {

  // write your prefab’s specific update code here

};