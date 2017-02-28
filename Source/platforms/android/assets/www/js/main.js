/*
* @Author Nguyen Quoc Dat & Vuong Kha Phu
* Coppyright by Donkey team
*/

/* Get screen size (width, height) */
var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    x = w.innerWidth || e.clientWidth || g.clientWidth,
    y = w.innerHeight|| e.clientHeight|| g.clientHeight; // Use in the feature
var screenW = x;
var screenH = y;
var backgroundH = 505;
var pippyTextW = 179;


/********************* Scoreboard *********************/
var Scoreboard = function(game) {

  var gameover;

  Phaser.Group.call(this, game);
  gameover = this.create(this.game.width / 2, 100, 'gameover');
  gameover.anchor.setTo(0.5, 0.5);

  this.scoreboard = this.create(this.game.width / 2, 200, 'scoreboard');
  this.scoreboard.anchor.setTo(0.5, 0.5);

  this.scoreText = this.game.add.bitmapText((screenW - this.scoreboard.width) / 2 + this.scoreboard.width - 30, 180, 'flappyfont', '', 18);
  this.add(this.scoreText);

  this.bestText = this.game.add.bitmapText((screenW - this.scoreboard.width) / 2 + this.scoreboard.width - 30, 230, 'flappyfont', '', 18);
  this.add(this.bestText);

  // add our start button with a callback
  this.startButton = this.game.add.button(this.game.width/2, 300, 'startButton', this.startClick, this);
  this.startButton.anchor.setTo(0.5,0.5);
  
  this.add(this.startButton);

  this.y = this.game.height;
  this.x = 0;

};

Scoreboard.prototype = Object.create(Phaser.Group.prototype);
Scoreboard.prototype.constructor = Scoreboard;

Scoreboard.prototype.show = function(score) {
    var coin, bestScore;
    this.scoreText.setText(score.toString());
    if(!!localStorage) {
        bestScore = localStorage.getItem('bestScore');
        if(!bestScore || bestScore < score) {
            bestScore = score;
            localStorage.setItem('bestScore', bestScore);
        }
    } else {
        bestScore = 'N/A';
    }

    this.bestText.setText(bestScore.toString());

    if(score >= 10 && score < 20)
    {
        coin = this.game.add.sprite(-65 , 7, 'medals', 1);
    } else if(score >= 20) {
        coin = this.game.add.sprite(-65 , 7, 'medals', 0);
    }

  this.game.add.tween(this).to({y: 0}, 1000, Phaser.Easing.Bounce.Out, true);

  if (coin) {

    coin.anchor.setTo(0.5, 0.5);
    this.scoreboard.addChild(coin);

     // Emitters have a center point and a width/height, which extends from their center point to the left/right and up/down
    var emitter = this.game.add.emitter(coin.x, coin.y, 400);
    this.scoreboard.addChild(emitter);
    emitter.width = coin.width;
    emitter.height = coin.height;


    //  This emitter will have a width of 800px, so a particle can emit from anywhere in the range emitter.x += emitter.width / 2
    // emitter.width = 800;

    emitter.makeParticles('particle');

    // emitter.minParticleSpeed.set(0, 300);
    // emitter.maxParticleSpeed.set(0, 600);

    emitter.setRotation(-100, 100);
    emitter.setXSpeed(0,0);
    emitter.setYSpeed(0,0);
    emitter.minParticleScale = 0.25;
    emitter.maxParticleScale = 0.5;
    emitter.setAll('body.allowGravity', false);

    emitter.start(false, 1000, 1000);

  }
};

Scoreboard.prototype.startClick = function() {
  this.game.state.start('play');
};

Scoreboard.prototype.update = function() {
  // write your prefab's specific update code here
};

/////////////////////////////////////////////////////////////////////////////////////////////////////
// Create our 'main' state that will contain the game
var BootState = {
  preload: function() {
    this.load.image('preloader', 'assets/preloader.gif');
  },
  create: function() {
    this.game.input.maxPointers = 1;
    this.game.state.start('preload');
  }
};

var MenuState = {
    preload: function() {

    },
    create: function() {
        this.background = this.game.add.tileSprite(0, 0, screenW, screenH, 'background');
        this.ground = this.game.add.tileSprite(0, backgroundH, screenW, screenH - backgroundH, 'ground');

        this.startButton = this.game.add.button(screenW/2, 200, 'startButton', this.startClick, this);
        this.startButton.anchor.setTo(0.5,0.5);
    },
    startClick: function() {
        // start button click handler
        // start the 'play' state
        this.game.state.start('play');
    }
};

