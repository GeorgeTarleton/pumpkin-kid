function update() {
    game.physics.arcade.collide(player.sprite, collisionLayer);

    player.update(cursors);

    player_mask.x = Math.round(player.sprite.centerX);
    player_mask.y = Math.round(player.sprite.centerY);
    bitmap.draw(shadow).blendDestinationOut().draw(player_mask).blendReset();
}