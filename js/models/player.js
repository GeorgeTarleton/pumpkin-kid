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
    this.sprite.animations.add('swing_down', [32, 33, 34, 35], 8, true);
    this.sprite.animations.add('swing_left', [32, 33, 34, 35], 8, true);
    this.sprite.animations.add('swing_up', [32, 33, 34, 35], 8, true);
    this.sprite.animations.add('swing_right', [32, 33, 34, 35], 8, true);
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


    this.visionMask = game.make.sprite(this.sprite.centerX, this.sprite.centerY, 'mask_70');
    this.visionMask.frame = 0;
    this.visionMask.anchor.set(0.5, 0.5);

    this.visionRadius = 40;

    this.alive = true;
}

Player.prototype.update = function(cursors) {
    var currentAnim = this.sprite.animations.currentAnim;

    this.sprite.body.velocity.set(0, 0);

    if (cursors.up.isDown) {
        this.sprite.body.velocity.set(0, -100);
        if (currentAnim.name != 'walk_up') {
            this.sprite.animations.stop();
            this.sprite.animations.play('walk_up');

            this.weapon.sprite.animations.stop();
            this.weapon.sprite.animations.play('walk_up');
        }
        this.lastDirection = 'up';
    } else if (cursors.down.isDown) {
        this.sprite.body.velocity.set(0, 100);
        if (currentAnim.name != 'walk_down') {
            this.sprite.animations.stop();
            this.sprite.animations.play('walk_down');

            this.weapon.sprite.animations.stop();
            this.weapon.sprite.animations.play('walk_down');
        }
        this.lastDirection = 'down';
    } else if (cursors.left.isDown) {
        this.sprite.body.velocity.set(-100, 0);
        if (currentAnim.name != 'walk_left') {
            this.sprite.animations.stop();
            this.sprite.animations.play('walk_left');

            this.weapon.sprite.animations.stop();
            this.weapon.sprite.animations.play('walk_left');
        }
        this.lastDirection = 'left';
    } else if (cursors.right.isDown) {
        this.sprite.body.velocity.set(100, 0);
        if (currentAnim.name != 'walk_right') {
            this.sprite.animations.stop();
            this.sprite.animations.play('walk_right');

            this.weapon.sprite.animations.stop();
            this.weapon.sprite.animations.play('walk_right');
        }
        this.lastDirection = 'right';
    } else {
        if (!currentAnim.name.match(/(idle)/)) {
            this.sprite.animations.stop();
            this.weapon.sprite.animations.stop();

            if (this.lastDirection == 'down') {
                this.sprite.animations.play('idle_down');
                this.weapon.sprite.animations.play('idle_down');
            } else if (this.lastDirection == 'up') {
                this.sprite.animations.play('idle_up');
                this.weapon.sprite.animations.play('idle_up');
            } else if (this.lastDirection == 'left') {
                this.sprite.animations.play('idle_left');
                this.weapon.sprite.animations.play('idle_left');
            } else if (this.lastDirection == 'right') {
                this.sprite.animations.play('idle_right');
                this.weapon.sprite.animations.play('idle_right');
            }
        }
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