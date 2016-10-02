function Player(_sprite) {
    this.sprite = _sprite;

    this.sprite.animations.add('idle', null, 8, true);
    this.sprite.animations.play('idle');



    game.physics.p2.enable(this.sprite);
    this.sprite.body.fixedRotation = true;
}