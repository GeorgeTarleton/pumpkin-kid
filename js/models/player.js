// player states
FREE = 0, ROOTED = 1, KNOCKED_BACK = 2;
DEFAULT = 0, ATTACKING = 1, ATTACKED = 2;


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
    this.sprite.body.setSize(12, 8, 10, 8);


    // player weapons
    this.weapons = [
        new Shovel(-16, -16),
        new Gun(-16, -8)
    ];
    for (var i in this.weapons) {
        this.sprite.addChild(this.weapons[i].sprite);
    }
    this.weaponId = 0;
    this.weapon = this.weapons[this.weaponId];
    this.weapon.sprite.visible = true;


    this.meleeHitbox = playerLayer.create(0, 0, 'melee_hitbox');
    this.sprite.addChild(this.meleeHitbox);
    game.physics.arcade.enable(this.meleeHitbox);
    this.meleeHitbox.body.enable = false;

    // player states
    this.movementState = FREE;
    this.animationState = DEFAULT;

    this.visionMask = game.make.sprite(this.sprite.centerX, this.sprite.centerY, 'mask_40');
    this.visionMask.frame = 0;
    this.visionMask.anchor.set(0.5, 0.5);

    this.visionRadius = 40;

    this.hp = 200;
    this.clipSize = 10;
    this.ammo = 5 * this.clipSize;
}

Player.prototype.update = function(cursors) {
    // debug
    console.log(this.animationState + ' ' + this.movementState);

    // only enable melee hitbox for a short duration within the attack animation
    if (this.weapon.sprite.key === 'shovel') {
        if (this.weapon.attackTimer && this.weapon.attackTimer.ms >= 400) {
            this.meleeHitbox.body.enable = false;
        } else if (this.weapon.attackTimer && this.weapon.attackTimer.ms >= 200) {
            this.meleeHitbox.body.enable = true;
        }
    }

    var direction = 'stop';
    if (cursors.up.isDown)          direction = 'up';
    else if (cursors.down.isDown)   direction = 'down';
    else if (cursors.left.isDown)   direction = 'left';
    else if (cursors.right.isDown)  direction = 'right';

    var currentAnim = this.sprite.animations.currentAnim;
    switch(this.animationState) {
        case DEFAULT:
            if (direction === 'stop') {
                this.sprite.animations.play('idle_' + this.lastDirection);
                this.weapon.sprite.animations.play('idle_' + this.lastDirection);
            } else {
                this.sprite.animations.play('walk_' + direction);
                this.weapon.sprite.animations.play('walk_' + direction);
            }
            break;
        case ATTACKING:
            this.sprite.animations.play('swing_' + this.lastDirection);
            this.weapon.sprite.animations.play('use_' + this.lastDirection);
            break;
        case ATTACKED:
            this.sprite.animations.play('damage_' + this.lastDirection);
            this.weapon.sprite.animations.play('damage_' + this.lastDirection);
            break;
    }

    switch(this.movementState) {
        case FREE:
            if (direction === 'up') {
                this.sprite.body.velocity.set(0, -100);
            } else if (direction === 'down') {
                this.sprite.body.velocity.set(0, 100);
            } else if (direction === 'left') {
                this.sprite.body.velocity.set(-100, 0);
            } else if (direction === 'right') {
                this.sprite.body.velocity.set(100, 0);
            } else if (direction === 'stop') {
                this.sprite.body.velocity.set(0, 0);
            }
            if (direction !== 'stop') this.lastDirection = direction;
            break;
        case ROOTED:
            this.sprite.body.velocity.set(0, 0);
            break;
        case KNOCKED_BACK:
            break;
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

Player.prototype.switchWeapon = function() {
    if (this.movementState === FREE) {
        this.weapon.sprite.visible = false;     // hide previous weapon
        this.weapon = this.weapons[(++this.weaponId % 2)];
        this.weapon.sprite.visible = true;      // show current weapon
    }
}

Player.prototype.attack = function() {
    if (this.movementState === FREE && this.weapon.canUse) {
        this.weapon.use(this.afterAttack);

        if (this.weapon.sprite.key === 'shovel') {
            this.animationState = ATTACKING;
            this.movementState = ROOTED;
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
        } else {

        }
    }
}

Player.prototype.afterAttack = function() {
    if (this.animationState === ATTACKING) {
        this.animationState = DEFAULT;
    }
    if (this.movementState === ROOTED) {
        this.movementState = FREE;
    }
}

Player.prototype.takeDamage = function(sourceEnemy) {
    this.hp -= sourceEnemy.damage;
    if (this.hp <= 0) {
        gameOver();
        return;
    }

    this.animationState = ATTACKED;

    var currentAnim = this.sprite.animations.currentAnim.name;
    if (this.lastDirection == 'down') {
        this.sprite.animations.play('damage_down');
    } else if (this.lastDirection == 'left') {
        this.sprite.animations.play('damage_left');
    } else if (this.lastDirection == 'up') {
        this.sprite.animations.play('damage_up');
    } else if (this.lastDirection == 'right') {
        this.sprite.animations.play('damage_right');
    }

    var t = game.time.create(true);
    t.add(100, function() { if (this.animationState === ATTACKED) this.animationState = DEFAULT }, this);
    t.start();

    var duration = sourceEnemy.knockbackDuration;
    if (duration && this.movementState !== KNOCKED_BACK) {
        this.movementState = KNOCKED_BACK;

        var knockbackTimer = game.time.create(true);
        knockbackTimer.add(duration, function() { this.movementState = FREE; }, this);
        knockbackTimer.start();

        if (sourceEnemy.nextDirection == 'down') {
            this.sprite.body.velocity.set(0, 150);
        } else if (sourceEnemy.nextDirection == 'up') {
            this.sprite.body.velocity.set(0, -150);
        } else if (sourceEnemy.nextDirection == 'left') {
            this.sprite.body.velocity.set(-150, 0);
        } else if (sourceEnemy.nextDirection == 'right') {
            this.sprite.body.velocity.set(150, 0);
        }
    }
}

Player.prototype.pickUpItem = function(itemKey) {
    if (itemKey === 'candy') {
        this.hp = Math.max(this.hp + 40, 200);
    } else if (itemKey === 'candle') {
        this.visionRadius = Math.max(this.visionRadius + 10, 70);
    } else if (itemKey === 'loot') {
        this.ammo = Math.max(this.ammo + this.clipSize, this.clipSize * 5);
    }
}