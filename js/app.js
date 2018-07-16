/*=======================================================================
// The alert div will be used to display text at the center of the
// screen to alert the user to an event. It will disappear after one
// second.
=======================================================================*/
let alertDiv = document.getElementById('alert');
alertDiv.style.display = 'none';

function alertText(text) {
    alertDiv.style.display = '';
    let temporaryAlert = document.createElement('h3');
    temporaryAlert.textContent = text;
    alertDiv.appendChild(temporaryAlert);

    setTimeout(
        function() {
            alertDiv.style.display = 'none';
            alertDiv.removeChild(alertDiv.firstChild);
        }, 500
    );
}

/*=======================================================================
// An event listener that removes one Enemy upon clicking the Easier
// button.
=======================================================================*/
let easier = document.getElementsByClassName("menu-easier")[0];
easier.style.display = 'none';
easier.addEventListener("click", function(e) {
    if (allEnemies.length > 5) {
        allEnemies.splice(allEnemies.length - 1);
        alertText("Removed one enemy!");
    } else {
        alertText("Can't remove an enemy!");
    }
})

/*=======================================================================
// An event listener that adds one Enemy upon clicking the Harder
// button.
=======================================================================*/
let harder = document.getElementsByClassName("menu-harder")[0];
harder.style.display = 'none';
harder.addEventListener("click", function(e) {
    if (allEnemies.length < 15) {
        let randomXLoc = Math.floor(Math.random() * (1000)) + 1;
        let randomRowLoc = Math.floor(Math.random() * (3)) + 1;
        let randomSpeed = Math.floor(Math.random() * (150)) + 100;
        allEnemies.push(new Enemy(randomXLoc, randomRowLoc, randomSpeed));
        alertText("Added one enemy!");
    } else {
        alertText("Can't add an enemy!");
    }
})

/*=======================================================================
// An event listener that resets the game.
=======================================================================*/
let reset = document.getElementsByClassName("menu-reset")[0];
reset.style.display = 'none';
reset.addEventListener("click", function(e) {
    stats.newGame('reset');
})

/*=======================================================================
// Display application Info within the modal upon clicking the Info
// button.
=======================================================================*/
let info = document.getElementsByClassName("menu-info")[0];
info.style.display = 'none';
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
    modalAboutText.textContent = 'This program was made by Jonathan Leack.';
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
    let allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        67: 'changesprite'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

