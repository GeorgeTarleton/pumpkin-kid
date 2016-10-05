var Enemy = function(spriteX, spriteY, spritesheet) {
    this.sprite = entitiesLayer.create(spriteX, spriteY, spritesheet);
    game.physics.arcade.enable(this.sprite);

    this.nextDirection = 'stop';
}

Enemy.prototype.update = function() {
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

    var dX = this.sprite.centerX - player.sprite.centerX;
    var dY = this.sprite.centerY - player.sprite.centerY;

    if (Math.abs(dX) > Math.abs(dY)) {
        this.nextDirection = dX > 0 ? 'left' : 'right';
    } else {
        this.nextDirection = dY > 0 ? 'up' : 'down';
    }
}



var Ghost = function(spriteX, spriteY) {
    Enemy.call(this, spriteX, spriteY, 'ghost');

    this.sprite.animations.add('hover', [0, 1, 2, 3], 8, true);
    this.sprite.animations.play('hover');

    this.sprite.body.setSize(14, 14, 4, 6);

    this.speed = 30;
}

Ghost.prototype = Object.create(Enemy.prototype);
