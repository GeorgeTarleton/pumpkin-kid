SpookyGame.Game = function(game) {};


SpookyGame.Game.prototype = {
    preload: function() {},
    create: create,
    update: update,
    render: render
};




function render() {
    // console.log(scaledCanvas);
    scaledCanvasContent.drawImage(game.canvas, 0, 0, game.width, game.height, 0, 0, scaledCanvasWidth, scaledCanvasHeight);


    // Debugging displays
}