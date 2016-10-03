function update() {
    player.update(cursors);

    player_mask.x = Math.round(game.camera.view.centerX);
    player_mask.y = Math.round(game.camera.view.centerY);
    bitmap.draw(shadow).blendDestinationOut().draw(player_mask).blendReset();
}