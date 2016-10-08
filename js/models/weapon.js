var Weapon = function(_sprite) {
    this.sprite = _sprite;

    this.attackAnimationTime = 500;
    this.attackTime = 600;
    this.damage = 50;

    this.canUse = true;

    this.sprite.animations.add('idle_down', [0, 1], 4, true);
    this.sprite.animations.add('idle_left', [4, 5], 4, true);
    this.sprite.animations.add('idle_up', [8, 9], 4, true);
    this.sprite.animations.add('idle_right', [12, 13], 4, true);
    this.sprite.animations.add('walk_down', [0, 1], 8, true);
    this.sprite.animations.add('walk_left', [4, 5], 8, true);
    this.sprite.animations.add('walk_up', [8, 9], 8, true);
    this.sprite.animations.add('walk_right', [12, 13], 8, true);
    this.sprite.animations.add('swing_down', [16, 17, 18, 19], 8, false);
    this.sprite.animations.add('swing_left', [20, 21, 22, 23], 8, false);
    this.sprite.animations.add('swing_up', [24, 25, 26, 27], 8, false);
    this.sprite.animations.add('swing_right', [28, 29, 30, 31], 8, false);
    this.sprite.animations.play('idle_down');
}

Weapon.prototype.use = function(callback) {
    this.canUse = false;

    var s = game.time.create(true);
    s.add(this.attackTime, function() {
        this.canUse = true;
        if (keyAttack.isDown) player.attack();
    }, this);
    s.start();

    this.attackTimer = game.time.create(true);
    this.attackTimer.add(this.attackAnimationTime, callback, player);
    this.attackTimer.start();

};