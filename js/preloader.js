SpookyGame.Preloader = function(game) {
    // game.logo = null;
};

SpookyGame.Preloader.prototype = {
    preload: function() {
        console.log("Preloading");

        game.stage.setBackgroundColor(0xa5572f);

        // import assets

        // menu screen
        game.load.image('logo', 'assets/ui/logo.gif');
        game.load.image('start_text', 'assets/ui/start.gif');
        game.load.image('start_text_flash', 'assets/ui/start_flash.gif');

        // map elements
        game.load.tilemap('map', 'assets/maps/2.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('map_tiles', 'assets/environment.gif');

        // UI elements
        game.load.image('heart_icon', 'assets/ui/heart.gif');
        game.load.spritesheet('ammo_icon', 'assets/ui/ammo.gif', 35, 12);
        game.load.image('player_hp', 'assets/ui/hp_player.gif');
        game.load.image('pumpkin_hp', 'assets/ui/hp_pumpkin.gif');
        game.load.image('player_hp_overlay', 'assets/ui/hp_player_overlay.gif');
        game.load.image('pumpkin_hp_overlay', 'assets/ui/hp_pumpkin_overlay.gif');
        game.load.image('loadout', 'assets/ui/loadout.gif');
        game.load.image('shovel_icon', 'assets/ui/shovel.gif');
        game.load.image('gun_icon', 'assets/ui/gun.gif');

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
        game.load.spritesheet('gun', 'assets/gun.gif', 32, 16);
        game.load.spritesheet('ghost', 'assets/ghost_fat.gif', 24, 24);
        game.load.spritesheet('skelly', 'assets/skelly.gif', 16, 16);

        // item spreadsheets
        game.load.spritesheet('candy', 'assets/candy.gif', 16, 16);
        game.load.spritesheet('candle', 'assets/candle.gif', 16, 16);
        game.load.spritesheet('loot', 'assets/loot.gif', 16, 16);

        game.load.image('melee_hitbox', 'assets/melee_hitbox.gif');
        game.load.image('bullet', 'assets/bullet.gif');

        // number font
        game.load.image('numpbers', 'assets/ui/numpbers.gif');

        // sounds
        game.load.audio('bg', 'assets/sound/graveyard.wav');

    },
    create: function() {
        game.state.start("Title");
    },
    update: function() {

    }
};