var game;

window.onload = function() {
    game = new Phaser.Game(160, 144, Phaser.CANVAS, '');

    game.state.add('Boot', SpookyGame.Boot);
    game.state.add('Preloader', SpookyGame.Preloader);
    game.state.add('Game', SpookyGame.Game);

    game.state.start('Boot');

    console.log("Starting game");
};

var SpookyGame = {};

var scaledCanvas;
var scaledCanvasContent;
var scaledCanvasWidth;
var scaledCanvasHeight;

SpookyGame.Boot = function(game) {};

SpookyGame.Boot.prototype = {
    init: function() {
        game.input.maxPointers = 1;

        // set up scaled canvas to scale the game up 4x in the webpage
        game.canvas.style['display'] = 'none';
        scaledCanvas = Phaser.Canvas.create(0, game.width * 4, game.height * 4);
        scaledCanvasContent = scaledCanvas.getContext('2d');
        Phaser.Canvas.addToDOM(scaledCanvas);
        Phaser.Canvas.setSmoothingEnabled(scaledCanvasContent, false);
        scaledCanvasWidth = scaledCanvas.width;
        scaledCanvasHeight = scaledCanvas.height;


    },
    preload: function() {
        // this.load.image('logo', 'assets/logo.gif');
    },
    create: function () {
        game.state.start('Preloader');
    }
};