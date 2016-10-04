var bitmap;
var shadow;
var player_mask;

var map;
var groundLayer, bottomLayer, midLayer, topLayer, aboveLayer, collisionLayer;

function create() {
    console.log("Game created");

    game.physics.startSystem(Phaser.Physics.Arcade);

    // draw environment
    game.world.setBounds(0, 0, 640, 624);

    // set up tilemap
    map = game.add.tilemap('map');
    map.addTilesetImage('environment', 'map_tiles');

    // create tilemap layers
    collisionLayer = map.createLayer('collision');
    groundLayer = map.createLayer('ground');
    bottomLayer = map.createLayer('bottom');

    placePumpkins();

    // create player between appropriate layers
    player = new Player(
        game.add.sprite(game.world.centerX, game.world.centerY, 'player')
    );

    midLayer = map.createLayer('middle');
    topLayer = map.createLayer('top');
    aboveLayer = map.createLayer('above');

    map.setCollisionBetween(1, 100, true, 'collision');
    groundLayer.resizeWorld();








    // draw shadow & reveal masks
    shadow = game.make.sprite(0, 0, 'shadow');

    // player_mask = game.make.sprite(player.sprite.centerX, player.sprite.centerY, 'mask_40');
    // player_mask.frame = 0;
    // player_mask.anchor.set(0.5, 0.5);

    bitmap = game.make.bitmapData(game.world.width, game.world.height);
    game.add.sprite(0, 0, bitmap);
    // bitmap.draw(shadow).blendDestinationOut().draw(player_mask).blendReset();

    cursors = game.input.keyboard.createCursorKeys();

    game.camera.follow(player.sprite);
}

function placePumpkins() {
    pumpkins.push(new Pumpkin(
        game.add.sprite(192, 192, 'pumpkin')
    ));
    pumpkins.push(new Pumpkin(
        game.add.sprite(384, 192, 'pumpkin')
    ));
    pumpkins.push(new Pumpkin(
        game.add.sprite(384, 384, 'pumpkin')
    ));
}