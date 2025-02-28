const grid = document.querySelector('#grid');
const defaultMolePosition = 6;
const result = document.querySelector('#result');
const level = document.querySelector('#level');
let blockArray = [];
let randPos = () => Math.floor(Math.random() * 3);
let currentMolePosition = defaultMolePosition;
let blockMoveDelay = 50;
let finalPosDisplayTime = 0;

const gameLevel = document.querySelector('#game-level');
const levelScore = document.querySelector('#level-score');
let score = 0;

document.querySelector('#start').addEventListener('click', startGame);

function createGrid(){

    for(let i=0; i < 9; i++){

        const block = document.createElement('div');
        block.classList.add('block');
        if(i >= 6){
            block.classList.add('sink');
            block.setAttribute('pos', i);
            block.addEventListener('click', reveal);
        }
        grid.appendChild(block);
    }
}

createGrid();

blockArray = document.querySelectorAll('#grid .block');

function initializaMole(){
    blockArray[defaultMolePosition].classList.add('mole');
}
 
initializaMole();


function moveMoleStep(from, to){

    blockArray[from].classList.remove('mole');
    blockArray[to].classList.add('mole');
}

function moveMolePath(positions){

    let timerId;
    let step = 0;
    let pathLength = positions.length
    if(pathLength == 0) return;

    timerId = setInterval(() =>  {
                moveMoleStep(currentMolePosition, positions[step]);
                currentMolePosition = positions[step];
                step++
                if(step == positions.length){
                    clearInterval(timerId);

                    //Final position
                    setTimeout(() => {
                        blockArray[positions[step - 1]].classList.remove('mole');
                    },finalPosDisplayTime);
                }

            }, blockMoveDelay);

}

//moveMolePath([1,0,2,3,6,5,7]);


function reveal(e){
    let clickPos = e.target.getAttribute('pos');
    flashMole('mole');

    if(clickPos == currentMolePosition){
        score++;
        result.textContent = "Right Pick!!!";
        if(score == 5) {

            result.textContent += `, ${level.options[level.selectedIndex].text} Completed, You have scored ${score}/5`;
            if(level.selectedIndex < 5) level.selectedIndex = level.selectedIndex + 1;
            level.dispatchEvent(new Event('change', {bubbles: true}));
        }
        levelScore.textContent = score;
    }
    else {
        flashMole('missed', e.target);
        result.textContent = "OOPS, did not catch that"
    }
    
    allowReesponse(false);
}

function generateRandomPath() {

    let finalPos = 6 + randPos();
    let path = [];

    switch(currentMolePosition)
    {
        case 6:
            if(finalPos == 6)
            {
                path = [6,3,1,4,7,2,5,8,5,1,3,6];
            }
            else if (finalPos == 7)
            {
                path = [6,3,1,5,8,5,1,3,6,3,1,4,7];
            }
            else
            {
                path = [6,3,1,5,8,5,4,7,4,2,5,8];
            }

            break;
        case 7:
            if(finalPos == 6)
            {
                path = [7,3,1,4,7,4,1,2,5,8,4,0,3,6];
            }
            else if (finalPos == 7)
            {
                path = [7,4,0,3,6,3,1,5,8,5,1,4,7];
            }
            else
            {
                path = [7,4,1,0,3,6,4,2,5,8,5,1,4,7,3,1,5,8];
            }
            break;
        case 8:
            if(finalPos == 6)
            {
                path = [8,5,1,4,7,4,1,0,3,6,4,8,4,7,4,0,3,6,4,8,4,6];
            }
            else if (finalPos == 7)
            {
                path = [8,4,6,3,2,5,7,5,1,3,6,4,7];
            }
            else
            {
                path = [8,4,0,3,6,4,2,5,8,5,4,7,4,3,6,4,7,4,1,2,4,8];
            }
            break;
    }

    return path;
};

level.addEventListener('change', () => {
    score = 0;
    gameLevel.innerHTML = level.options[level.selectedIndex].text;
    levelScore.textContent = score;
});

function allowReesponse(allow) {

    let sinkBlocks = document.querySelectorAll('.sink');

    sinkBlocks.forEach((each) => {
        if(allow) { 
            each.addEventListener('click', reveal); 
        }
        else {
            each.removeEventListener('click', reveal);
        }
    });
}

function flashMole(classNAme, element = undefined) {
    let elem = document.querySelector(`div[pos="${currentMolePosition}"]`);
    if(element != undefined){
        elem = element;
    }

    elem.classList.toggle(classNAme);
    setTimeout(() => {
        elem.classList.toggle(classNAme);
    },100);
}

function startGame() {

    result.innerHTML = "";
    gameLevel.innerHTML = level.options[level.selectedIndex].text;
    blockMoveDelay = level.value;
    allowReesponse(true);
    let path = generateRandomPath();
    let revPath = path.slice().reverse();
    
    let traversePath = [... path, ... revPath, ... path];

    moveMolePath(traversePath);
}