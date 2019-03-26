var canvas = document.getElementById('gameCanvas');
var ctx = canvas.getContext('2d');

document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);
document.addEventListener('mousemove',mouseMoveHandler);
document.addEventListener("click",onClickHandler);

setInterval(draw,10);

//start button
var startBtn = false;
var startBtnX = canvas.width/2-40;
var startBtnY = canvas.height/2-15;
var startBtnW = 80;
var startBtnH = 30;

//make a ball
var x = canvas.width/2;
var y = canvas.height-30;
var dx = 2;
var dy = -2;
var ballRadius = 10;

//make a paddle
var paddleWidth = 70;
var paddleHeight = 15;
var paddleX = (canvas.width-paddleWidth)/2;
var leftPressed  = false;
var rightPressed = false;

//make a brick, 먼저 벽돌을 만들 때 어떤 속성이 필요한지를 생각한다.
var brickColumnCount = 9;
var brickRowCount = 4;
var brickWidth = 72;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 36;
var fps = 54;

var bricks = [];
var score = 0;
var lives = 3;

for(var c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    // console.log('bricks 1',bricks[c]);
    for(var r=0; r<brickRowCount; r++) {
        // bricks[c][r] = [];
        bricks[c][r] = { a:0 , b:0, status:1 }; //a(행), b(열)값을 객체값으로 지정
    // console.log('bricks 2',bricks[c][r]);
    }
}

// function drawStartBtn(){
//     ctx.font = '30px Arial';
//     ctx.fillText('게임시작', startBtnX, startBtnY+startBtnH);
//     // ctx.fillStyle = '#DC2248';
// }

function drawBall(){
    ctx.beginPath();
    ctx.arc(x,y,ballRadius,0,Math.PI*2);
    ctx.fillStyle = '#8A0D60';
    ctx.fill();
    ctx.closePath();
}

function drawPaddle(){
    ctx.beginPath()
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight)
    ctx.fillStyle = '#DF3742';
    ctx.fill();
    ctx.closePath();
}

function keyDownHandler(e){
    if(e.keyCode == 39){
        rightPressed = true;
    }else if(e.keyCode ==37){
        leftPressed = true;
    }
}

function keyUpHandler(e){
    if(e.keyCode == 39){
        rightPressed = false;
    }else if(e.keyCode ==37){
        leftPressed = false;
    }
}

function mouseMoveHandler(e){
    var relativeX = e.clientX - canvas.offsetLeft; //e.clientX : 현재 마우스의 X값, offsetLeft 그림은 https://webdoli.tistory.com/19?category=750028
    //relativeX는 캔버스 내의 마우스 위치
    if(relativeX > 0 && relativeX < canvas.width){
        paddleX = relativeX - paddleWidth/2;
    }
}

function onClickHandler(e){
    var clientX = e.clientX - canvas.offsetLeft;
    var clientY = e.clientY - canvas.offsetTop;
    if((clientX>startBtnX && clientX<startBtnX+startBtnW) &&
        (clientY>startBtnY && clientY<startBtnY+startBtnH)){
        startBtn = true;
    }
}

function drawBricks(){
    for(var c=0; c<brickColumnCount; c++){
        // bricks[c] = [];
        for(var r=0; r<brickRowCount; r++){
            // bricks[c][r]=[];
            // bricks[c][r] = {a:0, b:0, status:1};
            if(bricks[c][r].status == 1){
                var brickX = (c*(brickWidth + brickPadding))+ brickOffsetLeft;
                var brickY = (r*(brickHeight + brickPadding))+ brickOffsetTop;
                bricks[c][r].a = brickX;
                bricks[c][r].b = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = '#DA3A3A';
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function collideBrick(){
    for(var c = 0; c < brickColumnCount; c++){
        for(var r = 0; r<brickRowCount; r++){
            var currentBrick = bricks[c][r];
            // console.log('currentBrick',currentBrick);
            // console.log('currentBrick a',currentBrick.a);
            if(currentBrick.status == 1){
                if(x+ballRadius>currentBrick.a && x-ballRadius<currentBrick.a+brickWidth &&
                    y+ballRadius>currentBrick.b && y-ballRadius<currentBrick.b+brickHeight){
                    dy = -dy;
                    currentBrick.status = 0;
                    score++;
                    if(score == brickColumnCount*brickRowCount){
                        alert('쨕쨕쨕 다 깨셨군요! 선물을 드릴게요');
                        document.location.reload();
                    }
                }
            }
        }
    }
}

function drawScore(){
    ctx.font = '16px Arial';
    ctx.fillStyle = '#000000';
    ctx.fillText('현재 점수: '+score, 8, 20);
}

function drawLives(){
    ctx.font = '16px Arial';
    ctx.fillStyle = '#DC8C22';
    ctx.fillText('남은 횟수: '+lives, canvas.width-100, 20);
}

function draw(){
    if(startBtn){
        ctx.clearRect(0,0,canvas.width, canvas.height);
        // drawStartBtn();
        drawBricks();
        drawBall();
        drawPaddle();
        collideBrick();
        drawScore();
        drawLives();

        if(y<ballRadius){
            dy = -dy;
        }else if(x<ballRadius || x>canvas.width-ballRadius){
            dx=-dx;
        }else if(y>canvas.height-ballRadius-paddleHeight){
            if(x>paddleX && x<paddleX+paddleWidth){
                dy=-dy
            }else if(y>canvas.height-ballRadius){
                lives --;
                if(!lives){
                    alert('Game over');
                    document.location.reload();
                    clearInterval(interval);
                }else{
                    x = canvas.width/2;
                    y = canvas.height - 30;
                    dx = 2;
                    dy = -2;
                    paddleX = (canvas.width-paddleWidth)/2;
                }
            }
        }

        if(leftPressed && paddleX>0){
            paddleX -= 6;
        }else if(rightPressed && paddleX+paddleWidth<canvas.width){
            paddleX += 6;
        }
        // if(paddleX<0){
        //     paddleX += 6;
        // } else if (paddleX+paddleWidth>canvas.width){
        //     paddleX -= 6;
        // }
        x += dx;
        y += dy;
        // requestAnimationFrame(draw);
    }
}
ctx.font = '30px Calibri';
ctx.fillText('START', startBtnX, startBtnY+startBtnH);
// var interval = setInterval(draw, 10);
draw();