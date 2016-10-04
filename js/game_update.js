var frameCounter = 0;

function update() {
    game.physics.arcade.collide(player.sprite, collisionLayer);
    game.physics.arcade.collide(player.sprite, pumpkins.map(function(p) { return p.sprite }));

    player.update(cursors);

    // manually animate vision circle "flickering"
    if (++frameCounter == 40) {
        frameCounter = 0;
        player_mask.frame = 0;
    }
    if (frameCounter == 30) {
        player_mask.frame = 1;
    }
    player_mask.x = Math.round(player.sprite.centerX);
    player_mask.y = Math.round(player.sprite.centerY);
    bitmap.draw(shadow).blendDestinationOut().draw(player_mask).blendReset();
}