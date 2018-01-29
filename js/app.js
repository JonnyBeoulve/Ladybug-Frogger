/*=======================================================================
// The enemy object.
=======================================================================*/
var Enemy = function(xLoc, rowLoc, speed) {
    this.x = xLoc;
    this.y = 60 + ((rowLoc - 1) * 80);
    this.speed = speed / 2;
    this.sprite = 'images/enemy-bug.png';
};

/*=======================================================================
// This function updates the location of the Enemy characters and checks
// if the Player collides with an Enemy. Note that dt is a time delta 
// between ticks. If the enemy reaches the far right of the grid it will
// be moved to the far left (x axis).
=======================================================================*/
Enemy.prototype.update = function(dt) {
    this.x = this.x + this.speed * dt;

    if (Math.abs(this.x - player.x) < 60) {
        if (this.y === player.y) player.death();
    }

    if (this.x > 500) this.x = -100;
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
    this.spriteIndex = 0;
    this.sprite = this.SPRITE_FILES[this.spriteIndex];
}

/*=======================================================================
// All five usable Player sprites are loaded into an array so the user
// can switch instantly upon pressing 'c'.
=======================================================================*/
Player.prototype.SPRITE_FILES = [
	'images/char-boy.png',
	'images/char-cat-girl.png',
	'images/char-horn-girl.png',
	'images/char-pink-girl.png',
	'images/char-princess-girl.png'
];

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
    if (this.y === -20) {
        stats.score();
    }
}

/*=======================================================================
// Upon collision with an enemy the player will be reset and a life will
// be lost.
=======================================================================*/
Player.prototype.death = function() {
    this.x = 200
    this.y = 380;
    stats.lives = stats.lives - 1;

    if(stats.lives === 0) {
        stats.endGame('gameover');
    }
}

