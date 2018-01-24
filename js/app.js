/*=======================================================================
// Constants.
=======================================================================*/


/*=======================================================================
// Enemies.
=======================================================================*/
var Enemy = function() {
    // Variables applied to each of our instances go here

    // The image/sprite for our enemies, this uses
    // a helper
    this.sprite = 'images/enemy-bug.png';
};

/*=======================================================================
// This class defines the Enemy characters in the game.
// Note: dt is a time delta between ticks.
=======================================================================*/
Enemy.prototype.update = function(dt) {
    // Multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // everyone who plays.

};

/*=======================================================================
// This function will render the Enemies on the screen.
=======================================================================*/
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/*=======================================================================
// Player class
=======================================================================*/
class Player {
    update() {

    }

    render() {

    }

    handleInput() {

    }
}

/*=======================================================================
// Object instantiation.
=======================================================================*/
var allEnemies = [];
var player = Player;

/*=======================================================================
// This player input listener binds the arrow keys on the keyboard to
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
