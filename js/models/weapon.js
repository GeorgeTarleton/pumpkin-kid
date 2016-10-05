var Weapon = function(_sprite) {
    this.sprite = _sprite;

    this.sprite.animations.add('idle_down', [0, 1], 4, true);
    this.sprite.animations.add('idle_left', [2, 3], 4, true);
    this.sprite.animations.add('idle_up', [4, 5], 4, true);
    this.sprite.animations.add('idle_right', [6, 7], 4, true);
    this.sprite.animations.add('walk_down', [0, 1], 8, true);
    this.sprite.animations.add('walk_left', [2, 3], 8, true);
    this.sprite.animations.add('walk_up', [4, 5], 8, true);
    this.sprite.animations.add('walk_right', [6, 7], 8, true);
    this.sprite.animations.play('idle_down');
}