/*=======================================================================
// Handle keyboard inputs by the user to move in a 4-directional plane.
// Conditions are included to prevent the player from leaving the grid.
// If the player tries to move into a rock then the movement will be
// prevented.
=======================================================================*/
Player.prototype.handleInput = function(key) {

    if (key === 'left') {
        if (this.x > 0) {
            this.x = this.x - 100;
        }
    } else if (key === 'up') {
        if (this.y > 0) {
            if (this.y === 60) {
                for (var i = 0; i < 4; i++) {
                    if (allRocks[i].x === this.x) {
                        return;
                    }
                }
            }
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
    } else if (key === 'changesprite') {
        if (this.spriteIndex === 4) {
            this.spriteIndex = 0;
            this.sprite = this.SPRITE_FILES[this.spriteIndex];
        } else {
            this.spriteIndex++;
            this.sprite = this.SPRITE_FILES[this.spriteIndex];
        }
    }
}

/*=======================================================================
// The Rock object.
=======================================================================*/
var Rock = function(rowLoc, colLoc) {
    this.x = ((rowLoc) * 100) - 100;
    this.y = colLoc;
    this.sprite = 'images/rock.png';
}

/*=======================================================================
// Render the rock sprite on four of the five water spaces.
=======================================================================*/
Rock.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

/*=======================================================================
// The Stats object.
=======================================================================*/
var Stats = function() {
    this.lives = 3;
    this.points = 0;
    this.heartSprite = 'images/heart.png';
    this.starSprite = 'images/star.png';
}

/*=======================================================================
// Upon reaching the water the player will be reset and given a point.
// If the player has achieved 3 points then a victory screen will
// be displayed with the option to start a new game.
=======================================================================*/
Stats.prototype.score = function() {
    player.x = 200
    player.y = 380;

    this.points++;
    this.render();

    if (this.points === 3) {
        this.endGame('win');
    }
}

/*=======================================================================
// An end game screen that functions as both the failure and victory
// screen depending on the string passed into the function.
=======================================================================*/
Stats.prototype.endGame = function(e) {

    /*=======================================================================
    // Clear grid.
    =======================================================================*/
    allEnemies.forEach(function(e) {
        allEnemies.splice(0, allEnemies.length);
    })

    /*=======================================================================
    // Clear modal before adding text.
    =======================================================================*/
    while(modalDiv.firstChild) {
        modalDiv.removeChild(modalDiv.firstChild);
    }

    /*=======================================================================
    // Prepare text depending on if the user won or lost.
    =======================================================================*/
    modalDiv.style.display = '';
    let modalVictoryHeader = document.createElement('h2');
    modalVictoryHeader.classList.add('modal-victory');

    if(e == 'win') {
        modalVictoryHeader.textContent = 'You Win!';
    } else {
        modalVictoryHeader.textContent = 'Game Over.';
    }

    /*=======================================================================
    // Create Start New Game button.
    =======================================================================*/
    let modalNewGameBtn = document.createElement('button');
    modalNewGameBtn.innerHTML = 'Start New Game';
    modalNewGameBtn.classList.add('modal-new-game');

    /*=======================================================================
    // Append elements, including the close button, to the modal.
    =======================================================================*/
    modalDiv.appendChild(modalVictoryHeader);
    modalDiv.appendChild(modalNewGameBtn);

    /*=======================================================================
    // Create event listener for the close button
    =======================================================================*/
    modalNewGameBtn.addEventListener('click', () => {
        while(modalDiv.firstChild) {
            modalDiv.removeChild(modalDiv.firstChild);
          }
        modalDiv.style.display = 'none';
        this.newGame();
    })
}

/*=======================================================================
// A new game is started upon clicking the Start New Game button.
=======================================================================*/
Stats.prototype.newGame = function() {
    this.lives = 3;
    this.points = 0;
    player.x = 200;
    player.y = 380;

    for (var i = 0; i < 9; i++) {
        var randomXLoc = Math.floor(Math.random() * (1000)) + 1;
        var randomRowLoc = Math.floor(Math.random() * (3)) + 1;
        var randomSpeed = Math.floor(Math.random() * (150)) + 100;
        allEnemies.push(new Enemy(randomXLoc, randomRowLoc, randomSpeed));
    }
}

/*=======================================================================
// This function will display hearts and stars on the top of the screen
// to indicate player lives and points.
=======================================================================*/
Stats.prototype.render = function() {
    var heartXLoc = 0;
    var heartYLoc = -10;
    var starXLoc = 470;
    var starYLoc = -10;

    for (var i = this.lives; i > 0; i--) {
        ctx.drawImage(Resources.get(this.heartSprite), heartXLoc, heartYLoc);
        heartXLoc = heartXLoc + 40;
    }
    for (var k = this.points; k > 0; k--) {
        ctx.drawImage(Resources.get(this.starSprite), starXLoc, starYLoc);
        starXLoc = starXLoc - 40;
    }
}

/*=======================================================================
// Instantiate 10 Enemy, one Player, four Rocks, and one Stats object.
=======================================================================*/
var allEnemies = [];

for (var i = 0; i < 10; i++) {
    var randomXLoc = Math.floor(Math.random() * (1000)) + 1;
    var randomRowLoc = Math.floor(Math.random() * (3)) + 1;
    var randomSpeed = Math.floor(Math.random() * (150)) + 120;
    allEnemies.push(new Enemy(randomXLoc, randomRowLoc, randomSpeed));
}

var allRocks = [];

for (var i = 0; i < 4; i++) {
    var randomColLoc = Math.floor(Math.random() * (5)) + 1;
    allRocks.push(new Rock(randomColLoc, -20));
}

var player = new Player();
var stats = new Stats();

/*=======================================================================
// An event listener that removes one Enemy upon clicking the Easier
// button.
=======================================================================*/
var easier = document.getElementsByClassName("menu-easier")[0];
easier.addEventListener("click", function(e) {
    if (allEnemies.length > 0) {
        allEnemies.splice(allEnemies.length - 1);
    }
})

/*=======================================================================
// An event listener that adds one Enemy upon clicking the Harder
// button.
=======================================================================*/
var harder = document.getElementsByClassName("menu-harder")[0];
harder.addEventListener("click", function(e) {
    if (allEnemies.length < 20) {
        var randomXLoc = Math.floor(Math.random() * (1000)) + 1;
        var randomRowLoc = Math.floor(Math.random() * (3)) + 1;
        var randomSpeed = Math.floor(Math.random() * (150)) + 100;
        allEnemies.push(new Enemy(randomXLoc, randomRowLoc, randomSpeed));
    }
})

/*=======================================================================
// A div will be created to display text within the game area.
=======================================================================*/
var modalDiv = document.getElementById('modal');
modalDiv.style.display = 'none';

/*=======================================================================
// Display application Info within the modal upon clicking the Info
// button.
=======================================================================*/
var info = document.getElementsByClassName("menu-info")[0];
info.addEventListener("click", function(e) {

    /*=======================================================================
    // Clear modal before adding info text.
    =======================================================================*/
    while(modalDiv.firstChild) {
        modalDiv.removeChild(modalDiv.firstChild);
    }

    /*=======================================================================
    // Prepare text to be added to modal.
    =======================================================================*/
    modalDiv.style.display = '';
    let modalInstructionsHeader = document.createElement('h2');
    modalInstructionsHeader.classList.add('modal-header');
    modalInstructionsHeader.textContent = 'Instructions';
    let modalControls = document.createElement('p');
    modalControls.classList.add('modal-text');
    modalControls.textContent = 'Use Arrow Keys to move. Press C to change character.';
    let modalInstructions = document.createElement('p');
    modalInstructions.classList.add('modal-text');
    modalInstructions.textContent = 'Your goal is to navigate across the grid to the water on top while avoiding deadly ladybugs.';
    let modalAboutHeader = document.createElement('h2');
    modalAboutHeader.classList.add('modal-header');
    modalAboutHeader.textContent = 'About';
    let modalAboutText = document.createElement('p');
    modalAboutText.classList.add('modal-text');
    modalAboutText.textContent = 'This program was made by Jonathan Leack using JavaScript.';
    let modalAboutText2 = document.createElement('p');
    modalAboutText2.classList.add('modal-text');
    modalAboutText2.textContent = 'www.JonathanLeack.com';

    /*=======================================================================
    // Create close button for closing the modal window.
    =======================================================================*/
    let modalCloseBtn = document.createElement('button');
    modalCloseBtn.innerHTML = 'X';
    modalCloseBtn.classList.add('modal-close');

    /*=======================================================================
    // Append elements, including the close button, to the modal.
    =======================================================================*/
    modalDiv.appendChild(modalCloseBtn);
    modalDiv.appendChild(modalInstructionsHeader);
    modalDiv.appendChild(modalControls);
    modalDiv.appendChild(modalInstructions);
    modalDiv.appendChild(modalAboutHeader);
    modalDiv.appendChild(modalAboutText);
    modalDiv.appendChild(modalAboutText2);

    /*=======================================================================
    // Create event listener for the close button
    =======================================================================*/
    modalCloseBtn.addEventListener('click', () => {
        closeModal();
    })
})

/* ================================================================
// This function closes the Info modal.
================================================================ */
function closeModal() {
    modalDiv.style.display = 'none';
  
    while(modalDiv.firstChild) {
      modalDiv.removeChild(modalDiv.firstChild);
    }
  }

/*=======================================================================
// An input listener binds the arrow keys on the keyboard to
// move the Player character.
=======================================================================*/
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        67: 'changesprite'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});