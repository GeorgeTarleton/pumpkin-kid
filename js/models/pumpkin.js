var Pumpkin = function(spriteX, spriteY) {
    this.sprite = entitiesLayer.create(spriteX, spriteY, 'pumpkin');

    this.isOn = false;

    this.sprite.animations.add('off', [2], 0, false);
    this.sprite.animations.add('on', [0, 1], 4, true);
    this.sprite.animations.add('dead', [4, 5], 4, true);
    this.sprite.animations.play('off');

    game.physics.arcade.enable(this.sprite);
    this.sprite.body.immovable = true;
    this.sprite.body.setSize(20, 16, 6, 0);

    this.visionMask = game.make.sprite(this.sprite.centerX, this.sprite.centerY, 'mask_50');
    this.visionMask.frame = 0;
    this.visionMask.anchor.set(0.5, 0.5);

    this.visionClockStart = game.rnd.integerInRange(0, 40);
}

Pumpkin.prototype.spawnItem = function() {
    this.itemSpawnClock.add(game.rnd.integerInRange(7500, 12500), this.spawnItem, this);
    if (this.itemSpawnClock.running) {
        var itemKey;
        var rand = game.rnd.integerInRange(1, 100);
        if (rand <= 33) {
            itemKey = 'candy';
        } else if (rand <= 67) {
            itemKey = 'candle';
        } else {
            itemKey = 'loot';
        }

        // spawn within 16 to 50 px from the center of pumpkin
        var item = itemsLayer.create(
            this.sprite.centerX + game.rnd.integerInRange(16, 50) * (game.rnd.integerInRange(0, 1) ? -1 : 1),
            this.sprite.centerY + game.rnd.integerInRange(16, 50) * (game.rnd.integerInRange(0, 1) ? -1 : 1),
            itemKey
        );
        game.physics.arcade.enable(item);
        item.animations.add('hover', [0, 1, 2, 3], 8, true);
        item.animations.play('hover');

        var t = game.time.create(true);
        t.add(20000, function() { if (item.alive) item.kill(); }, this);    // kill item after 20s if not picked up
        t.start();
    } else {
        this.itemSpawnClock.start();
    }
}

Pumpkin.prototype.toggle = function() {
    this.sprite.animations.stop();
    this.isOn = !this.isOn;
    if (this.isOn) {
        this.sprite.animations.play('on');
        this.itemSpawnClock = game.time.create(false);
        this.spawnItem();
    } else {
        this.sprite.animations.play('off');
        this.itemSpawnClock.destroy();
    }
}

Pumpkin.prototype.updateVisionMask = function() {
    if (this.isOn) {
        // create light flicker effect
        if (visionClock == this.visionClockStart) {
            this.visionMask.frame = 0;
        } else if (visionClock == ((this.visionClockStart + 30) % 40)) {
            this.visionMask.frame = 1;
        }
        bitmap.draw(this.visionMask);
    }
}