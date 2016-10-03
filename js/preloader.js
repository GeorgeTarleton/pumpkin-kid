SpookyGame.Preloader = function(game) {
    // game.logo = null;
};

SpookyGame.Preloader.prototype = {
    preload: function() {
        console.log("Preloading");

        game.stage.setBackgroundColor(0xa5572f);

        // import assets

        // map elements
        game.load.tilemap('map', 'assets/maps/2.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('map_tiles', 'assets/environment.gif');

        game.load.image("mask", "assets/mask.gif");
        game.load.image('shadow', 'assets/shadow.gif');

        // character spritesheets
        game.load.spritesheet('player', 'assets/player.gif', 16, 16);

    },
    create: function() {
        game.state.start("Game");
    },
    update: function() {

    }
};