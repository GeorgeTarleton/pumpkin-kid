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

        // vision assets
        game.load.image('shadow', 'assets/shadow.gif');
        game.load.spritesheet('mask_20', 'assets/mask_20.gif', 40, 40);
        game.load.spritesheet('mask_30', 'assets/mask_30.gif', 60, 60);
        game.load.spritesheet('mask_40', 'assets/mask_40.gif', 80, 80);
        game.load.spritesheet('mask_50', 'assets/mask_50.gif', 100, 100);
        game.load.spritesheet('mask_60', 'assets/mask_60.gif', 120, 120);
        game.load.spritesheet('mask_70', 'assets/mask_70.gif', 140, 140);

        // character spritesheets
        game.load.spritesheet('player', 'assets/player_large.gif', 32, 16);
        game.load.spritesheet('pumpkin', 'assets/pumpkin.gif', 32, 16);
        game.load.spritesheet('shovel', 'assets/shovel.gif', 32, 24);
        game.load.spritesheet('gun', 'assets/gun.gif', 16, 16);
        game.load.spritesheet('ghost', 'assets/ghost_fat.gif', 24, 24);
        game.load.spritesheet('skelly', 'assets/skelly.gif', 16, 16);

        game.load.image('melee_hitbox', 'assets/melee_hitbox.gif');
        game.load.image('bullet', 'assets/bullet.gif');

    },
    create: function() {
        game.state.start("Game");
    },
    update: function() {

    }
};