/********************* Box *********************/
var Box = function(game, x, y, frame) {
    Phaser.Sprite.call(this, game, x, y, 'box', frame);
    
    this.anchor.setTo(0.5, 0.5);
    this.game.physics.p2.enableBody(this);
    this.body.allowGravity = true;
    this.body.immovable = false;
};

Box.prototype = Object.create(Phaser.Sprite.prototype);
Box.prototype.constructor = Box;

Box.prototype.update = function() {
  // write your prefab's specific update code here

};

Box.prototype.setImmovable = function(isImmovable) {
    this.body.immovable = true; // @TODO Fix more?
    this.body.allowGravity = false;
};

var BoxGroup = function(game, parent) {
    Phaser.Group.call(this, game, parent);
};

BoxGroup.prototype = Object.create(Phaser.Group.prototype);  
BoxGroup.prototype.constructor = BoxGroup;

BoxGroup.prototype.addBox = function(x, y) {    
    var box = new Box(game, x, 0, 0);
    this.add(box);
    
    this.setAll('body.velocity.y', -50);
    this.exists = true;
};