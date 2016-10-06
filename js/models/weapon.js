var Weapon = function(_sprite) {
    this.sprite = _sprite;

    this.sprite.animations.add('idle_down', [0, 1], 4, true);
    this.sprite.animations.add('idle_left', [4, 5], 4, true);
    this.sprite.animations.add('idle_up', [8, 9], 4, true);
    this.sprite.animations.add('idle_right', [12, 13], 4, true);
    this.sprite.animations.add('walk_down', [0, 1], 8, true);
    this.sprite.animations.add('walk_left', [4, 5], 8, true);
    this.sprite.animations.add('walk_up', [8, 9], 8, true);
    this.sprite.animations.add('walk_right', [12, 13], 8, true);
    this.sprite.animations.add('swing_down', [14, 15, 16, 17], 8, true);
    this.sprite.animations.add('swing_left', [18, 19, 20, 21], 8, true);
    this.sprite.animations.add('swing_up', [22, 23, 24, 25], 8, true);
    this.sprite.animations.add('swing_right', [26, 27, 28, 29], 8, true);
    this.sprite.animations.play('idle_down');
}