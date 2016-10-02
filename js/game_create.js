function create() {
    console.log("Game created");


    // draw environment
    game.add.sprite(0, 0, "bg");
    game.world.setBounds(0, 0, 480, 480);

    game.physics.startSystem(Phaser.Physics.P2JS);


    // init player
    player = new Player(
        game.add.sprite(100, 100, "player")
    );

    cursors = game.input.keyboard.createCursorKeys();

    game.camera.follow(player.sprite);
}