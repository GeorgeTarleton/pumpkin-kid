SpookyGame.Game = function(game) {};


var player;
var pumpkins = [];
var enemies = {
    'ghosts': [],
    'skeletons': []
};

var cursors;

SpookyGame.Game.prototype = {
    preload: function() {},
    create: create,
    update: update,
    render: render
};




function render() {
    // Debugging displays
    // game.debug.body(player.sprite);
    // enemies['ghosts'].forEach(function(g) {
        // game.debug.body(g.sprite)
    // });


    // redraw game on scaled-up canvas
    scaledCanvasContent.drawImage(game.canvas, 0, 0, game.width, game.height, 0, 0, 640, 576);
}