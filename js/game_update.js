function update() {
    player.sprite.body.setZeroVelocity();

    if (cursors.up.isDown)
    {
        player.sprite.body.moveUp(100);
        // player.sprite.body.y -= 4;
    }
    else if (cursors.down.isDown)
    {
        player.sprite.body.moveDown(100);
        // player.sprite.body.y += 4;
    }

    if (cursors.left.isDown)
    {
        player.sprite.body.moveLeft(100);
        // player.sprite.body.x -= 4;
    }
    else if (cursors.right.isDown)
    {
        player.sprite.body.moveRight(100);
        // player.sprite.body.x += 4;
    }
}