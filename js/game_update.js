var frameCounter = 0;
var visionMaskFull = true;

function update() {
    // manually animate vision circle "flickering"
    if (++frameCounter == 40) {
        frameCounter = 0;
        visionMaskFull = true;
    } else if (frameCounter == 30) {
        visionMaskFull = false;
    }


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