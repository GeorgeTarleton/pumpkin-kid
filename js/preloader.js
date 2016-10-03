SpookyGame.Preloader = function(game) {
    // game.logo = null;
};

SpookyGame.Preloader.prototype = {
    preload: function() {
        console.log("Preloading");

        game.stage.setBackgroundColor(0xa5572f);

        // import assets
        game.load.image("bg", "assets/bg-placeholder.gif");
        game.load.image("mask", "assets/mask.gif");
        game.load.image('shadow', 'assets/shadow.gif');

        game.load.spritesheet('player', 'assets/player.gif', 16, 16);

    },
    create: function() {
        game.state.start("Game");
    },
    update: function() {

    }
};