SpookyGame.Game = function(game) {};

SpookyGame.Game.prototype = {
    preload: function() {},
    create: create,
    update: update,
    render: render
};




// Helper functions
function distBetweenCenters(sprite1, sprite2) {
    return Math.sqrt(Math.pow(sprite2.centerX - sprite1.centerX, 2) + Math.pow(sprite2.centerY - sprite1.centerY, 2));
}



function render() {
    // Debugging displays
    // game.debug.body(player.sprite);
    // enemies['ghosts'].forEach(function(g) {
        // game.debug.body(g.sprite)
    // });
    game.debug.body(player.meleeHitbox);


    // redraw game on scaled-up canvas
    scaledCanvasContent.drawImage(game.canvas, 0, 0, game.width, game.height, 0, 0, 640, 576);
}