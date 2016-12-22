var bitmap;
var shadow;

var map;
var groundLayer, bottomLayer, midLayer, topLayer, aboveLayer, collisionLayer;
var entitiesLayer, playerLayer, bulletsLayer, itemsLayer, pumpkinsLayer;
var uiLayer;

var player;
var pumpkins = [];
var enemies = {
    'ghosts': [],
    'skeletons': []
};
var spawnTimers = {}
var spawnPoints = [
    {x: 14, y: 13}, {x: 19, y: 13}, {x: 24, y: 13}, {x: 14, y: 17}, {x: 19, y: 17},
    {x: 57, y: 15}, {x: 62, y: 15}, {x: 57, y: 19}, {x: 62, y: 19}, {x: 62, y: 23},
    {x: 24, y: 49}, {x: 27, y: 49}, {x: 30, y: 49}, {x: 24, y: 55}, {x: 27, y: 55}, {x: 30, y: 55},
    {x: 48, y: 49}, {x: 51, y: 49}, {x: 54, y: 49}, {x: 48, y: 55}, {x: 51, y: 55}, {x: 54, y: 55}
];
var spawnTimes = [
    10000, 7500, 5000, 3000, 1500
];
var candleSpawns = [
    3, 2, 1, 1, 1
];
var stage;

var hpOverlay;
var ammoBar;
var loadout;
var scoreText;
var candleText;

var cursors;
var keyPumpkin, keyAttack, keyWeapon, keyCandle;

var easystar;
var navigationGrid = [];

var music;
var sounds = {};

function create() {
    console.log("Game created");

    game.physics.startSystem(Phaser.Physics.Arcade);

    // draw environment
    game.world.setBounds(0, 0, 640, 624);

    // play music
    music = game.add.audio('bg');
    music.loop = true;
    music.play();

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
    pumpkinsLayer = game.add.group();
    bulletsLayer = game.add.group();
    playerLayer = game.add.group();

    topLayer = map.createLayer('top');
    aboveLayer = map.createLayer('above');

    // make collision layer collidable
    map.setCollisionBetween(1, 100, true, 'collision');
    groundLayer.resizeWorld();

    // init pathfinding
    setupPathfinding();

    // set up player & enemies
    player = new Player(320, 312);

    spawnTimers.ghosts = game.time.create(false);
    spawnTimers.skeletons = game.time.create(false);
    stage = 0;
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

    keyCandle = game.input.keyboard.addKey(Phaser.Keyboard.C);
    keyCandle.onDown.add(feedCandle, this);

    game.camera.follow(player.sprite);

    // sound effects
    sounds.gun = game.add.audio('gun');
    sounds.gun.volume = 0.3;
    sounds.shovel = game.add.audio('shovel');
    sounds.gameOver = game.add.audio('game_over');
    sounds.gameOver.volume = 0.5;
    sounds.feedCandle = game.add.audio('feed');
    sounds.feedCandle.volume = 0.8;
    sounds.damage = game.add.audio('damage');
    sounds.pickup = game.add.audio('pickup');
    sounds.pickup.volume = 0.3;
}

function setupPathfinding() {
    easystar = new EasyStar.js();
    data = collisionLayer.layer.data;

    // navigation grid represents the walkability of every adjacent 2x2 tile blocks (16x16 pixels);
    // adjacent "navigation tiles" overlap on the actual tilemap
    navigationGrid = [];
    for (var i = 0; i < data.length - 1; i++) {
        navigationGrid[i] = [];
        for (var j = 0; j < data[i].length - 1; j++) {
            // a "navigation tile" is walkable if & only if all 4 tiles it covers are walkable
            if (data[i][j].index === -1 &&
                data[i+1][j].index === -1 &&
                data[i][j+1].index === -1 &&
                data[i+1][j+1].index === -1) {
                navigationGrid[i][j] = 0;
            } else navigationGrid[i][j] = 1;
        }
    }
    easystar.setGrid(navigationGrid);
    easystar.setAcceptableTiles([0]);
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

    scoreText = game.add.retroFont('numpbers', 5, 6, "0123456789", 10);
    var score = uiLayer.create(game.width / 2, 10, scoreText);
    score.anchor.set(0.5, 0);
    scoreText.text = "0";

    loadout = uiLayer.create(8, game.height - 8, 'loadout');
    loadout.anchor.set(0, 1);
    player.weapons.forEach(function(w) {
        w.loadout = uiLayer.create(0, 0, w.loadoutRes);
        w.loadout.anchor.set(0, 1);
        w.loadout.visible = false;
        loadout.addChild(w.loadout);
    });
    player.weapon.loadout.visible = true;

    var candle = uiLayer.create(game.width - 10, game.height - 10, 'candle_icon');
    candle.anchor.set(1, 1);
    var x = uiLayer.create(game.width - 20, game.height - 10, 'x');
    x.anchor.set(1, 1);

    candleText = game.add.retroFont('numpbers', 5, 6, "0123456789", 10);
    candleText.align = candleText.ALIGN_RIGHT;
    var candleCount = uiLayer.create(game.width - 34, game.height - 15, candleText);
    candleCount.anchor.set(1, 1);
    candleText.text = player.candles.toString();
}

