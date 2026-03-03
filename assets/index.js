// Timer state variables
let leftTimerActive = false;
let rightTimerActive = false;
let leftStartTime = 0;
let rightStartTime = 0;
let leftTime = 0;
let rightTime = 0;
let animationId = null;
const TIME_OFFSET = 100;

function formatTime(ms) {
    ms = Math.max(0, ms - TIME_OFFSET);
    const seconds = Math.floor(ms / 1000);
    const milliseconds = Math.floor(ms % 1000);
    return seconds + '.' + milliseconds.toString().padStart(3, '0');
}

function startTimers() {
    const leftSevenText = document.querySelectorAll('.lane-column')[0].querySelector('.seven-text');
    const rightSevenText = document.querySelectorAll('.lane-column')[1].querySelector('.seven-text');
    
    leftStartTime = performance.now();
    rightStartTime = performance.now();
    
    leftTimerActive = true;
    rightTimerActive = true;

    function update() {
        const now = performance.now();

        if (leftTimerActive) {
            leftTime = now - leftStartTime;
            leftSevenText.textContent = formatTime(leftTime);
        }
        
        if (rightTimerActive) {
            rightTime = now - rightStartTime;
            rightSevenText.textContent = formatTime(rightTime);
        }

        if (leftTimerActive || rightTimerActive) {
            animationId = requestAnimationFrame(update);
        }
    }

    animationId = requestAnimationFrame(update);
}

function stopLeftTimer() {
    if (leftTimerActive) {
        leftTime = Math.max(0, performance.now() - leftStartTime - TIME_OFFSET);
        leftTimerActive = false;
        checkWinner();
    }
}

function stopRightTimer() {
    if (rightTimerActive) {
        rightTime = Math.max(0, performance.now() - rightStartTime - TIME_OFFSET);
        rightTimerActive = false;
        checkWinner();
    }
}

function checkWinner() {
    if (!leftTimerActive && !rightTimerActive && (leftTime > 0 || rightTime > 0)) {
        const winnerDisplay = document.getElementById('winnerDisplay');
        
        if (leftTime > 0 && rightTime > 0) {
            if (leftTime < rightTime) {
                winnerDisplay.textContent = 'LANE 1 WINS!';
            } else if (rightTime < leftTime) {
                winnerDisplay.textContent = 'LANE 2 WINS!';
            } else {
                winnerDisplay.textContent = 'TIE!';
            }
        }
    }
}

function resetTimers() {
    cancelAnimationFrame(animationId);
    leftTimerActive = false;
    rightTimerActive = false;
    leftTime = 0;
    rightTime = 0;

    const winnerDisplay = document.getElementById('winnerDisplay');
    winnerDisplay.textContent = '';
}

function cycleLights() {
    const lights = document.querySelectorAll('.light');
    const sevenTexts = document.querySelectorAll('.seven-text');
    let index = 0;

    function activateNextLight() {
        if (index < lights.length) {
            lights[index].classList.add('on');
            index++;
            setTimeout(activateNextLight, 1000);
        } else {
            const randomDelay = Math.random() * (5000 - 2000) + 2000;
            setTimeout(() => {
                lights.forEach(light => light.classList.remove('on'));
                sevenTexts.forEach(text => text.classList.add('on'));
                startTimers();
            }, randomDelay);
        }
    }
    
    activateNextLight();
}

function resetLights() {
    const lights = document.querySelectorAll('.light');
    const sevenTexts = document.querySelectorAll('.seven-text');
    lights.forEach(light => light.classList.remove('on'));
    sevenTexts.forEach(text => text.classList.remove('on'));
    resetTimers();
}

// Detect left and right mouse clicks
document.addEventListener('mousedown', (event) => {
    if (event.button === 0) {
        stopLeftTimer();
    } else if (event.button === 2) {
        stopRightTimer();
    }
});

// Prevent context menu on right click
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// Green button
const greenButton = document.querySelector('.green-button');
if (greenButton) {
    greenButton.addEventListener('click', () => {
        resetLights();
        setTimeout(cycleLights, 100);
    });
}