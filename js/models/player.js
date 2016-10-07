var Player = function(spriteX, spriteY) {
    this.sprite = playerLayer.create(spriteX, spriteY, 'player');
    this.sprite.anchor.set(0.5, 0.5);      // needed to center camera properly

    this.sprite.animations.add('idle_down', [0, 1, 2, 3], 8, true);
    this.sprite.animations.add('idle_left', [4, 5, 6, 7], 8, true);
    this.sprite.animations.add('idle_up', [8, 9, 10, 11], 8, true);
    this.sprite.animations.add('idle_right', [12, 13, 14, 15], 8, true);
    this.sprite.animations.add('walk_down', [16, 17, 18, 19], 8, true);
    this.sprite.animations.add('walk_left', [20, 21, 22, 23], 8, true);
    this.sprite.animations.add('walk_up', [24, 25, 26, 27], 8, true);
    this.sprite.animations.add('walk_right', [28, 29, 30, 31], 8, true);
    this.sprite.animations.add('swing_down', [32, 33, 34, 35], 8, false);
    this.sprite.animations.add('swing_left', [36, 37, 38, 39], 8, false);
    this.sprite.animations.add('swing_up', [40, 41, 42, 43], 8, false);
    this.sprite.animations.add('swing_right', [44, 45, 46, 47], 8, false);
    this.sprite.animations.add('damage_down', [48], 1, true);
    this.sprite.animations.add('damage_left', [49], 1, true);
    this.sprite.animations.add('damage_up', [50], 1, true);
    this.sprite.animations.add('damage_right', [51], 1, true);
    this.sprite.animations.play('idle_down');

    game.physics.arcade.enable(this.sprite);
    this.sprite.body.fixedRotation = true;
    var lastDirection = 'down';

    // only set collision for bottom half of player's body
    this.sprite.body.setSize(16, 8, 8, 8);


    this.weapon = new Weapon(
        playerLayer.create(-16, -16, 'shovel')
    );
    this.sprite.addChild(this.weapon.sprite);

    this.meleeHitbox = playerLayer.create(0, 0, 'melee_hitbox');
    this.sprite.addChild(this.meleeHitbox);
    game.physics.arcade.enable(this.meleeHitbox);
    this.meleeHitbox.body.enable = false;


    this.attacking = false;

    this.isKnockedBack = false;


    this.visionMask = game.make.sprite(this.sprite.centerX, this.sprite.centerY, 'mask_40');
    this.visionMask.frame = 0;
    this.visionMask.anchor.set(0.5, 0.5);

    this.visionRadius = 40;

    this.hp = 100;
    this.alive = true;
}

Player.prototype.update = function(cursors) {
    if (this.isKnockedBack) return;

    // only enable melee hitbox for a short duration within the attack animation
    if (this.attackTimer && this.attackTimer.ms >= 400) {
        this.meleeHitbox.body.enable = false;
    } else if (this.attackTimer && this.attackTimer.ms >= 200) {
        this.meleeHitbox.body.enable = true;
    }

    if (this.attacking) return;

    var currentAnim = this.sprite.animations.currentAnim;

    this.sprite.body.velocity.set(0, 0);

    if (cursors.up.isDown) {
        this.sprite.body.velocity.set(0, -100);
        this.sprite.animations.play('walk_up');
        this.weapon.sprite.animations.play('walk_up');
        this.lastDirection = 'up';
    } else if (cursors.down.isDown) {
        this.sprite.body.velocity.set(0, 100);
        this.sprite.animations.play('walk_down');
        this.weapon.sprite.animations.play('walk_down');
        this.lastDirection = 'down';
    } else if (cursors.left.isDown) {
        this.sprite.body.velocity.set(-100, 0);
        this.sprite.animations.play('walk_left');
        this.weapon.sprite.animations.play('walk_left');
        this.lastDirection = 'left';
    } else if (cursors.right.isDown) {
        this.sprite.body.velocity.set(100, 0);
        this.sprite.animations.play('walk_right');
        this.weapon.sprite.animations.play('walk_right');
        this.lastDirection = 'right';
    } else {
        this.sprite.animations.play('idle_' + this.lastDirection);
        this.weapon.sprite.animations.play('idle_' + this.lastDirection);
    }
}

Player.prototype.updateVisionMask = function() {
    // create light flicker effect
    if (visionClock == 0) {
        this.visionMask.frame = 0;
    } else if (visionClock == 30) {
        this.visionMask.frame = 1;
    }
    this.visionMask.x = Math.round(this.sprite.centerX);
    this.visionMask.y = Math.round(this.sprite.centerY);
    bitmap.draw(this.visionMask);
}

Player.prototype.attack = function() {
    if (!this.attacking) {
        this.attackTimer = game.time.create(false);
        this.attackTimer.add(this.weapon.attackTime, this.afterAttack, this);
        this.attackTimer.start();

        this.sprite.animations.play('swing_' + this.lastDirection);
        this.weapon.sprite.animations.play('swing_' + this.lastDirection);

        this.attacking = true;
        this.sprite.body.velocity.set(0, 0);

        if (this.lastDirection == 'down') {
            this.meleeHitbox.body.setSize(16, 16, -8, 0);
        } else if (this.lastDirection == 'up') {
            this.meleeHitbox.body.setSize(16, 16, -8, -16);
        } else if (this.lastDirection == 'left') {
            this.meleeHitbox.body.setSize(24, 16, -24, -8);
        } else if (this.lastDirection == 'right') {
            this.meleeHitbox.body.setSize(24, 16, 0, -8);
        }
    }
}

Player.prototype.afterAttack = function() {
    this.attackTimer.destroy();
    this.sprite.animations.play('idle_' + this.lastDirection);
    this.weapon.sprite.animations.play('idle_' + this.lastDirection);
    this.attacking = false;
    if (keyAttack.isDown) {
        this.attack();
    } else {
        this.meleeHitbox.body.enable = false;
    }
}

Player.prototype.takeDamage = function(source) {
    var currentAnim = this.sprite.animations.currentAnim.name;
    if (currentAnim.match(/(down)/)) {
        this.sprite.animations.play('damage_down');
    } else if (currentAnim.match(/(left)/)) {
        this.sprite.animations.play('damage_left');
    } else if (currentAnim.match(/(up)/)) {
        this.sprite.animations.play('damage_up');
    } else if (currentAnim.match(/(right)/)) {
        this.sprite.animations.play('damage_right');
    }

    var t = game.time.create(false);
    t.add(100, function() { this.sprite.animations.play(currentAnim) }, this);
    t.start();

    var duration = source.knockbackDuration;
    if (duration && !this.isKnockedBack) {

        var knockbackTimer = game.time.create(false);
        knockbackTimer.add(duration, function() { this.isKnockedBack = false; }, this);
        knockbackTimer.start();

        this.isKnockedBack = true;

        console.log(source.nextDirection);
        if (source.nextDirection == 'down') {
            this.sprite.body.velocity.set(0, 150);
        } else if (source.nextDirection == 'up') {
            this.sprite.body.velocity.set(0, -150);
        } else if (source.nextDirection == 'left') {
            this.sprite.body.velocity.set(-150, 0);
        } else if (source.nextDirection == 'right') {
            this.sprite.body.velocity.set(150, 0);
        }
    }


}