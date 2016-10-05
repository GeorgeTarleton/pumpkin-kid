var Enemy = function(spriteX, spriteY, spritesheet) {
    this.sprite = entitiesLayer.create(spriteX, spriteY, spritesheet);
    game.physics.arcade.enable(this.sprite);

    this.nextDirection = 'stop';
    this.paths = {};
    this.tilePos = {};
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

    this.tilePos.topleft = {
        x: collisionLayer.getTileX(this.sprite.body.x),
        y: collisionLayer.getTileY(this.sprite.body.y)
    };
    // this.tilePos.topright = {
    //     x: collisionLayer.getTileX(this.sprite.body.x + this.sprite.body.width),
    //     y: collisionLayer.getTileY(this.sprite.body.y)
    // };
    // this.tilePos.botleft = {
    //     x: collisionLayer.getTileX(this.sprite.body.x),
    //     y: collisionLayer.getTileY(this.sprite.body.y + this.sprite.body.height)
    // };
    this.tilePos.botright = {
        x: collisionLayer.getTileX(this.sprite.body.x + this.sprite.body.width),
        y: collisionLayer.getTileY(this.sprite.body.y + this.sprite.body.height)
    };

    var playerX = collisionLayer.getTileX(player.sprite.centerX);
    var playerY = collisionLayer.getTileY(player.sprite.centerY);

    var e = this;
    pathfinder.findPath(this.tilePos.topleft.x, this.tilePos.topleft.y, playerX, playerY, function(path) {
        if (!path || path.length < 2) {
            e.nextDirection = 'stop';
        } else {
            e.paths.topleft ={
                next: path[1],
                length: path.length
            };
            e.calculateNextTile();
        }
    });
    pathfinder.calculate();
    // pathfinder.findPath(this.tilePos.topright.x, this.tilePos.topright.y, playerX, playerY, pathCallback);
    // pathfinder.calculate();
    // pathfinder.findPath(this.tilePos.botleft.x, this.tilePos.botleft.y, playerX, playerY, pathCallback);
    // pathfinder.calculate();
    pathfinder.findPath(this.tilePos.botright.x, this.tilePos.botright.y, playerX, playerY, function(path) {
        if (!path || path.length < 2) {
            e.nextDirection = 'stop';
        } else {
            e.paths.botright ={
                next: path[1],
                length: path.length
            };
            e.calculateNextTile();
        }
    });
    pathfinder.calculate();
}

Enemy.prototype.calculateNextTile = function() {
    if (!(this.paths.topleft && this.paths.botright)) return;
    var next, curr;
    // console.log(this.paths.topleft.length + " " + this.paths.botright.length);
    var direction1 = getDirection(this.tilePos.topleft, this.paths.topleft.next);
    var direction2 = getDirection(this.tilePos.botright, this.paths.botright.next);

    if (direction1 === 'down' && this.sprite.body.blocked.down ||
        direction1 === 'up' && this.sprite.body.blocked.up ||
        direction1 === 'left' && this.sprite.body.blocked.left ||
        direction1 === 'right' && this.sprite.body.blocked.right) {
        this.nextDirection = direction2;
    } else {
        this.nextDirection = direction1;
    }

    console.log(direction1 + " " + direction2);
    this.paths = {};
}

function getDirection(from, to) {
    if (from.x === to.x) {
        return to.y > from.y ? 'down' : 'up';
    } else {
        return to.x > from.x ? 'right' : 'left';
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
