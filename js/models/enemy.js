var Enemy = function(spriteX, spriteY) {

}



var Ghost = function(spriteX, spriteY) {
    this.sprite = entitiesLayer.create(spriteX, spriteY, 'ghost');

    this.sprite.animations.add('hover', [0, 1, 2, 3], 8, true);
    this.sprite.animations.play('hover');

    game.physics.arcade.enable(this.sprite);
    this.sprite.body.setSize(14, 14, 4, 6);
}