function create() {
    console.log("Game created");


    // draw environment
    // game.add.tileSprite(0, 0, 1920, 1920, "bg");

    game.physics.startSystem(Phaser.Physics.P2JS);


    // init player
    player = new Player(
        game.add.sprite(100, 100, "player")
    );

    cursors = game.input.keyboard.createCursorKeys();

    game.camera.follow(player.sprite);
}