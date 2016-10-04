SpookyGame.Game = function(game) {};


var player;
var pumpkins = [];

var cursors;

SpookyGame.Game.prototype = {
    preload: function() {},
    create: create,
    update: update,
    render: render
};




function render() {
    // Debugging displays
    // game.debug.cameraInfo(game.camera, 0, 0);
    // game.debug.spriteCoords(player.sprite, 0, 32);



    // redraw game on scaled-up canvas
    scaledCanvasContent.drawImage(game.canvas, 0, 0, game.width, game.height, 0, 0, 640, 576);
}