var Enemy = function(spriteX, spriteY, spritesheet) {
    this.sprite = entitiesLayer.create(spriteX, spriteY, spritesheet);
    game.physics.arcade.enable(this.sprite);

    this.isKnockedBack = false;
    this.knockbackTimer = game.time.create(false);

    this.nextDirection = 'stop';
    this.block = '';
    this.prevDirection = 'stop';
    this.frameMoved = 0;
}

Enemy.prototype.updateInternal = function() {
    this.frameMoved = ++this.frameMoved % 10;
    if (this.isKnockedBack) return;
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

Enemy.prototype.takeDamageInternal = function() {
    this.knockback();
}

Enemy.prototype.knockback = function() {
    if (!this.isKnockedBack) {
        this.knockbackTimer.add(100, function() { this.isKnockedBack = false; }, this);
        this.knockbackTimer.start();

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



var Ghost = function(spriteX, spriteY) {
    Enemy.call(this, spriteX, spriteY, 'ghost');

    this.sprite.animations.add('walk_left', [0, 1, 2, 3], 8, true);
    this.sprite.animations.add('walk_right', [4, 5, 6, 7], 8, true);
    this.sprite.animations.add('damage_left', [16], 1, true);
    this.sprite.animations.add('damage_right', [17], 1, true);
    this.sprite.animations.play('walk_left');

    this.sprite.body.setSize(14, 14, 4, 6);

    this.speed = 15;
}

Ghost.prototype = Object.create(Enemy.prototype);

Ghost.prototype.update = function() {
    this.updateInternal();

    if (this.isKnockedBack) return;

    if (this.sprite.body.velocity.x > 0) {
        this.sprite.animations.play('walk_right');
    } else {
        this.sprite.animations.play('walk_left');
    }
}

Ghost.prototype.takeDamage = function() {
    this.takeDamageInternal();

    var currentAnim = this.sprite.animations.currentAnim.name;
    if (currentAnim === 'walk_right') {
        this.sprite.animations.play('damage_right');
    } else if (currentAnim === 'walk_left') {
        this.sprite.animations.play('damage_left');
    }
    var t = game.time.create(false);
    t.add(100, function() { this.sprite.animations.play(currentAnim) }, this);
}


var Skeleton = function(spriteX, spriteY) {
    Enemy.call(this, spriteX, spriteY, 'skelly');

    this.sprite.animations.add('walk_down', [0, 1, 2, 3], 8, true);
    this.sprite.animations.add('walk_left', [4, 5, 6, 7], 8, true);
    this.sprite.animations.add('walk_up', [8, 9, 10, 11], 8, true);
    this.sprite.animations.add('walk_right', [12, 13, 14, 15], 8, true);
    this.sprite.animations.add('damage_down', [32], 1, true);
    this.sprite.animations.add('damage_left', [33], 1, true);
    this.sprite.animations.add('damage_up', [34], 1, true);
    this.sprite.animations.add('damage_right', [35], 1, true);
    this.sprite.animations.play('walk_down');

    this.sprite.body.setSize(8, 14, 4, 2);

    this.speed = 25;
}

Skeleton.prototype = Object.create(Enemy.prototype);

Skeleton.prototype.update = function() {
    this.updateInternal();

    if (this.isKnockedBack) return;

    this.sprite.animations.play('walk_' + this.nextDirection);
}

Skeleton.prototype.takeDamage = function() {
    this.takeDamageInternal();

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
}