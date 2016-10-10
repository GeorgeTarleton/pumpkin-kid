SpookyGame.Title = function(game) {};

var startGame;

SpookyGame.Title.prototype = {
    preload: function() {},

    create: function() {
        console.log("Entered title");

        this.overlay = game.add.group();
        this.overlay.fixedToCamera = true;

        var logo = this.overlay.create(0, 0, 'logo');

        var playerSprite = this.overlay.create(game.width / 2, 82, 'player');
        playerSprite.anchor.set(0.5, 0);
        playerSprite.animations.add('def', [0, 1, 2, 3], 4, true);
        playerSprite.animations.play('def');

        this.startText = this.overlay.create(0, 115, 'start_text');
        this.startText.animations.add('hover', [0, 1, 2, 1], 3, true);
        this.startText.animations.add('flash', [0, 3], 16, true);
        this.startText.animations.play('hover');


        startGame = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        startGame.onDown.addOnce(this.start, this);
    },

    start: function() {
        this.startText.animations.play('flash');
        var t = game.time.create(true);
        t.add(800, function() {
            this.overlay.removeAll(true);
            game.state.start("Game");
        }, this);
        t.start();
    },

    update: function() {},

    render: function() {
        scaledCanvasContent.drawImage(game.canvas, 0, 0, game.width, game.height, 0, 0, 640, 576);
    }
};