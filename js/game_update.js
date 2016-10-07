var visionClock = 0;

function update() {
    // manually create clock to animate vision "flickering" for lighted objects
    // 1 cycle = 40 frames
    if (++visionClock == 40) visionClock = 0;


    game.physics.arcade.collide(player.sprite, collisionLayer);
    game.physics.arcade.collide(player.sprite, entitiesLayer);
    game.physics.arcade.collide(entitiesLayer, entitiesLayer);
    game.physics.arcade.collide(entitiesLayer, collisionLayer);
    game.physics.arcade.collide(player.sprite, pumpkins.map(function(p) { return p.sprite }));

    game.physics.arcade.overlap(player.meleeHitbox, entitiesLayer, knockbackEnemies, null, this);

    player.update(cursors);

    // draw vision reveal masks
    bitmap.draw(shadow).blendDestinationOut()
    player.updateVisionMask();
    pumpkins.forEach(function(pumpkin) {
        pumpkin.updateVisionMask();
    });
    bitmap.blendReset();

    // update enemies
    for (var type in enemies) {
        if (enemies.hasOwnProperty(type)) {
            enemies[type].forEach(function(e) {
                e.update();
            });
        }
    }
}

function knockbackEnemies(hitbox, enemy) {
    enemy.knockback = true;
    // find the enemy(s) that's being hit
    for (var type in enemies) {
        if (enemies.hasOwnProperty(type)) {
            enemies[type].forEach(function(e) {
                if (e.sprite.knockback && !e.isKnockedBack) {
                    e.takeDamage();
                }
            });
        }
    }
    enemy.knockback = false;
}