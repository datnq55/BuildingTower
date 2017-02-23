var PreloadState = {
    preload: function() {
        this.asset = this.add.sprite(this.width / 2, this.height / 2, 'preloader');
        this.asset.anchor.setTo(0.5, 0.5);
        
        this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
        this.load.setPreloadSprite(this.asset);
        this.load.image('yeoman', 'assets/yeoman-logo.png');
        
        this.load.image('background', 'assets/background.png');
        this.load.image('ground', 'assets/ground.png');
        this.load.image('startButton', 'assets/start-button.png');
        this.load.image('instructions', 'assets/instructions.png');
        this.load.image('getReady', 'assets/get-ready.png');
        
        this.load.image('scoreboard', 'assets/scoreboard.png');
        this.load.spritesheet('medals', 'assets/medals.png',44, 46, 2);
        this.load.image('gameover', 'assets/gameover.png');
        this.load.image('particle', 'assets/particle.png');
        this.load.spritesheet('box', 'assets/brick.png', 40, 40, 1);
        
        this.load.bitmapFont('flappyfont', 'assets/fonts/flappyfont.png', 'assets/fonts/flappyfont.fnt');
        
        this.load.audio('flap', 'assets/sounds/flap.wav');
        this.load.audio('brickHit', 'assets/sounds/sfx_hit.ogg');
        this.load.audio('groundHit', 'assets/ground-hit.wav');
        this.load.audio('die', 'assets/sounds/sfx_die.ogg');
        this.load.audio('score', 'assets/sounds/point.mp3');
        this.load.audio('ouch', 'assets/ouch.wav');
    },
    create: function() {
        this.asset.cropEnabled = false;
    },
    update: function() {
        if(!!this.ready) {
          this.game.state.start('menu');
        }
    },
    onLoadComplete: function() {
        this.ready = true;
    }
};