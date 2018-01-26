/*=======================================================================
// The enemy object.
=======================================================================*/
var Enemy = function() {
    this.x = 0;
    this.y = 0;
    this.speed = speed;
    this.sprite = 'images/enemy-bug.png';
};

/*=======================================================================
// This function updates the location of the enemy characters.
// Note: dt is a time delta between ticks.
=======================================================================*/
Enemy.prototype.update = function(dt) {
    this.x = this.x + this.speed * dt;
};

/*=======================================================================
// This function will render the Enemies on the screen.
=======================================================================*/
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/*=======================================================================
// The Player object.
=======================================================================*/
var Player = function() {
    this.x = 200;
    this.y = 380;
    this.score = 0;
    this.sprite = 'images/char-boy.png';
}

/*=======================================================================
// Render the player sprite.
=======================================================================*/
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

/*=======================================================================
// Update the location of the player sprite.
=======================================================================*/
Player.prototype.update = function() {
    this.x = this.x;
    this.y = this.y;
}

/*=======================================================================
// Handle keyboard inputs by the user to move in a 4-directional plane.
// Conditions are included to prevent the player from leaving the grid.
=======================================================================*/
Player.prototype.handleInput = function(key) {

    if (key === 'left') {
        if (this.x > 0) {
            this.x = this.x - 100;
        }
    } else if (key === 'up') {
        if (this.y > 0) {
            this.y = this.y - 80;
        }
    } else if (key === 'right') {
        if (this.x < 400) {
            this.x = this.x + 100;
        }
    } else if (key === 'down') {
        if (this.y < 380) {
            this.y = this.y + 80;
        }
    }
}

/*=======================================================================
// Object instantiation.
=======================================================================*/
var allEnemies = [];
var player = new Player();

/*=======================================================================
// An input listener binds the arrow keys on the keyboard to
// move the Player character.
=======================================================================*/
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});