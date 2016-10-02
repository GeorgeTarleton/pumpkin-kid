window.onload = function() {
    var game = new Phaser.Game(640, 576, Phaser.AUTO, 'game-container');

    game.state.add('Boot', SpookyGame.Boot);
    game.state.add('Preloader', SpookyGame.Preloader);
    game.state.add('Game', SpookyGame.Game);

    game.state.start('Boot');

    console.log("Starting game");
};

var SpookyGame = {};

SpookyGame.Boot = function(game) {};

SpookyGame.Boot.prototype = {
    init: function() {
        this.input.maxPointers = 1;
    },
    preload: function() {
        // this.load.image('logo', 'assets/logo.gif');
    },
    create: function () {
        this.state.start('Preloader');
    }
};