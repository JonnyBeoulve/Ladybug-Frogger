/*=======================================================================
// The modal div will be used to display windows in the center of the
// game field.
=======================================================================*/
let modalDiv = document.getElementById('modal');
modalDiv.style.display = 'none';

/*=======================================================================
// The best score div will display the high score of the user, stored
// using local storagte. It will initially not be displayed.
=======================================================================*/
let highScoreDiv = document.getElementById('high-score');
highScoreDiv.style.display = 'none';

/*=======================================================================
// The countdown div will display the countdown, starting at 30,
// to the user. It will be hidden until Start New Game is clicked.
=======================================================================*/
let countdownDiv = document.getElementById('countdown');
countdownDiv.style.display = 'none';

/*=======================================================================
// The alert div will be used to display text at the center of the
// screen to alert the user to an event. It will disappear after one
// half of a second.
=======================================================================*/
let alertDiv = document.getElementById('alert');
alertDiv.style.display = 'none';

alertText = (text) => {
    let temporaryAlert = document.createElement('h3');
    alertDiv.style.display = '';
    temporaryAlert.textContent = text;
    alertDiv.appendChild(temporaryAlert);

    setTimeout(
        () => {
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
easier.addEventListener("click", (e) => {
    if (allEnemies.length === 3 ) {
        alertText("Minimum enemies reached!")
    } else if (allEnemies.length === 6) {
        spawnEnemies(1); 
        alertText("Easy difficulty initiated.");
    } else if (allEnemies.length === 9) {
        spawnEnemies(2);
        alertText("Normal difficulty initiated.");
    } else if (allEnemies.length === 12) {
        spawnEnemies(3);
        alertText("Hard difficulty initiated.");
    } else {
        console.log("Range error occurred during Easier event listener in ui.js.");
    }
})

/*=======================================================================
// An event listener that adds one Enemy upon clicking the Harder
// button.
=======================================================================*/
let harder = document.getElementsByClassName("menu-harder")[0];
harder.style.display = 'none';
harder.addEventListener("click", (e) => {
    if (allEnemies.length === 3 ) {
        spawnEnemies(2); 
        alertText("Normal difficulty initiated.")
    } else if (allEnemies.length === 6) {
        spawnEnemies(3); 
        alertText("Hard difficulty initiated.");
    } else if (allEnemies.length === 9) {
        spawnEnemies(4); 
        alertText("Insane difficulty initiated.")
    } else if (allEnemies.length === 12) {
        alertText("Maximum enemies reached!")
    } else {
        console.log("Range error occurred during Harder event listener in ui.js.");
    }
})

/*=======================================================================
// An event listener that resets the game.
=======================================================================*/
let reset = document.getElementsByClassName("menu-reset")[0];
reset.style.display = 'none';
reset.addEventListener("click", (e) => {
    stats.newGame('reset');
    alertText("Game restarted.")
})

/*=======================================================================
// Display application Info within the modal upon clicking the Info
// button.
=======================================================================*/
let info = document.getElementsByClassName("menu-info")[0];
info.style.display = 'none';
info.addEventListener("click", (e) => {

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
closeModal = () => {
    modalDiv.style.display = 'none';
  
    while(modalDiv.firstChild) {
      modalDiv.removeChild(modalDiv.firstChild);
    }
}

/*=======================================================================
// Grab high score from local storage if available and display it
// in the bottom div.
=======================================================================*/
displayHighScore = () => {
    const highScore = localStorage.getItem('HighScore');

    if (highScore) {
        highScoreDiv.textContent = `Best Score: ${highScore}`;
    } else {
        highScoreDiv.textContent = 'Best Score: N/A';
    }

    highScoreDiv.style.display = '';
}