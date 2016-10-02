function Player(_sprite) {
    this.sprite = _sprite;

    this.sprite.animations.add('idle', [0, 1, 2, 3], 8, true);
    this.sprite.animations.add('walk_down', [4, 5, 6, 7], 8, true);
    this.sprite.animations.play('idle');



    game.physics.p2.enable(this.sprite);
    this.sprite.body.fixedRotation = true;


}

Player.prototype.update = function (cursors) {
    var currentAnim = this.sprite.animations.currentAnim;

    this.sprite.body.setZeroVelocity();

    if (cursors.up.isDown) {
        this.sprite.body.moveUp(100);
        if (currentAnim.name != 'walk_down') {
            this.sprite.animations.stop();
            this.sprite.animations.play('walk_down');
        }
    } else if (cursors.down.isDown) {
        this.sprite.body.moveDown(100);
        if (currentAnim.name != 'walk_down') {
            this.sprite.animations.stop();
            this.sprite.animations.play('walk_down');
        }
    } else if (cursors.left.isDown) {
        this.sprite.body.moveLeft(100);
        if (currentAnim.name != 'walk_down') {
            this.sprite.animations.stop();
            this.sprite.animations.play('walk_down');
        }
    } else if (cursors.right.isDown) {
        this.sprite.body.moveRight(100);
        if (currentAnim.name != 'walk_down') {
            this.sprite.animations.stop();
            this.sprite.animations.play('walk_down');
        }
    } else {
        if (currentAnim.name != 'idle') {
            this.sprite.animations.stop();
            this.sprite.animations.play('idle');
        }
    }
}