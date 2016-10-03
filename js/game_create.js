var bitmap;
var shadow;
var player_mask;

var map;
var groundLayer, midLayer, topLayer, aboveLayer, collisionLayer;

function create() {
    console.log("Game created");

    game.physics.startSystem(Phaser.Physics.Arcade);

    // draw environment
    game.world.setBounds(0, 0, 480, 480);
    game.add.sprite(0, 0, "bg");

    map = game.add.tilemap('map');
    map.addTilesetImage('environment', 'map_tiles');

    collisionLayer = map.createLayer('collision');
    groundLayer = map.createLayer('ground');
    midLayer = map.createLayer('mid');
    topLayer = map.createLayer('top');
    aboveLayer = map.createLayer('above');

    map.setCollision([2], true, 'collision');
    groundLayer.resizeWorld();

    // init player
    player = new Player(
        game.add.sprite(game.world.centerX, game.world.centerY, "player")
    );



    // draw shadow & reveal masks
    shadow = game.make.sprite(0, 0, 'shadow');

    player_mask = game.make.sprite(player.sprite.centerX, player.sprite.centerY, 'mask');
    player_mask.anchor.set(0.5, 0.5);

    bitmap = game.make.bitmapData(game.world.width, game.world.height);
    game.add.sprite(0, 0, bitmap);
    bitmap.draw(shadow).blendDestinationOut().draw(player_mask).blendReset();

    cursors = game.input.keyboard.createCursorKeys();

    game.camera.follow(player.sprite);
}