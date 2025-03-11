const grid = document.querySelector('.grid');
const blockWidth = 100;
const blockHeight = 20;
const boardWidth = grid.clientWidth;
const boardHeight = grid.clientHeight;
const userMoveStep = 10;
const ballStartPosition = [270,30];
const scoreDisplay = document.querySelector("#score");
let ballCurrentPosition = [...ballStartPosition];
let ballDiameter = 20;
let score = 0;
const userStartPos = [230,10];
let userCurrentPos = [...userStartPos];
let xDirection = -2;
let yDirection = 2;
let ballTimer;
let blocks = [];
let user;
let ball;





class Block{

    constructor(xAxix, yAxis){
        this.bottomLeft = [xAxix, yAxis];
        this.bottomRight = [xAxix + blockWidth, yAxis];
        this.topLeft = [xAxix, yAxis + blockHeight];
        this.topRight = [xAxix + blockWidth, yAxis + blockHeight];
    }
}


function createBlockArray(){

    //Empty the block array
    blocks = [];

    blocks = [
        new Block(10,270),
        new Block(120, 270),
        new Block(230, 270),
        new Block(340, 270),
        new Block(450, 270),
        new Block(10,240),
        new Block(120, 240),
        new Block(230, 240),
        new Block(340, 240),
        new Block(450, 240),
        new Block(10,210),
        new Block(120, 210),
        new Block(230, 210),
        new Block(340, 210),
        new Block(450, 210)
    ]
}

createBlockArray();

function addBlocks() {

    grid.innerHTML = "";

    blocks.forEach((block =>{
        const blockElement = document.createElement('div');
        blockElement.classList.add('block');
        blockElement.style.left = block.bottomLeft[0] + 'px';
        blockElement.style.bottom = block.bottomLeft[1] + 'px';
        grid.appendChild(blockElement);
    }));
}

addBlocks();

function createUser(){

    user = document.createElement('div');
    user.classList.add('user');
    grid.appendChild(user);
}

createUser();

function drawUser() {
    user.style.left = userCurrentPos[0] + 'px';
    user.style.bottom = userCurrentPos[1] + 'px';
}

drawUser();

function createBall(){

    ball = document.createElement('div');
    ball.classList.add('ball');
    grid.appendChild(ball); 
}

createBall();

function drawBall(){
    
    ball.style.left = ballCurrentPosition[0] + 'px';
    ball.style.bottom = ballCurrentPosition[1] + 'px';
    }

document.addEventListener('keydown', moveUser);


function moveUser(e) {

    //console.log(e);
    switch(e.key) {

        case 'ArrowRight': 
            if(userCurrentPos[0] < (boardWidth - blockWidth))
            {
                userCurrentPos[0] += userMoveStep;
                drawUser();                
            }
            break;
        case 'ArrowLeft': 
            if(userCurrentPos[0] >= userMoveStep)
            {
                userCurrentPos[0] -= userMoveStep;
                drawUser();            
            }

            break;
    }

}


drawBall();


function moveBall(){

    ballCurrentPosition[0] += xDirection;
    ballCurrentPosition[1] += yDirection;
    drawBall();
    checkForCollision();
}


function checkForCollision(){


    //Check for wall collision
    if( (ballCurrentPosition[0] + ballDiameter)  >=  boardWidth || 
        ballCurrentPosition[0] <= 0 ||
        ballCurrentPosition[1] + ballDiameter > boardHeight
      )
      {
        changeDirection();
      }

      //Check for block collision
      for(let i = 0; i < blocks.length; i++) {

        let block = blocks[i];
        if((ballCurrentPosition[0] > block.bottomLeft[0] && ballCurrentPosition[0] < block.bottomRight[0]) && 
           (ballCurrentPosition[1] + ballDiameter > block.bottomLeft[1] && ballCurrentPosition[1] < block.topLeft[1]))
           {

                const allBlocks = Array.from(document.querySelectorAll('.block'));
                allBlocks[i].classList.remove('block'); 
                blocks.splice(i, 1);
                changeDirection();
                score++;
                updateScore();

                if(blocks.length === 0){
                    scoreDisplay.textContent = "You Win!!!";
                    stopGame();
                }
           }
        }



      //Check for user collision
      if( (ballCurrentPosition[0] > userCurrentPos[0] && ballCurrentPosition[0] < userCurrentPos[0] + blockWidth) &&
        (ballCurrentPosition[1] > userCurrentPos[1] && ballCurrentPosition[1] < userCurrentPos[1] + blockHeight) )
        {
            changeDirection();
        }


      //Game over
      if(ballCurrentPosition[1] <= 0)
      {
        score.textContent = "Game Over!!!";
        stopGame();
      }
}

function changeDirection(){

    if(xDirection === 2 && yDirection === 2)
    {
        yDirection = -2;
        return;
    }
    if(xDirection === 2 && yDirection === -2)
    {
        xDirection = -2;
        return;
    }
    if(xDirection === -2 && yDirection === -2)
    {
        yDirection = 2;
        return;
    }
    if(xDirection === -2 && yDirection === 2)
    {
        xDirection = 2;
        return;
    }
}

function updateScore(){

    scoreDisplay.textContent = `Score: ${score}`;

}

function startGame(){

    grid.innerHTML = "";
    userCurrentPos = [...userStartPos];
    ballCurrentPosition = [...ballStartPosition];
    createBlockArray();
    addBlocks();
    createUser();
    drawUser();
    createBall();
    drawBall();

    let difficulty =  document.querySelector('#difficulty').value; 
    let speed = 30/difficulty;
    ballTimer = setInterval(moveBall, speed);
    document.addEventListener('keydown', moveUser);
}

function stopGame(){

    clearInterval(ballTimer);
    document.removeEventListener('keydown', moveUser);
    score = 0;
    updateScore();
}