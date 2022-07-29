const grid = document.querySelector('.grid') //selecting the already made class of grid and storing it as a variable called grid
const scoreDisplay = document.querySelector('#score')
const restartButton = document.querySelector('#btn')
const blockWidth = 100
const blockHeight = 20
const boardWidth = 560
const boardHeight = 300
let ballDiameter = 20
const userStart = [230,10]
let userCurrentPosition = userStart
const ballStart = [270,40]
let ballCurrentPosition = ballStart
let timerId
let xDirection = -2
let yDirection = 2
score = 0

//create Block 
class Block {
    constructor(xAxis, yAxis) { //constructor is used to initialize objects, like temporary variables that can be accessed later when constructor said object
        this.bottomLeft = [xAxis,yAxis] //this takes the role of an object and allows you to implement the attributes
        this.bottomRight = [xAxis+blockWidth, yAxis]
        this.topLeft = [xAxis,yAxis+blockHeight]
        this.topRight = [xAxis+blockHeight,yAxis+blockHeight]
    }
}

//all my blocks
let blocks =[ 
    new Block(10,270),
    new Block(120,270),
    new Block(230,270),
    new Block(340,270),
    new Block(450,270),
    new Block(10,240),
    new Block(120,240),
    new Block(230,240),
    new Block(340,240),
    new Block(450,240),
    new Block(10,210),
    new Block(120,210),
    new Block(230,210),
    new Block(340,210),
    new Block(450,210)
]

//draw all my blocks
function addBlocks() {
    for(let i=0; i<blocks.length; i++){
    const block = document.createElement('div') //creating a div
    block.classList.add('block') //give div class of block
    block.style.left = blocks[i].bottomLeft[0] + 'px'
    block.style.bottom = blocks[i].bottomLeft[1] +'px'
    grid.appendChild(block)
    }
} 

addBlocks()

//add user
const user = document.createElement('div')
user.classList.add('user')
grid.appendChild(user)
drawUser()
grid.appendChild(user)

//draw user
function drawUser() {
    user.style.left = userCurrentPosition[0] +'px'
    user.style.bottom = userCurrentPosition[1] +'px'
}

//draw the ball
function drawBall() {
    ball.style.left = ballCurrentPosition[0] +'px'
    ball.style.bottom = ballCurrentPosition[1] +'px'
}


//move user
function moveUser(e) {
    switch(e.key) {
        case 'ArrowRight':
            if(userCurrentPosition[0] < boardWidth-blockWidth) 
                userCurrentPosition[0] += 10
                drawUser()
            break
        case 'ArrowLeft':
            if(userCurrentPosition[0]>0)
                userCurrentPosition[0] -= 10
                drawUser()
            break

    }
}

document.addEventListener('keydown', moveUser)

//add ball
const ball = document.createElement('div')
ball.classList.add('ball')
drawBall()
grid.appendChild(ball)

//move ball
function moveBall() {
    ballCurrentPosition[0] += xDirection
    ballCurrentPosition[1] += yDirection
    drawBall()
    checkForCollisions()
}
timerId = setInterval(moveBall,30)


//check for collisions
function checkForCollisions() {
    //check for block collisions
    for(let i=0; i<blocks.length; i++){
        if(ballCurrentPosition[0] > blocks[i].bottomLeft[0] &&
            ballCurrentPosition[0] < blocks[i].bottomRight[0] &&
            ballCurrentPosition[1] + ballDiameter > blocks[i].bottomLeft[1] &&
            ballCurrentPosition[1] < blocks[i].topLeft[1]) {
                const allBlocks = Array.from(document.querySelectorAll('.block'))
                allBlocks[i].classList.remove('block')
                blocks.splice(i, 1)
                changeDirection()
                score++
                scoreDisplay.innerHTML = score

                //check for win
                if(blocks.length ===0){
                    scoreDisplay.innerHTML = 'YOU WIN!! you are not a loser'
                    clearInterval(timerId)
                    document.removeEventListener('keydown', moveUser)
                    setTimeout(restart,3000)
                }
            }

    }
    

    //check for wall collisions
    if(ballCurrentPosition[0] >= boardWidth-ballDiameter || 
        ballCurrentPosition[1] >= boardHeight-ballDiameter ||
        ballCurrentPosition[0] <= 0){
        changeDirection()
    }

    //check for user collisions
    if(ballCurrentPosition[0] > userCurrentPosition[0] &&
        ballCurrentPosition[0] < userCurrentPosition[0] + blockWidth &&
        ballCurrentPosition[1] > userCurrentPosition[1] &&
        ballCurrentPosition[1] < userCurrentPosition[1] +blockHeight){
            changeDirection()
        }

    //check for game over
    if(ballCurrentPosition[1] <= 0) {
        clearInterval(timerId)
        scoreDisplay.innerHTML = 'You lose, you are a loser'
        document.removeEventListener('keydown', moveUser)
        setTimeout(restart, 3000)
    }
}

function changeDirection() {
    if (xDirection === 2 && yDirection === 2) {
        yDirection = -2
        return
    }
    if(xDirection == 2 && yDirection == -2){
        xDirection =-2
        return
    }
    if(xDirection == -2 && yDirection == -2){
        yDirection=2
        return
    }
    if(xDirection == -2 && yDirection ==2) {
        xDirection = 2
    }
}


//restart game
function restart(e) {
    scoreDisplay.innerHTML = 'Press the button to start over'
    if(e) {
        clearInterval(timerId)
        const allBlocks = Array.from(document.querySelectorAll('.block'))
        for(let i=0; i<blocks.length; i++){
            allBlocks[i].classList.remove('block')
        }
        blocks = [ 
            new Block(10,270),
            new Block(120,270),
            new Block(230,270),
            new Block(340,270),
            new Block(450,270),
            new Block(10,240),
            new Block(120,240),
            new Block(230,240),
            new Block(340,240),
            new Block(450,240),
            new Block(10,210),
            new Block(120,210),
            new Block(230,210),
            new Block(340,210),
            new Block(450,210)
        ]
        addBlocks()
        
        userCurrentPosition = [230,10]
        ballCurrentPosition = [270,40]
        drawUser()
        drawBall()
        timerId = setInterval(moveBall,30)
        document.addEventListener('keydown', moveUser)
        score = 0
        scoreDisplay.innerHTML = score
    }
}
restartButton.addEventListener('click', restart)