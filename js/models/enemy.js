var Enemy = function(spriteX, spriteY, spritesheet) {
    this.sprite = entitiesLayer.create(spriteX, spriteY, spritesheet);
    game.physics.arcade.enable(this.sprite);

    this.isKnockedBack = false;
    this.isAttacking = false;
    this.isDying = false;

    this.nextDirection = 'stop';
    this.block = '';
    this.prevDirection = 'stop';
    this.frameMoved = 0;
}

Enemy.prototype.updateInternal = function() {
    this.frameMoved = ++this.frameMoved % 10;
    this.chasePlayer();
    if (this.nextDirection === 'left') {
        this.sprite.body.velocity.set(-this.speed, 0);
    } else if (this.nextDirection === 'right') {
        this.sprite.body.velocity.set(this.speed, 0);
    } else if (this.nextDirection === 'up') {
        this.sprite.body.velocity.set(0, -this.speed);
    } else if (this.nextDirection === 'down') {
        this.sprite.body.velocity.set(0, this.speed);
    } else if (this.nextDirection === 'stop') {
        this.sprite.body.velocity.set(0, 0);
    }
}

Enemy.prototype.chasePlayer = function() {
    if (!player.alive) {
        this.nextDirection = 'stop';
        return;
    }

    this.prevDirection = this.nextDirection;

    // if (this.block === 'left' && this.sprite.body.blocked.left ||
    //     this.block === 'right' && this.sprite.body.blocked.right ||
    //     this.block === 'up' && this.sprite.body.blocked.up ||
    //     this.block === 'down' && this.sprite.body.blocked.down) return;

    var dX = this.sprite.centerX - player.sprite.centerX;
    var dY = this.sprite.centerY - player.sprite.centerY;

    if (Math.abs(dX) > Math.abs(dY)) {
        if (dX > 0) {
            if (this.sprite.body.blocked.left) {
                this.block = 'left';
                this.nextDirection = dY > 0 ? 'up' : 'down';
            } else {
                this.block = '';
                this.nextDirection = 'left';
            }
        } else {
            if (this.sprite.body.blocked.right) {
                this.block = 'right';
                this.nextDirection = dY > 0 ? 'up' : 'down';
            } else {
                this.block = '';
                this.nextDirection = 'right';
            }
        }
    } else {
        if (dY > 0) {
            if (this.sprite.body.blocked.up) {
                this.block = 'up';
                this.nextDirection = dX > 0 ? 'left' : 'right';
            } else {
                this.block = '';
                this.nextDirection = 'up';
            }
        } else {
            if (this.sprite.body.blocked.down) {
                this.block = 'down';
                this.nextDirection = dX > 0 ? 'left' : 'right';
            } else {
                this.block = '';
                this.nextDirection = 'down';
            }
        }
    }


    if (this.nextDirection !== this.prevDirection && this.frameMoved < 9 && this.prevDirection !== 'stop') {
        this.nextDirection = this.prevDirection;
    }
}

Enemy.prototype.takeDamageInternal = function(source) {
    if (source === 'melee') {
        this.knockback(100);
    } else if (source === 'ranged') {
        this.knockback(30);
    }
    this.hp -= player.weapon.damage;
    if (this.hp <= 0) {
        this.die();
        return;
    }
}

Enemy.prototype.knockback = function(duration) {
    if (!this.isKnockedBack) {
        var knockbackTimer = game.time.create(false);
        knockbackTimer.add(duration, function() { this.isKnockedBack = false; }, this);
        knockbackTimer.start();

        this.isKnockedBack = true;

        if (player.lastDirection == 'down') {
            this.sprite.body.velocity.set(0, 150);
        } else if (player.lastDirection == 'up') {
            this.sprite.body.velocity.set(0, -150);
        } else if (player.lastDirection == 'left') {
            this.sprite.body.velocity.set(-150, 0);
        } else if (player.lastDirection == 'right') {
            this.sprite.body.velocity.set(150, 0);
        }
    }
}

Enemy.prototype.attack = function() {
    this.isAttacking = true;
    var t = game.time.create(false);
    t.add(this.attackSpeed, function() { this.isAttacking = false; }, this);
    t.start();
}






// ===== GHOST =====

var Ghost = function(spriteX, spriteY) {
    Enemy.call(this, spriteX, spriteY, 'ghost');

    this.sprite.animations.add('walk_left', [0, 1, 2, 3], 8, true);
    this.sprite.animations.add('walk_right', [4, 5, 6, 7], 8, true);
    this.sprite.animations.add('die_left', [8, 9, 10, 11], 8, true);
    this.sprite.animations.add('die_right', [12, 13, 14, 15], 8, true);
    this.sprite.animations.add('damage_left', [16], 1, true);
    this.sprite.animations.add('damage_right', [17], 1, true);
    this.sprite.animations.play('walk_left');

    this.sprite.body.setSize(14, 14, 4, 6);

    this.speed = 15;
    this.hp = 200;
}

