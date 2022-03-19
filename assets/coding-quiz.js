// html elements that are used frequently
var timerTag = document.querySelector(`#timerTag`); 
var timerPTag  = document.querySelector(`header`).children[1]; 
var submitHighscoreBtn = document.querySelector(`#submitHighscore`); 
var viewHighscoresBtn = document.querySelector(`#highscoresBtn`); 
var clearHighscoreBtn = document.querySelector(`#clearHighscores`); 
var answerButtonLst = document.body.querySelector(`ul`); 
var goBackHighscoreBtn = document.querySelector(`#goBack`); 
var startBtn = document.querySelector(`#startBtn`); 
var titleTag = document.querySelector(`#title`) 

// Question and answer object with arrays
var questionObj = { 
    questions: [ 
        `What keyword is used to end the "else if" statement?`,
        `Which name is acceptable for a JavaScript variable?`,
        `What character is used to separate parameters from each other?`,
        `What is the correct syntax for referring to an external script called "xxx.js"?`,
        `When is the "return" statement most frequently used?`,
    ],
    answers: [ 
        [`stop`, `end`, `correct:else`, `break`],
        [`correct:_module`, `total%sum`, `1tv`, `firstnumber`],
        [`&`, `:`, `;`, `correct:,`], 
        [`correct:<script src="xxx.js">`, `<script name="xxx.js">`, `<script href="xxx.js">`, `<script link="xxx.js">`],
        [`to stop a loop`, `to add a pop-up window to the screen`, `correct:to make a calculation and receive the result`, `to input data`] 
    ] 
}

// Timer settings
var globalTimerPreset = 75;

// Quiz variables
var questionIndexNumber = 0; 
var timeLeft = globalTimerPreset; 
var score = 0; 
var gameEnded = true; 

// Intial setup for the game 
function setUpGame() {
    timeLeft = globalTimerPreset; 
    timerTag.textContent = globalTimerPreset; 

    // Hides elements that may be visible after a previous round
    document.querySelector(`#display-highscore-div`).style.display = `none`; 

    titleTag.textContent = `Coding Quiz Challenge`; 

    titleTag.style.display = `block`; 
    document.querySelector(`#instructions`).style.display = `block`; 
    viewHighscoresBtn.style.display = `block`; 
    startBtn.style.display = `block`; 

    return;
}

// Gets triggered if the "Start Quiz" gets clicked
function startGame() {
    gameEnded = false; 
    questionIndexNumber = 0; 

    viewHighscoresBtn.style.display = `none` 
    startBtn.style.display = `none`; 
    document.querySelector(`#instructions`).style.display = `none`; 
    timerPTag.style.display = `block`; 

    showQuestions(questionIndexNumber); 
    startTimer(); 

    return;
}

// Timer intervals
function startTimer() {
    var timerInterval = setInterval(function() {
        if(gameEnded === true) { 
            clearInterval(timerInterval); 
            return;
        }
        if(timeLeft < 1) { 
            clearInterval(timerInterval); 
            endGame(); 
        }

        timerTag.textContent = timeLeft; 
        timeLeft--; 
    }, 1000); 

    return;
}

// Function to show questions and answers
function showQuestions(currentQuestionIndex) {
    titleTag.textContent = questionObj.questions[currentQuestionIndex]; 
    createAnswerElements(currentQuestionIndex); 

    return;
}

// Creates new answer elements in the answer list will clear out previous answers
function createAnswerElements(currentQuestionIndex) {
    answerButtonLst.innerHTML = ''; 

    for (let answerIndex = 0; answerIndex < questionObj.answers[currentQuestionIndex].length; answerIndex++) { 
        var currentAnswerListItem = document.createElement(`li`); 
        var tempStr = questionObj.answers[currentQuestionIndex][answerIndex]; 

        if (questionObj.answers[currentQuestionIndex][answerIndex].includes(`correct:`)){
            tempStr = questionObj.answers[currentQuestionIndex][answerIndex].substring(8, questionObj.answers[currentQuestionIndex][answerIndex].length); 
            currentAnswerListItem.id = `correct`; 
        }

        currentAnswerListItem.textContent = tempStr; 
        answerButtonLst.appendChild(currentAnswerListItem); 
    }

    return;
}

