SpookyGame.Game = function(game) {};

var game;

SpookyGame.Game.prototype = {
    preload: function() {
        game = this;
    },
    create: create,
    update: update
};

function create() {
    console.log("Game created");
}

function update() {

}


function render() {
    // Debugging displays
}