Ghost.prototype = Object.create(Enemy.prototype);

Ghost.prototype.damage = 15;
Ghost.prototype.knockbackDuration = false;
Ghost.prototype.attackSpeed = 1000;

Ghost.prototype.update = function() {
    if (this.isDying || this.isKnockedBack) return;
    this.updateInternal();


    if (this.sprite.body.velocity.x > 0) {
        this.sprite.animations.play('walk_right');
    } else {
        this.sprite.animations.play('walk_left');
    }
}

Ghost.prototype.takeDamage = function(source) {
    this.takeDamageInternal(source);

    var currentAnim = this.sprite.animations.currentAnim.name;
    if (currentAnim === 'walk_right') {
        this.sprite.animations.play('damage_right');
    } else if (currentAnim === 'walk_left') {
        this.sprite.animations.play('damage_left');
    }

    var t = game.time.create(false);
    t.add(100, function() { this.sprite.animations.play(currentAnim) }, this);
    t.start();
}

Ghost.prototype.die = function() {
    if (this.sprite.body.velocity.x > 0) {
        this.sprite.animations.play('die_right', null, false, true);    // kill on complete
    } else {
        this.sprite.animations.play('die_left', null, false, true);
    }
    this.isDying = true;
    this.sprite.body.velocity.set(0, 0);
    this.sprite.body.enable = false;
}





// ===== SKELETON =====

var Skeleton = function(spriteX, spriteY) {
    Enemy.call(this, spriteX, spriteY, 'skelly');

    this.sprite.animations.add('walk_down', [0, 1, 2, 3], 8, true);
    this.sprite.animations.add('walk_left', [4, 5, 6, 7], 8, true);
    this.sprite.animations.add('walk_up', [8, 9, 10, 11], 8, true);
    this.sprite.animations.add('walk_right', [12, 13, 14, 15], 8, true);
    this.sprite.animations.add('die_down', [16, 17, 18, 19], 8, true);
    this.sprite.animations.add('die_left', [20, 21, 22, 23], 8, true);
    this.sprite.animations.add('die_up', [24, 25, 26, 27], 8, true);
    this.sprite.animations.add('die_right', [28, 29, 30, 31], 8, true);
    this.sprite.animations.add('damage_down', [32], 1, true);
    this.sprite.animations.add('damage_left', [33], 1, true);
    this.sprite.animations.add('damage_up', [34], 1, true);
    this.sprite.animations.add('damage_right', [35], 1, true);
    this.sprite.animations.play('walk_down');

    this.sprite.body.setSize(8, 14, 4, 2);

    this.speed = 25;
    this.hp = 100;
}

Skeleton.prototype = Object.create(Enemy.prototype);

Skeleton.prototype.damage = 25;
Skeleton.prototype.knockbackDuration = 60;
Skeleton.prototype.attackSpeed = 1000;

Skeleton.prototype.update = function() {
    if (this.isDying || this.isKnockedBack) return;
    this.updateInternal();

    if (this.isKnockedBack) return;

    this.sprite.animations.play('walk_' + this.nextDirection);

    // console.log(this.sprite.centerX - player.sprite.body.center.x)
    // console.log(this.sprite.centerY - player.sprite.body.center.y)
    // if (Math.abs(this.sprite.centerX - player.sprite.body.center.x) < 18 &&
    //     Math.abs(this.sprite.centerY - player.sprite.body.center.y) < 14) {
    //     this.sprite.body.velocity.set(0, 0);
    // }
}

Skeleton.prototype.takeDamage = function(source) {
    this.takeDamageInternal(source);

    var currentAnim = this.sprite.animations.currentAnim.name;
    if (currentAnim === 'walk_down') {
        this.sprite.animations.play('damage_down');
    } else if (currentAnim === 'walk_left') {
        this.sprite.animations.play('damage_left');
    } else if (currentAnim === 'walk_up') {
        this.sprite.animations.play('damage_up');
    } else if (currentAnim === 'walk_right') {
        this.sprite.animations.play('damage_right');
    }

    var t = game.time.create(false);
    t.add(100, function() { this.sprite.animations.play(currentAnim) }, this);
    t.start();
}

Skeleton.prototype.die = function() {
    var currentAnim = this.sprite.animations.currentAnim.name;
    if (currentAnim === 'walk_down') {
        this.sprite.animations.play('die_down', null, false, true);    // kill on complete
    } else if (currentAnim === 'walk_left') {
        this.sprite.animations.play('die_left', null, false, true);
    } else if (currentAnim === 'walk_up') {
        this.sprite.animations.play('die_up', null, false, true);
    } else if (currentAnim === 'walk_right') {
        this.sprite.animations.play('die_right', null, false, true);
    }
    this.isDying = true;
    this.sprite.body.velocity.set(0, 0);
    this.sprite.body.enable = false;
}