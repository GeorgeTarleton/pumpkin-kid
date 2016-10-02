function Player(_sprite) {
    this.sprite = _sprite;

    game.physics.p2.enable(this.sprite);
    this.sprite.body.fixedRotation = true;
}