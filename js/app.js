/*=======================================================================
// An input listener binds the arrow keys on the keyboard to move the 
// Player character. Tapping C will change the sprite.
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
// The enemy object. The constructor will determine the x and y location
// in addition to movement speed. The enemy will be portrayed as a
// ladybug moving left to right.
=======================================================================*/
class Enemy {
    constructor(xLoc, rowLoc, speed) {
        this.x = xLoc;
        this.y = 60 + ((rowLoc - 1) * 80);
        this.speed = speed / 2;
        this.sprite = 'images/enemy-bug.png';
    }

    /*=======================================================================
    // This function updates the location of the Enemy characters and checks
    // if the Player collides with an Enemy. Note that dt is the time delta 
    // between ticks. If the enemy reaches the far right of the grid it will
    // be moved to the far left (x axis).
    =======================================================================*/
    update(dt) {
        this.x = this.x + this.speed * dt;

        if (Math.abs(this.x - player.x) < 60) {
            if (this.y === player.y) player.death();
        }
    
        if (this.x > 500) this.x = -100;
    }
    /*=======================================================================
    // This function will render the Enemies on the screen.
    =======================================================================*/
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
};

/*=======================================================================
// The Player object. The contructor will continually house the x and
// y location of the Player as well as a sprite index that dictates
// which sprite the character is represented by. This can be changed by
// the Player by pressing C.
=======================================================================*/
class Player {
    constructor() {
        this.x = 200;
        this.y = 380;
        this.spriteIndex = 0;
        this.SPRITE_FILES = [
            'images/char-boy.png',
            'images/char-cat-girl.png',
            'images/char-horn-girl.png',
            'images/char-pink-girl.png',
            'images/char-princess-girl.png'
        ]
        this.sprite = this.SPRITE_FILES[this.spriteIndex];
    }

    /*=======================================================================
    // This function will update the location of the Player character.
    // If the user is located at the top row of the game field, they score.
    =======================================================================*/
    update() {
        this.x = this.x;
        this.y = this.y;
    
        if (this.y === -20) {
            stats.score();
            stats.timer = stats.timer + 3;
            alertText("You scored!");
        }
    }

    /*=======================================================================
    // This function will render the Player on the screen.
    =======================================================================*/
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    /*=======================================================================
    // Upon collision with an enemy the player will be reset and a life will
    // be lost. If lives equal zero, the player loses.
    =======================================================================*/
    death() {
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
    handleInput(key) {
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
}

/*=======================================================================
// The Rock object.
=======================================================================*/
class Rock {
    constructor(rowLoc, colLoc) {
        this.x = ((rowLoc) * 100) - 100;
        this.y = colLoc;
        this.sprite = 'images/rock.png';
    }

    /*=======================================================================
    // Render the rock sprite on four of the five water spaces.
    =======================================================================*/
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}

/*=======================================================================
// The Stats object.
=======================================================================*/
class Stats {
    constructor() {
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
    score() {
        this.points++;
        this.render();
        player.x = 200
        player.y = 380;
        allEnemies = [];
        allRocks = [];
        spawnEnemies(2);
        spawnRocks();
    
        if (this.points === 3) {
            this.endGame('win');
        }
    }

    /*=======================================================================
    // An end game screen that functions as both the failure and victory
    // screen depending on the string passed into the function. High
    // scores are stored in local storage for comparison in future 
    // completions.
    =======================================================================*/
    endGame(e) {
        // Clear grid.
        allEnemies.forEach(function(e) {
            allEnemies.splice(0, allEnemies.length);
        })

        // Clear modal before adding text and hide menu buttons.
        if (e == 'win' || e == 'gameover') {
            while(modalDiv.firstChild) {
                modalDiv.removeChild(modalDiv.firstChild);
            }
        }
        easier.style.display = 'none';
        harder.style.display = 'none';
        reset.style.display = 'none';
        info.style.display = 'none';

        // Prepare text depending on if the user won or lost.
        modalDiv.style.display = '';
        let modalVictoryHeader = document.createElement('h2');
        modalVictoryHeader.classList.add('modal-victory');

        // If player won, grab previous high score from local storage (if available)
        // and compare to determine if a new high score needs to be stored.
        if (e == 'win') {
            const prevHighScore = localStorage.getItem('HighScore');
            const finalScore = ((this.lives * 100) + (this.timer * 10));
            modalVictoryHeader.textContent = `You Win! ${finalScore} pts`;
            highScoreDiv.style.display = 'none';

            // If no previous score has been set, or new score beats old score, set local storage item
            if (!prevHighScore || (prevHighScore < finalScore)) {
                localStorage.setItem('HighScore', finalScore);
                displayHighScore();
            }

        } else if (e == 'gameover') {
            modalVictoryHeader.textContent = 'Game Over';
            countdownDiv.style.display = 'none';
            highScoreDiv.style.display = 'none';
        } else if (e == 'intro') {
            modalVictoryHeader.textContent = 'Get Ready';
        }

        // Create Start New Game button.
        let modalNewGameBtn = document.createElement('button');
        modalNewGameBtn.innerHTML = 'Start New Game';
        modalNewGameBtn.classList.add('modal-new-game');

        // Append elements, including the close button, to the modal.
        modalDiv.appendChild(modalVictoryHeader);
        modalDiv.appendChild(modalNewGameBtn);

        // Create event listener for the close button
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
    newGame(e) {
        this.timer = 30;
        this.lives = 3;
        this.points = 0;
        player.x = 200;
        player.y = 380;
        document.getElementById("countdown").style.backgroundColor = "hsla(224, 56%, 52%, 0.945)";
    
        countdownDiv.style.display = '';
        easier.style.display = '';
        harder.style.display = '';
        reset.style.display = '';
        info.style.display = '';
    
        allRocks = [];
        spawnRocks();
        spawnEnemies(2);
        displayHighScore();
    
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
    render() {
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
}

/*=======================================================================
// Executes introduction page which includes text and a start button.
=======================================================================*/
introduction = () => {
    stats.endGame('intro');
}

/*=======================================================================
// Enemies will be instantiated within each row depending upon the passed
// in argument numOfEnemies. Each row has a randomized speed for its
// Enemies, although all Enemies sharing a row move at the same speed 
// (for a better game experience).
=======================================================================*/
spawnEnemies = (numOfEnemies) => {
    allEnemies = [];

    spawnEnemyRow = (rowNum, numEnemies) => {
        let randomSpeed = Math.floor(Math.random() * (150)) + 260;
        for (let k = 0; k < numEnemies; k++) {
            let randomXLoc = Math.floor((Math.random() * (((k + 1) * 80))) + ((k + 1) * 80) - 160);
            allEnemies.push(new Enemy(randomXLoc, rowNum, randomSpeed));
        }
    }

    spawnEnemyRow(1, numOfEnemies);
    spawnEnemyRow(2, numOfEnemies);
    spawnEnemyRow(3, numOfEnemies);
}

/*=======================================================================
// Four Rocks will be spawned in the water at the top of the map
// preventing the Player from moving into that space. Rock will not
// spawn in the same location, and only one water space will be
// open for the Player to move to.
=======================================================================*/
spawnRocks = () => {
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
countdownTimer = () => {
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
// Instantiate Enemy, Rock, Player, and Stats objects before presenting
// user with introduction screen upon initial load.
=======================================================================*/
let allEnemies = [];
let allRocks = [];
let player = new Player();
let stats = new Stats();
introduction();