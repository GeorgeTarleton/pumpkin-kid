SpookyGame.Title = function(game) {};

SpookyGame.Title.prototype = {
    preload: function() {},
    create: create,
    update: update
};

var startGame;

SpookyGame.Title.prototype = {

    create: function () {
        console.log("Entered title");
        startGame = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        startGame.onDown.add(this.start, this);
    },

    start: function() {
        game.state.start("Game");
    }

};