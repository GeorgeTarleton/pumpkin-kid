var visionClock = 0;

function update() {
    if (!player) return;

    // manually create clock to animate vision "flickering" for lighted objects
    // 1 cycle = 40 frames
    if (++visionClock == 40) visionClock = 0;


    game.physics.arcade.collide(player.sprite, collisionLayer);
    game.physics.arcade.collide(player.sprite, pumpkinsLayer);
    game.physics.arcade.collide(player.sprite, entitiesLayer, playerHit);
    game.physics.arcade.overlap(player.sprite, itemsLayer, itemPickup);
    game.physics.arcade.collide(entitiesLayer, entitiesLayer);
    game.physics.arcade.collide(entitiesLayer, pumpkinsLayer, damagePumpkin);
    game.physics.arcade.collide(entitiesLayer, collisionLayer);
    game.physics.arcade.collide(bulletsLayer, collisionLayer, bulletHitObject, null, this);
    game.physics.arcade.collide(bulletsLayer, entitiesLayer, bulletHitEnemy, null, this);
    game.physics.arcade.collide(bulletsLayer, pumpkinsLayer, bulletHitObject, null, this);
    game.physics.arcade.collide(player.sprite, pumpkins.map(function(p) { return p.sprite }));

    game.physics.arcade.overlap(player.meleeHitbox, entitiesLayer, meleeDamage, null, this);

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

    if (player.score > 3000){
        stage = 5;
    } else if (player.score > 2000) {
        stage = 4;
    } else if (player.score > 1000) {
        stage = 3;
    } else if (player.score > 500) {
        stage = 2;
    } else if (player.score > 200) {
        stage = 1;
    }
}

function playerHit(p, enemy) {
    // find the enemy that's hitting the player
    enemy.hitting = true;
    for (var type in enemies) {
        if (enemies.hasOwnProperty(type)) {
            enemies[type].forEach(function(e) {
                if (e.sprite.hitting && !e.isAttacking) {
                    e.attack();
                    player.takeDamage(e);
                }
            });
        }
    }
    enemy.hitting = false;
}

function meleeDamage(hitbox, enemy) {
    enemy.knockback = true;
    // find the enemy(s) that's being hit
    for (var type in enemies) {
        if (enemies.hasOwnProperty(type)) {
            enemies[type].forEach(function(e) {
                if (e.sprite.knockback && !e.isKnockedBack) {
                    e.takeDamage('melee');
                }
            });
        }
    }
    enemy.knockback = false;
}

function bulletHitObject(bullet, collisionObject) {
    bullet.kill();
}

function bulletHitEnemy(bullet, enemy) {
    bullet.kill();

    enemy.shot = true;
    for (var type in enemies) {
        if (enemies.hasOwnProperty(type)) {
            enemies[type].forEach(function(e) {
                if (e.sprite.shot) {
                    e.takeDamage('ranged');
                }
            });
        }
    }
    enemy.shot = false;
}

function itemPickup(p, item) {
    player.pickUpItem(item.key);
    item.kill();
}

function damagePumpkin(enemy, pumpkin) {
    // PIVOT
}