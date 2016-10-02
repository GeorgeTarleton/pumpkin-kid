function update() {


    if (cursors.up.isDown)
    {
        player.sprite.body.y -= 4;
    }
    else if (cursors.down.isDown)
    {
        player.sprite.body.y += 4;
    }

    if (cursors.left.isDown)
    {
        player.sprite.body.x -= 4;
    }
    else if (cursors.right.isDown)
    {
        player.sprite.body.x += 4;
    }
}