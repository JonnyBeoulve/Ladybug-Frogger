/*=======================================================================
// The enemy object.
=======================================================================*/
var Enemy = function(x_loc, row_loc, speed) {
    this.x = x_loc;
    this.y = 60 + ((row_loc - 1) * 80);
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
    this.points = 0;
    this.lives = 3;
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
    this.lives = this.lives - 1;
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
// The Stats object.
=======================================================================*/
var Stats = function() {
    this.points = 0;
}

/*=======================================================================
// Upon reaching the water the player will be reset and given a point.
=======================================================================*/
Stats.prototype.score = function() {
    player.x = 200
    player.y = 380;

    this.points++;

    if (this.points === 3) {
        console.log("YOU WIN!");
    }
}

/*=======================================================================
// Instantiate seven Enemy, one Player, and one Stats object.
=======================================================================*/
var allEnemies = [];

for (var i = 0; i < 9; i++) {
    var random_x_loc = Math.floor(Math.random() * (1000)) + 1;
    var random_row_loc = Math.floor(Math.random() * (3)) + 1;
    var random_speed = Math.floor(Math.random() * (100)) * 5;
    allEnemies.push(new Enemy(random_x_loc, random_row_loc, random_speed));
}

var player = new Player();
var stats = new Stats();

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

/*=======================================================================
// A div will be created for the info modal which will display
// application information upon clicking the info button.
=======================================================================*/
var modalDiv = document.getElementById('modal');
modalDiv.style.display = 'none';

var info = document.getElementsByClassName("info-btn")[0];
info.addEventListener("click", function(e){
    modalDiv.style.display = '';
    let modalInstructionsHeader = document.createElement('h2');
    modalInstructionsHeader.classList.add('modal-header');
    modalInstructionsHeader.textContent = 'Instructions';
    let modalControls = document.createElement('p');
    modalControls.classList.add('modal-text');
    modalControls.textContent = 'Arrow Keys to move. C to change character.';
    let modalInstructions = document.createElement('p');
    modalInstructions.classList.add('modal-text');
    modalInstructions.textContent = 'Your goal is to navigate across the grid to the water on top while avoiding deadly ladybugs.';
    let modalAboutHeader = document.createElement('h2');
    modalAboutHeader.classList.add('modal-header');
    modalAboutHeader.textContent = 'About';
    let modalAboutText = document.createElement('p');
    modalAboutText.classList.add('modal-text');
    modalAboutText.textContent = 'This program was made by Jonathan Leack using JavaScript.';

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