function attack() {
    if (!player.alive) return;
    player.attack();
}


function togglePumpkin() {
    if (!player.alive) return;
    for (var i = 0; i < pumpkins.length; ++i) {
        if (distBetweenCenters(player.sprite, pumpkins[i].sprite) < 20) {
            pumpkins[i].toggle();
            break;
        }
    }
}

function switchWeapon() {
    if (!player.alive) return;
    player.weapon.loadout.visible = false;
    player.switchWeapon();
    player.weapon.loadout.visible = true;
}

function feedCandle() {
    if (player.candles > 0) {
        for (var i in pumpkins) {
            var p = pumpkins[i];
            if (distBetweenCenters(player.sprite, p.sprite) < 20 && p.hp < 500) {
                p.heal();
                player.feedCandle();
                // sounds.feedCandle.play();
                break;
            }
        }
    }
}

function placePumpkins() {
    pumpkins.push(
        new Pumpkin(27*8, 23*8),
        new Pumpkin(55*8, 39*8),
        new Pumpkin(47*8, 23*8),
        new Pumpkin(30*8, 33*8),
        new Pumpkin(42*8, 47*8),
        new Pumpkin(48*8, 59*8),
        new Pumpkin(18*8, 57*8),
        new Pumpkin(38*8, 11*8),
        new Pumpkin(20*8, 43*8),
        new Pumpkin(38*8, 65*8)
    );
}

function spawnGhosts() {
    spawnTimers.ghosts.add(
        game.rnd.integerInRange(spawnTimes[stage] - 2000, spawnTimes[stage] + 2000),
        spawnGhosts, this);
    var id = game.rnd.integerInRange(0, spawnPoints.length - 1);
    if (spawnTimers.ghosts.running) {
        enemies['ghosts'].push(new Ghost(spawnPoints[id].x * 8, spawnPoints[id].y * 8));
    } else {
        spawnTimers.ghosts.start();
    }
}

function spawnSkeletons() {
    spawnTimers.skeletons.add(
        game.rnd.integerInRange(spawnTimes[stage] - 2000, spawnTimes[stage] + 2000),
        spawnSkeletons, this);
    var id = game.rnd.integerInRange(0, spawnPoints.length - 1);
    if (spawnTimers.skeletons.running) {
        enemies['skeletons'].push(new Skeleton(spawnPoints[id].x * 8, spawnPoints[id].y * 8));
    } else {
        spawnTimers.skeletons.start();
    }
}

function gameOver() {
    spawnTimers.ghosts.destroy();
    spawnTimers.skeletons.destroy();
    pumpkins.forEach(function(p) {
        if (p.itemSpawnClock) p.itemSpawnClock.destroy();
    });
    music.stop();

    // restart game
    keyAttack.onDown.addOnce(restartGame, this);
    keyAttack.onDown.active = false;
    var t = game.time.create(true);
    t.add(2000, function() {
        keyAttack.onDown.active = true;
        var s = uiLayer.create(game.width / 2, 40, 'game_over');
        s.anchor.set(0.5, 0);
    }, this);
    t.start();

    sounds.gameOver.play();
}

function restartGame() {
    game.world.removeAll(true);
    enemies = { 'ghosts': [], 'skeletons': [] };
    pumpkins = [];
    stage = 0;
    game.state.start("Title");
}

function pauseGame() {

}