var PlayState = {
    preload: function() {

    },
    create: function() {
        this.game.physics.startSystem(Phaser.Physics.P2JS);
        this.game.physics.p2.gravity.y = 1200;  
        
        // Add sprite and tile
        this.background = this.game.add.tileSprite(0, 0, screenW, screenH, 'background');
        this.boxes = this.game.add.group();
        
        this.ground = new Ground(this.game, 0, backgroundH, screenW, screenH - backgroundH);
        this.game.add.existing(this.ground);
 
        var length = 40;
        var height = 8;  //height for the physics bod - your image height is 8px
        var width = 20;   //this is the witdh for the physics body.. if to small the rectangles will get scrambled together
        var maxForce =20000;  //the force that holds the rectangles together
        var xAnchor =200;  //position of the first rectangle that acts as anchor
        var lastRect;

        for(var i=0; i<=length; i++){
            var x = xAnchor;                 // all rects are on the same x position
            var y = i*height;               // every new rects is positioned below the last
            newRect = this.game.add.sprite(x, y, 'rope');    //add sprite
            this.game.physics.p2.enable(newRect, false);      // enable physicsbody
            newRect.body.setRectangle(width,height);    //set custom rectangle
            if (i==0){newRect.body.static=true;}  //anchor the first one created
            else{  
                newRect.body.velocity.x =100;   //give it a push :)
                newRect.body.mass =  length/i;  // reduce mass for evey rope element
            }     
            //after the first rectangle is created we can add the constraint
            if(lastRect){
                this.game.physics.p2.createDistanceConstraint(newRect,lastRect,height,maxForce);
            } 
            lastRect = newRect;
        }; 
 
        // Add key handleEvent

        // Mouse click / touch
        this.input.onDown.add(this.startGame, this);
        
        // Score
        this.score = 0;
        this.scoreText = this.game.add.bitmapText(this.game.width/2, 10, 'flappyfont',this.score.toString(), 24);
        
        // Instruction
        this.instructionGroup = this.game.add.group();
        this.instructionGroup.add(this.game.add.sprite(screenW/2, 100, 'getReady'));
        this.instructionGroup.add(this.game.add.sprite(screenW/2, screenH / 2 + 50, 'instructions'));
        this.instructionGroup.setAll('anchor.x', 0.5);
        this.instructionGroup.setAll('anchor.y', 0.5);
        
        // Variables
        this.gameOver = false;
        
        // Sounds
        this.scoreSound = this.game.add.audio('score');
        this.hitBox = this.game.add.audio('brickHit');
        this.hitGround = this.game.add.audio('groundHit');
        this.dieSound = this.game.add.audio('die');
    },
    update: function() {
        if (!this.gameOver){
            // this.boxes.forEach(function(box) {
                // this.game.physics.p2.collide(box, this.ground, this.boxImpactHandler, null, this);
                
                // this.boxes.forEach(function(box1) {
                    // if (box != box1)
                    // {
                        // this.game.physics.p2.collide(box1, box, this.boxImpactHandler, null, this);
                    // }
                // }, this);
            // }, this);
        }
    },
    boxImpactHandler: function(enemy, box) {
        if (enemy instanceof Box)
        {
            box.setImmovable(false);
            enemy.setImmovable(false);
        }
        else if (enemy instanceof Ground)
        {
            box.setImmovable(false);
        }
    },
    generateBox: function() {
        var brickX = this.game.rnd.integerInRange(100, 200);
        var boxGroup = this.boxes.getFirstExists(false);
        if (!boxGroup) {
            boxGroup = new BoxGroup(this.game, this.boxes);
        }
        boxGroup.addBox(brickX, 0);
    },
    shutdown: function() {
        this.game.input.keyboard.removeKey(Phaser.Keyboard.SPACEBAR);
        this.boxes.destroy();
        this.scoreboard.destroy();
    },
    startGame: function() {
        if (!this.gameOver) {
        
            // Add a timer
            this.boxGenerator = this.game.time.events.loop(Phaser.Timer.SECOND * 2.0, this.generateBox, this);
            this.boxGenerator.timer.start();
            this.instructionGroup.destroy();
        }
    },
    checkScore: function(pipeGroup) {
        if (!this.gameOver) {
            this.scoreSound.play();
            
            this.score++;
            this.scoreText.setText(this.score.toString());
        }
    }
};

var game = new Phaser.Game(screenW, screenH, Phaser.AUTO, 'building-tower');

// Game States
game.state.add('boot', BootState);
game.state.add('menu', MenuState);
game.state.add('play', PlayState);
game.state.add('preload', PreloadState);


game.state.start('boot');