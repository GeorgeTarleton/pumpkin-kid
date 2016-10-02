SpookyGame.Preloader = function(game) {
    // game.logo = null;
};

SpookyGame.Preloader.prototype = {
    preload: function() {
        console.log("Preloading");

        game.stage.setBackgroundColor(0xa5572f);

        // import assets
        // game.load.image("player", "assets/blank.gif");
        game.load.image("bg", "assets/bg-placeholder.gif");

        game.load.spritesheet('player', 'assets/player_walk_00.gif', 16, 16);
    },
    create: function() {
        game.state.start("Game");
    },
    update: function() {

    }
};