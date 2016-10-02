function create() {
    console.log("Game created");


    // draw environment
    // game.add.tileSprite(0, 0, 480, 480, "bg");
    // game.world.setBounds(0, 0, 480, 480);

    game.physics.startSystem(Phaser.Physics.P2JS);


    // init player
    player = new Player(
        game.add.sprite(100, 100, "player")
    );

    game.physics.p2.enable(player.sprite);

    cursors = game.input.keyboard.createCursorKeys();

    game.camera.follow(player.sprite);
}