// When called will iterate to the next question and show the next question content
function nextQuestion() {
    questionIndexNumber++; 
    if (questionIndexNumber >= questionObj.questions.length){ 
        endGame(); 
    } else { 
        showQuestions(questionIndexNumber); 
    } 

    return;
}

// End of game function
function endGame() { 
    gameEnded = true; 
    score = timeLeft; 

    // Hide necessary elements
    timerPTag.style.display = `none`; 
    titleTag.style.display = `none`; 
    answerButtonLst.innerHTML = ''; 

    // Show score and form to enter name for highscore storage
    document.querySelector(`#scoreSpan`).textContent = score; 
    document.querySelector(`#submit-highscore-div`).style.display = `block`; 

    return;
}


// Event triggers
// Triggered when a <li> tag inside answerButtonLst <ul> is clicked
function checkAnswer(event) {
    if (event.target != answerButtonLst){ 

        if (!(event.target.id.includes('correct'))){ 
            timeLeft -= 10; 
        }

        nextQuestion(); // Go to next question 
    }

    return;
}

// Highscore button clicked trigger
function storeScoreAndName() {
    var highscoreTextbox = document.querySelector(`input`); 
    var tempArrayOfObjects = []; 

    if (highscoreTextbox.value != `` || highscoreTextbox.value != null) { 
        var tempObject = { // Initializes a object to put in the storage array
            names: highscoreTextbox.value, 
            scores: score, // Fill with users final score
        }

        if(window.localStorage.getItem(`highscores`) == null) { 
            tempArrayOfObjects.push(tempObject); 
            window.localStorage.setItem(`highscores`, JSON.stringify(tempArrayOfObjects));

        } else { 
            tempArrayOfObjects = JSON.parse(window.localStorage.getItem(`highscores`)); 

            for (let index = 0; index <= tempArrayOfObjects.length; index++) { 
                if (index == tempArrayOfObjects.length) { 
                    tempArrayOfObjects.push(tempObject) 
                    break; 
                } else if (tempArrayOfObjects[index].scores < score) { 
                    tempArrayOfObjects.splice(index, 0, tempObject); 
                    break; 
                }
            }
            window.localStorage.setItem(`highscores`, JSON.stringify(tempArrayOfObjects)) 
        }
        document.querySelector(`input`).value = ``; 
        score = 0; 

        showHighscores(); 
    }

    return;
}

// Triggered when viewHighscoresBtn is clicked, hides all elements and displays the highscore board 
function showHighscores() {
    // Elements needed to hide
    titleTag.style.display = `none`; 
    startBtn.style.display = `none`; 
    document.querySelector(`header`).children[0].style.display = `none`; 
    document.querySelector(`#instructions`).style.display = `none`;
    document.querySelector(`#submit-highscore-div`).style.display = `none`; 

    // Show highscore 
    document.querySelector(`#display-highscore-div`).style.display = `block`; 

    tempOrderedList = document.querySelector(`ol`); 
    tempOrderedList.innerHTML = `` 

    tempArrayOfObjects = JSON.parse(window.localStorage.getItem(`highscores`)); 
    if (tempArrayOfObjects != null) { 
        for (let index = 0; index < tempArrayOfObjects.length; index++) { 
            var newLi = document.createElement(`li`) 
            newLi.textContent = tempArrayOfObjects[index].names + ` - ` + tempArrayOfObjects[index].scores; 
            tempOrderedList.appendChild(newLi); 
        }

    } else { 
        var newLi = document.createElement(`p`) 
        newLi.textContent = `No Highscores` 
        tempOrderedList.appendChild(newLi); 
    }

    return;
}

// Triggered when clearHighscoreBtn is clicked 
function clearHighscores() {
    document.querySelector(`ol`).innerHTML = ``; 
    window.localStorage.clear(); 

    setUpGame(); 

    return;
}

// Event listeners
function init() {
    startBtn.addEventListener(`click`, startGame); 
    answerButtonLst.addEventListener(`click`, checkAnswer); 
    viewHighscoresBtn.addEventListener(`click`, showHighscores); 
    submitHighscoreBtn.addEventListener(`click`, storeScoreAndName); 
    clearHighscoreBtn.addEventListener(`click`, clearHighscores); 
    goBackHighscoreBtn.addEventListener(`click`, setUpGame); 

    setUpGame(); 

    return;
}

init(); 