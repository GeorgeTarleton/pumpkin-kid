SpookyGame.Preloader = function(game) {
    // game.logo = null;
};

SpookyGame.Preloader.prototype = {
    preload: function() {
        console.log("Preloading");

        game.stage.setBackgroundColor(0xa5572f);

        // import assets
        game.load.image("player", "assets/blank.gif");
        game.load.image("bg", "assets/bg-placeholder.gif");

        // this.load.image();
        // this.load.spritesheet();
    },
    create: function() {
        game.state.start("Game");
    },
    update: function() {

    }
};