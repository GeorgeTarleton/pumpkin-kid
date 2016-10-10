var bitmap;
var shadow;

var map;
var groundLayer, bottomLayer, midLayer, topLayer, aboveLayer, collisionLayer;
var entitiesLayer, playerLayer, bulletsLayer, itemsLayer;
var uiLayer;

var player;
var pumpkins = [];
var enemies = {
    'ghosts': [],
    'skeletons': []
};
var spawnTimers = {}

var hpOverlay;
var ammoBar;
var loadout;

var cursors;
var keyPumpkin, keyAttack, keyWeapon;

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
    midLayer = map.createLayer('middle');

    // create player & player-interactable objects between appropriate layers
    itemsLayer = game.add.group();
    entitiesLayer = game.add.group();
    bulletsLayer = game.add.group();
    playerLayer = game.add.group();

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

    // draw UI
    uiLayer = game.add.group();
    uiLayer.fixedToCamera = true;
    setupUI();


    cursors = game.input.keyboard.createCursorKeys();

    keyPumpkin = game.input.keyboard.addKey(Phaser.Keyboard.Z);
    keyPumpkin.onDown.add(togglePumpkin, this);

    keyAttack = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    keyAttack.onDown.add(attack, this);

    keyWeapon = game.input.keyboard.addKey(Phaser.Keyboard.X);
    keyWeapon.onDown.add(switchWeapon, this);

    game.camera.follow(player.sprite);
}

function setupUI() {
    uiLayer.create(5, 5, 'heart_icon');
    var hpBar = uiLayer.create(20, 9, 'player_hp');
    hpOverlay = uiLayer.create(23, 2, 'player_hp_overlay');
    hpBar.addChild(hpOverlay);
    hpOverlay.scale.set(0, 1);

    ammoBar = uiLayer.create(game.width - 6, 7, 'ammo_icon');
    ammoBar.anchor.set(1, 0);
    ammoBar.frame = 5;

    loadout = uiLayer.create(8, game.height - 8, 'loadout');
    loadout.anchor.set(0, 1);
    player.weapons.forEach(function(w) {
        w.loadout = uiLayer.create(0, 0, w.loadoutRes);
        w.loadout.anchor.set(0, 1);
        w.loadout.visible = false;
        loadout.addChild(w.loadout);
    });
    player.weapon.loadout.visible = true;
}

function attack() {
    player.attack();
}


function togglePumpkin() {
    for (var i = 0; i < pumpkins.length; ++i) {
        if (distBetweenCenters(player.sprite, pumpkins[i].sprite) < 20) {
            pumpkins[i].toggle();
            break;
        }
    }
}

function switchWeapon() {
    player.weapon.loadout.visible = false;
    player.switchWeapon();
    player.weapon.loadout.visible = true;
}

function placePumpkins() {
    pumpkins.push(
        new Pumpkin(27*8, 23*8),
        new Pumpkin(55*8, 39*8),
        new Pumpkin(47*8, 23*8),
        new Pumpkin(30*8, 33*8),
        new Pumpkin(36*8, 49*8),
        new Pumpkin(48*8, 59*8),
        new Pumpkin(18*8, 57*8),
        new Pumpkin(30*8, 11*8),
        new Pumpkin(20*8, 43*8)
    );
}

function spawnGhosts() {
    spawnTimers.ghosts.add(5000, spawnGhosts, this);
    if (spawnTimers.ghosts.running) {
        enemies['ghosts'].push(new Ghost(game.rnd.integerInRange(200, 400), 180));
    } else {
        spawnTimers.ghosts.start();
    }
}

function spawnSkeletons() {
    spawnTimers.skeletons.add(5000, spawnSkeletons, this);
    if (spawnTimers.skeletons.running) {
        enemies['skeletons'].push(new Skeleton(game.rnd.integerInRange(200, 400), 180));
    } else {
        spawnTimers.skeletons.start();
    }
}

function gameOver() {
    
}

