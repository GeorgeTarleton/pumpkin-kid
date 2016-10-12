var Weapon = function(spriteX, spriteY, spritesheet) {
    this.sprite = playerLayer.create(spriteX, spriteY, spritesheet);
    this.sprite.visible = false;

    this.canUse = true;
}

Weapon.prototype.useInternal = function(callback) {
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




// ===== SHOVEL =====

var Shovel = function(spriteX, spriteY) {
    Weapon.call(this, spriteX, spriteY, 'shovel');

    this.sprite.animations.add('idle_down', [0, 1], 4, true);
    this.sprite.animations.add('idle_left', [4, 5], 4, true);
    this.sprite.animations.add('idle_up', [8, 9], 4, true);
    this.sprite.animations.add('idle_right', [12, 13], 4, true);
    this.sprite.animations.add('walk_down', [0, 1], 8, true);
    this.sprite.animations.add('walk_left', [4, 5], 8, true);
    this.sprite.animations.add('walk_up', [8, 9], 8, true);
    this.sprite.animations.add('walk_right', [12, 13], 8, true);
    this.sprite.animations.add('use_down', [16, 17, 18, 19], 8, false);
    this.sprite.animations.add('use_left', [20, 21, 22, 23], 8, false);
    this.sprite.animations.add('use_up', [24, 25, 26, 27], 8, false);
    this.sprite.animations.add('use_right', [28, 29, 30, 31], 8, false);
    this.sprite.animations.play('idle_down');

    this.attackAnimationTime = 500;
    this.attackTime = 600;
    this.damage = 70;

    this.loadoutRes = 'shovel_icon';
}

Shovel.prototype = Object.create(Weapon.prototype);

Shovel.prototype.use = function(callback) {
    this.useInternal(callback);

    var t = game.time.create(true);
    t.add(250, function() { sounds.shovel.play(); }, this);
    t.start();
}




// ===== GUN =====

var Gun = function(spriteX, spriteY) {
    Weapon.call(this, spriteX, spriteY, 'gun');

    // this.sprite.animations.add('idle_down', [0, 1], 4, true);
    // this.sprite.animations.add('idle_left', [4, 5], 4, true);
    // this.sprite.animations.add('idle_up', [8, 9], 4, true);
    // this.sprite.animations.add('idle_right', [12, 13], 4, true);
    // this.sprite.animations.add('walk_down', [0, 1], 4, true);
    // this.sprite.animations.add('walk_left', [4, 5], 4, true);
    // this.sprite.animations.add('walk_up', [8, 9], 4, true);
    // this.sprite.animations.add('walk_right', [12, 13], 4, true);
    // this.sprite.animations.add('use_down', [16, 17, 18, 19], 8, false);
    // this.sprite.animations.add('use_left', [20, 21, 22, 23], 8, false);
    // this.sprite.animations.add('use_up', [24, 25, 26, 27], 8, false);
    // this.sprite.animations.add('use_right', [28, 29, 30, 31], 8, false);
    this.sprite.animations.add('idle_down', [0, 1], 4, true);
    this.sprite.animations.add('idle_left', [2, 3], 4, true);
    this.sprite.animations.add('idle_up', [4, 5], 4, true);
    this.sprite.animations.add('idle_right', [6, 7], 4, true);
    this.sprite.animations.add('walk_down', [0, 1], 4, true);
    this.sprite.animations.add('walk_left', [2, 3], 4, true);
    this.sprite.animations.add('walk_up', [4, 5], 4, true);
    this.sprite.animations.add('walk_right', [6, 7], 4, true);
    this.sprite.animations.add('use_down', [0, 1], 4, false);
    this.sprite.animations.add('use_left', [2, 3], 4, false);
    this.sprite.animations.add('use_up', [4, 5], 4, false);
    this.sprite.animations.add('use_right', [6, 7], 4, false);
    this.sprite.animations.play('idle_down');

    this.attackAnimationTime = 200;
    this.attackTime = 150;
    this.damage = 40;

    this.loadoutRes = 'gun_icon';
}

Gun.prototype = Object.create(Weapon.prototype);

Gun.prototype.use = function(callback) {
    this.useInternal(callback);

    var bullet = bulletsLayer.create(0, 0, 'bullet');
    bullet.anchor.set(0.5, 0.5);
    game.physics.arcade.enable(bullet);

    var playerx = player.sprite.centerX;
    var playery = player.sprite.centerY;
    if (player.lastDirection == 'down') {
        bullet.position.set(playerx - 4, playery + 4);
        bullet.body.velocity.set(0, 200);
    } else if (player.lastDirection == 'up') {
        bullet.position.set(playerx + 4, playery + 4);
        bullet.body.velocity.set(0, -200);
    } else if (player.lastDirection == 'left') {
        bullet.position.set(playerx - 4, playery + 4);
        bullet.body.velocity.set(-200, 0);
    } else if (player.lastDirection == 'right') {
        bullet.position.set(playerx + 4, playery + 4);
        bullet.body.velocity.set(200, 0);
    }

    sounds.gun.play();
}

