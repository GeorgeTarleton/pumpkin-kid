var visionClock = 0;

function update() {
    // manually create clock to animate vision "flickering" for lighted objects
    // 1 cycle = 40 frames
    if (++visionClock == 40) visionClock = 0;


    game.physics.arcade.collide(player.sprite, collisionLayer);
    game.physics.arcade.collide(player.sprite, pumpkins.map(function(p) { return p.sprite }));

    player.update(cursors);

    // draw vision reveal masks
    bitmap.draw(shadow).blendDestinationOut()
    player.updateVisionMask();
    pumpkins.forEach(function(pumpkin) {
        pumpkin.updateVisionMask();
    });
    bitmap.blendReset();
}