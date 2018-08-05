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