/*=======================================================================
// The enemy object.
=======================================================================*/
let Enemy = function(xLoc, rowLoc, speed) {
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
let Player = function() {
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
// Update the location of the player sprite. Render a score if the
// player reaches water and add 3 seconds to the countdown timer.
=======================================================================*/
Player.prototype.update = function() {
    this.x = this.x;
    this.y = this.y;

    if (this.y === -20) {
        stats.score();
        stats.timer = stats.timer + 3;
        alertText("You scored!");
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
                for (let i = 0; i < 4; i++) {
                    if (allRocks[i].x === this.x) {
                        alertText("Can't move there!");
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
            alertText("Changed character!");
        } else {
            this.spriteIndex++;
            this.sprite = this.SPRITE_FILES[this.spriteIndex];
            alertText("Changed character!");
        }
    }
}

/*=======================================================================
// The Rock object.
=======================================================================*/
let Rock = function(rowLoc, colLoc) {
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
let Stats = function() {
    this.lives = 3;
    this.points = 0;
    this.timer = 30;
    this.firstStart = true;
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

    allEnemies = [];
    spawnEnemies();

    allRocks = [];
    spawnRocks();

    if (this.points === 3) {
        this.endGame('win');
    }
}

/*=======================================================================
// The modal div will be used to display windows in the center of the
// game field.
=======================================================================*/
let modalDiv = document.getElementById('modal');
modalDiv.style.display = 'none';

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
    // Clear modal before adding text and hide menu buttons.
    =======================================================================*/
    if (e == 'win' || e == 'gameover') {
        while(modalDiv.firstChild) {
            modalDiv.removeChild(modalDiv.firstChild);
        }
    }
    easier.style.display = 'none';
    harder.style.display = 'none';
    reset.style.display = 'none';
    info.style.display = 'none';

    /*=======================================================================
    // Prepare text depending on if the user won or lost.
    =======================================================================*/
    modalDiv.style.display = '';
    let modalVictoryHeader = document.createElement('h2');
    modalVictoryHeader.classList.add('modal-victory');

    if (e == 'win') {
        modalVictoryHeader.textContent = 'You Win. Congrats!';
    } else if (e == 'gameover') {
        modalVictoryHeader.textContent = 'Game Over';
    } else if (e == 'intro') {
        modalVictoryHeader.textContent = 'Get Ready';
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
// A new game is started upon clicking the Start New Game button. Also,
// the menu buttons will be shown during play. The first start
// condition is used to ensure only one countdown is created.
=======================================================================*/
Stats.prototype.newGame = function(e) {
    this.timer = 30;
    this.lives = 3;
    this.points = 0;
    player.x = 200;
    player.y = 380;
    document.getElementById("countdown").style.backgroundColor = "hsla(224, 56%, 52%, 0.945)";

    easier.style.display = '';
    harder.style.display = '';
    reset.style.display = '';
    info.style.display = '';

    allRocks = [];
    spawnRocks();
    spawnEnemies();

    if (this.firstStart === true) {
        countdownTimer();
        this.firstStart = false;
    } else {
        return;
    }
}

/*=======================================================================
// This function will display hearts and stars on the top of the screen
// to indicate player lives and points. Also, reduce timer every one
// second until it reaches 0, at which point the game ends.
=======================================================================*/
Stats.prototype.render = function() {
    let heartXLoc = 0;
    let heartYLoc = -10;
    let starXLoc = 470;
    let starYLoc = -10;

    for (let i = this.lives; i > 0; i--) {
        ctx.drawImage(Resources.get(this.heartSprite), heartXLoc, heartYLoc);
        heartXLoc = heartXLoc + 40;
    }
    for (let k = this.points; k > 0; k--) {
        ctx.drawImage(Resources.get(this.starSprite), starXLoc, starYLoc);
        starXLoc = starXLoc - 40;
    }
}

/*=======================================================================
// Two Enemies will be instantiated per row. Each row has a randomized
// speed for its Enemies, although all Enemies sharing a row move at
// the same speed (for a better game experience).
=======================================================================*/
function spawnEnemies() {
    allEnemies = [];
    
    for (let i = 0; i < 3; i++) {
        if (i === 0) {
            let randomSpeed = Math.floor(Math.random() * (150)) + 120;
                for (let k = 0; k < 2; k++) {
                    let randomXLoc = Math.floor(Math.random() * (1000)) + 1;
                    allEnemies.push(new Enemy(randomXLoc, 1, randomSpeed));
                }
        } else if (i === 1) {
            let randomSpeed = Math.floor(Math.random() * (150)) + 120;
                for (let k = 0; k < 2; k++) {
                    let randomXLoc = Math.floor(Math.random() * (1000)) + 1;
                    allEnemies.push(new Enemy(randomXLoc, 2, randomSpeed));
                }
        } else if (i === 2) {
            let randomSpeed = Math.floor(Math.random() * (150)) + 120;
                for (let k = 0; k < 2; k++) {
                    let randomXLoc = Math.floor(Math.random() * (1000)) + 1;
                    allEnemies.push(new Enemy(randomXLoc, 3, randomSpeed));
                }
        }
    }
}

/*=======================================================================
// Four Rocks will be spawned in the water at the top of the map
// preventing the Player from moving into that space. Rock will not
// spawn in the same location, and only one water space will be
// open for the Player to move to.
=======================================================================*/
function spawnRocks() {
    let colNums = [1, 2, 3, 4, 5];
    let randomRockIndex = Math.floor(Math.random() * 5);
    colNums.splice(randomRockIndex, 1);

    for (let i = 0; i < colNums.length; i++) {
        allRocks.push(new Rock(colNums[i], -20));
    }
}

/*=======================================================================
// A countdown timer will count from 30 down to 0. If it reaches 0
// the player will lose. Time will be added if the player earns a point.
=======================================================================*/
function countdownTimer() {
    document.getElementById("countdown").innerHTML = stats.timer;

    let x = setInterval(function() {
        if (stats.timer > 0 && stats.points != 3) {
            stats.timer--;
        } else if (stats.timer === 0 && stats.points != 3) {
            stats.endGame('gameover');
            return;
        }

        if (stats.timer === 5) {
            alertText("5 seconds left!");
            document.getElementById("countdown").style.backgroundColor = "rgba(255, 0, 0, 0.767)";
        }

        document.getElementById("countdown").innerHTML = stats.timer;
    }, 1000);
}

/*=======================================================================
// Instantiate Enemy, Rock, Player, and Stats objects.
=======================================================================*/
let allEnemies = [];
let allRocks = [];
let player = new Player();
let stats = new Stats();

/*=======================================================================
// Executes introduction page which includes text and a start button.
=======================================================================*/
function introduction() {
    stats.endGame('intro');
}

introduction();