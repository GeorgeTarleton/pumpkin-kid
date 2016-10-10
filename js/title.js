SpookyGame.Title = function(game) {};

var startGame;

SpookyGame.Title.prototype = {
    preload: function() {},

    create: function() {
        console.log("Entered title");

        // play music
        music = game.add.audio('bg');
        music.loop = true;
        music.play();

        this.overlay = game.add.group();
        this.overlay.fixedToCamera = true;

        var logo = this.overlay.create(0, 0, 'logo');

        var playerSprite = this.overlay.create(game.width / 2, 82, 'player');
        playerSprite.anchor.set(0.5, 0);
        playerSprite.animations.add('def', [0, 1, 2, 3], 8, true);
        playerSprite.animations.play('def');

        this.startText = this.overlay.create(0, 120, 'start_text');
        this.startText.animations.add('hover', [0, 1], 2, true);
        this.startText.animations.add('flash', [0, 2], 8, true);
        this.startText.animations.play('hover');


        startGame = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        startGame.onDown.add(this.start, this);
    },

    start: function() {
        this.startText.animations.play('flash');
        var t = game.time.create(true);
        t.add(875, function() {
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