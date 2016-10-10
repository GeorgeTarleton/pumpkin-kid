var Pumpkin = function(spriteX, spriteY) {
    this.sprite = pumpkinsLayer.create(spriteX, spriteY, 'pumpkin');

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

    this.hp = 500;

    this.hpBar = pumpkinsLayer.create(6, -5, 'pumpkin_hp');
    this.hpBarOverlay = pumpkinsLayer.create(17, 1, 'pumpkin_hp_overlay');
    this.hpBarOverlay.scale.set(0, 1);
    this.hpBar.addChild(this.hpBarOverlay);
    this.sprite.addChild(this.hpBar);
}

Pumpkin.prototype.diminishHp = function() {
    this.hpTimer.add(20000, this.diminishHp, this);
    if (this.hpTimer.running) {
        this.hp -= 100;
        this.hpBarOverlay.scale.set(-3 * Math.floor((500 - this.hp)/100), 1);
        if (this.hp === 0) {
            this.hpTimer.destroy();
            this.itemSpawnClock.destroy();
            this.sprite.animations.play('dead');
            this.isOn = false;
        }
    } else {
        this.hpTimer.start();
    }
}

Pumpkin.prototype.heal = function() {
    if (this.hp === 0) {
        this.isOn = true;
        this.sprite.animations.play('on');

        this.itemSpawnClock = game.time.create(false);
        this.spawnItem();

        this.hpTimer = game.time.create(false);
        this.diminishHp();
    }
    this.hp += 100;
    this.hpBarOverlay.scale.set(-3 * Math.floor((500 - this.hp)/100), 1);
}

Pumpkin.prototype.spawnItem = function() {
    this.itemSpawnClock.add(game.rnd.integerInRange(7500, 12500), this.spawnItem, this);
    if (this.itemSpawnClock.running) {
        var itemKey;
        var rand = game.rnd.integerInRange(1, 100);
        if (rand <= 50) {
            itemKey = 'candy';
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
        item.animations.add('hover', [0, 1, 2, 3], 4, true);
        item.animations.play('hover');

        var t = game.time.create(true);
        t.add(20000, function() { if (item.alive) item.kill(); }, this);    // kill item after 20s if not picked up
        t.start();
    } else {
        this.itemSpawnClock.start();
    }
}

Pumpkin.prototype.toggle = function() {
    if (this.hp === 0) return;

    this.sprite.animations.stop();
    this.isOn = !this.isOn;
    if (this.isOn) {
        this.sprite.animations.play('on');

        this.itemSpawnClock = game.time.create(false);
        this.spawnItem();

        this.hpTimer = game.time.create(false);
        this.diminishHp();
    } else {
        this.sprite.animations.play('off');
        this.itemSpawnClock.destroy();
        this.hpTimer.destroy();
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