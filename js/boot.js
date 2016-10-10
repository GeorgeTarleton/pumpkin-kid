var game;

window.onload = function() {
    game = new Phaser.Game(160, 144, Phaser.CANVAS, '');

    game.state.add('Boot', SpookyGame.Boot);
    game.state.add('Preloader', SpookyGame.Preloader);
    game.state.add('Title', SpookyGame.Title);
    game.state.add('Game', SpookyGame.Game);

    game.state.start('Boot');

    console.log("Starting game");
};

var SpookyGame = {};

var scaledCanvas;
var scaledCanvasContent;

SpookyGame.Boot = function(game) {};

SpookyGame.Boot.prototype = {
    init: function() {
        game.input.maxPointers = 1;

        // set up scaled canvas to scale the game up 4x in the webpage
        // http://www.photonstorm.com/phaser/pixel-perfect-scaling-a-phaser-game
        game.canvas.style['display'] = 'none';          // hide phaser's default canvas
        scaledCanvas = Phaser.Canvas.create(null, 640, 576, '', true);      // set skipPool = true, PIXI's canvas pool seems to mess things up
        scaledCanvasContent = scaledCanvas.getContext('2d');
        Phaser.Canvas.addToDOM(scaledCanvas);
        Phaser.Canvas.setSmoothingEnabled(scaledCanvasContent, false);

        // fix camera jittering when following player
        // http://www.html5gamedevs.com/topic/12485-sprite-jittering-with-camera-follow/
        game.renderer.renderSession.roundPixels = true;


    },
    preload: function() {
        // this.load.image('logo', 'assets/logo.gif');
    },
    create: function () {
        game.state.start('Preloader');
    }
};