var bitmap;
var shadow;
var player_mask;

var map;
var groundLayer, bottomLayer, midLayer, topLayer, aboveLayer, collisionLayer;
var entitiesLayer, playerLayer;

var player;
var pumpkins = [];
var enemies = {
    'ghosts': [],
    'skeletons': []
};
var spawnTimers = {}

var cursors;
var keyPumpkin, keyAttack;

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

    // create player & player-interactable objects between appropriate layers
    entitiesLayer = game.add.group();
    playerLayer = game.add.group();

    midLayer = map.createLayer('middle');
    topLayer = map.createLayer('top');
    aboveLayer = map.createLayer('above');

    // make collision layer collidable
    map.setCollisionBetween(1, 100, true, 'collision');
    groundLayer.resizeWorld();


    player = new Player(game.world.centerX, game.world.centerY);

    spawnTimers.ghosts = game.time.create(false);
    spawnTimers.skeletons = game.time.create(false);

    placePumpkins();
    spawnGhosts();
    spawnSkeletons();






    // draw shadow & reveal masks
    shadow = game.make.sprite(0, 0, 'shadow');
    bitmap = game.make.bitmapData(game.world.width, game.world.height);
    game.add.sprite(0, 0, bitmap);


    cursors = game.input.keyboard.createCursorKeys();

    keyPumpkin = game.input.keyboard.addKey(Phaser.Keyboard.Z);
    keyPumpkin.onDown.add(togglePumpkin, this);

    keyAttack = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    // keyAttack.onDown.add();

    game.camera.follow(player.sprite);
}

function togglePumpkin() {
    for (var i = 0; i < pumpkins.length; ++i) {
        if (distBetweenCenters(player.sprite, pumpkins[i].sprite) < 20) {
            pumpkins[i].toggle();
            break;
        }
    }
}

function placePumpkins() {
    pumpkins.push(
        new Pumpkin(192, 192),
        new Pumpkin(384, 192),
        new Pumpkin(384, 384)
    );
}

function spawnGhosts() {
    // spawnTimers.ghosts.add(3000, spawnGhosts, this);
    // if (spawnTimers.ghosts.running) {
    //     enemies['ghosts'].push(new Ghost(game.rnd.integerInRange(100, 400), 180));
    // } else {
    //     spawnTimers.ghosts.start();
    // }
    enemies['ghosts'].push(new Ghost(320, 320));
}

function spawnSkeletons() {
    // spawnTimers.skeletons.add(3000, spawnSkeletons, this);
    // if (spawnTimers.skeletons.running) {
    //     enemies['skeletons'].push(new Skeleton(game.rnd.integerInRange(100, 400), 180));
    // } else {
    //     spawnTimers.skeletons.start();
    // }
    enemies['skeletons'].push(new Skeleton(280, 320));
}