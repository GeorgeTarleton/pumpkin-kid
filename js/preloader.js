SpookyGame.Preloader = function(game) {
    this.logo = null;
};

SpookyGame.Preloader.prototype = {
    preload: function() {
        console.log("Preloading");
        
        this.stage.setBackgroundColor(0x381f1e);

        // this.load.image();
        // this.load.spritesheet();
    },
    create: function() {
        this.state.start("Game");
    },
    update: function() {

    }
};