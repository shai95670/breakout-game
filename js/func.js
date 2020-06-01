 // Assigining initial variables
 const canvas = document.querySelector('#ctx');
 const canvas2dObj = canvas.getContext('2d');
 const WIDTH = 500;
 const HEIGHT = 500;
 let direction;
 let life = 3;
 let fps;
 let bricks = [];
 
 //brick object
 function Brick (x, y, width, height, color, numberOfHits) {
     this.points = [
       {
         top_left: { x: x, y: y } 
       },
       {
         top_right: { x: x + width, y: y }
       },
       {
         bottom_left: { x: x, y: y + height }
       },
       {
         bottom_right: { x: x + width, y: y + height  }
       }
     ];
     this.width = width,
     this.height = height,
     this.color = color;
     this.numberOfHits = numberOfHits;
 }
 
 Brick.prototype.draw = function(x, y, width, height, color) {
   canvas2dObj.save();
   if (this.numberOfHits === 1) {
      this.color = 'black';
   }
   canvas2dObj.fillStyle = this.color;
   canvas2dObj.fillRect(this.points[0].top_left.x, this.points[0].top_left.y, this.width, this.height);
   canvas2dObj.restore();
 }
 
 
 Brick.prototype.getPoint = function(index) {
   return this.points[index];
 }
 
 Brick.prototype.addHitPoint = function() {
   this.numberOfHits += 1;
 }
 
 // base object
 const base =  {
    width: 80,
    height: 10,
    x: 260,
    y: 400,
    color: 'red'
 };
 
 // ball object
 const ball = {
     color: 'blue',
     radius: 2 * Math.PI,
     xPosition: canvas.width / 2,
     yPosition: canvas.height - 100,
     moveXSpeed: 4,
     moveYSpeed: -4
 };
 
 const generateBricks = () => {
   let posX = 150;
   let posY = 150;
   for (let index = 0; index < 20; index++) {
       if (index % 5 === 0) {
           posY += 20;
           posX = 150;
       }
       let brick = new Brick(posX, posY, 30, 15, 'purple', 0);
       posX += 50;
       bricks.push(brick);
   }
 };
 
 const checkIfBrickBroke = () => {
   for (let index = 0; index < bricks.length; index++) {
     if (bricks[index].numberOfHits >= 2) {
        bricks.splice(index, 1);
     }
   }
 };
 
 /* 1. ball collision between top left point of the brick and bottom left point of the brick
     check if balls y coordinate is between the top left points y coordinate and the bottom left
     y coordinate, (if it is it mean that the ball is with in the bounderies of those two points)
     and check if (the balls x coordinate - one of the two points x coordinate) is less then the balls
     radius, (ie, that means that not only is the ball between the point but there is actually a collision)
     and check if the balls x position is not bigger then one of the points x position
     (eliminates the possibility that the ball will pass through that side)
   2. or
   3. ball collision between top left point of the brick and top right point of the brick
     check if balls x coordinate is between the top left points x coordinate and the top right
     x coordinate, (if it is it mean that the ball is with in the bounderies of those two points)
     and check if (the balls y coordinate - one of the two points y coordinate) is less then the balls
     radius, (ie, that means that not only is the ball between the point but there is actually a collision)
     and check if the balls y position is not bigger then one of the points y position
     (eliminates the possibility that the ball will pass through that side)
   4. or 
   5. ball collision between top right point of the brick and bottom right point of the brick
     check if balls y coordinate is between the top right points y coordinate and the bottom right
     y coordinate, (if it is it mean that the ball is with in the bounderies of those two points)
     and check if (the balls x coordinate - one of the two points x coordinate) is less then the balls
     radius, (ie, that means that not only is the ball between the point but there is actually a collision)
     and check if the balls x position is not less then one of the points x position
     (eliminates the possibility that the ball will pass through that side)
   6. or
   7. ball collision between bottom left point of the brick and bottom right point of the brick
       check if balls x coordinate is between the bottom left points x coordinate and the bottom right
       x coordinate, (if it is it mean that the ball is with in the bounderies of those two points)
       and check if (the balls y coordinate - one of the two points y coordinate) is less then the balls
       radius, (ie, that means that not only is the ball between the point but there is actually a collision)
       and check if the balls y position is not less then one of the points y position
       (eliminates the possibility that the ball will pass through that side)      
 */
 const checkBallCollisionWithBricks = () => {
   for (let index = 0; index < bricks.length; index++) {
     if  ((ball.yPosition > bricks[index].getPoint(0).top_left.y && ball.yPosition < bricks[index].getPoint(2).bottom_left.y) &&
          (bricks[index].getPoint(0).top_left.x - ball.xPosition) < ball.radius &&
          (!(ball.xPosition > bricks[index].getPoint(0).top_left.x))) {
           console.log('brick left side collision');
           ball.moveXSpeed = -ball.moveXSpeed;
           bricks[index].numberOfHits += 1;            
         } else if ((ball.xPosition > bricks[index].getPoint(0).top_left.x && ball.xPosition < bricks[index].getPoint(1).top_right.x) &&
                   (bricks[index].getPoint(0).top_left.y - ball.yPosition) < ball.radius &&
                   (!(ball.yPosition > bricks[index].getPoint(0).top_left.y))) {
           console.log('brick top collision');
           ball.moveYSpeed = -ball.moveYSpeed;
           bricks[index].numberOfHits += 1;            
         } else if ((ball.yPosition > bricks[index].getPoint(1).top_right.y && ball.yPosition < bricks[index].getPoint(3).bottom_right.y) &&
                    (ball.xPosition - bricks[index].getPoint(3).bottom_right.x) < ball.radius &&
                    (!(ball.xPosition < bricks[index].getPoint(1).top_right.x))) {          
           console.log('brick right side collison');
           ball.moveXSpeed = +ball.moveXSpeed;
           bricks[index].numberOfHits += 1;             
         } else if ((ball.xPosition > bricks[index].getPoint(2).bottom_left.x && ball.xPosition < bricks[index].getPoint(3).bottom_right.x) &&
                   (bricks[index].getPoint(3).bottom_right.y - ball.yPosition) < ball.radius &&
                   (!(ball.yPosition < bricks[index].getPoint(2).bottom_left.y)) && (!(ball.yPosition > 185))) {
           console.log('brick bottom collision');
           ball.moveYSpeed = +ball.moveYSpeed; 
           bricks[index].numberOfHits += 1;   
     }
   }  
 };
 
 // Set up initial game title when called
 const setInitialPage = () => {
   canvas2dObj.font = 'italic small-caps bold 30px cursive';
   canvas2dObj.fillText('Breakout Game', 130, 150);
   canvas2dObj.textAlign = 'center';
 };
 
 // drawing methods
 // TODO: draw 6 rows of  11 bricks on to the screen
 const drawBricks = () => {
   for (let index = 0; index < bricks.length; index++) {
     bricks[index].draw();    
   }
 };
 
 const drawBase = () => {
   canvas2dObj.save();
   canvas2dObj.fillStyle = base.color;
   canvas2dObj.fillRect(base.x, base.y, base.width, base.height);
   canvas2dObj.restore();
 };
 
 const drawBall = () => {
   canvas2dObj.save();
   canvas2dObj.fillStyle = ball.color;
   canvas2dObj.beginPath();
   canvas2dObj.arc(ball.xPosition, ball.yPosition, 5, 0, ball.radius, false);
   canvas2dObj.fill();
   canvas2dObj.stroke();
   canvas2dObj.restore();
 };
 
 // null -> null
 // Makes the base move based on the direction variable,
 // which is set by the key pad controller
 // also checks for left and right bounderies so that the base,
 // wont fall from the screen
 const updateBasePosition = () => {
   // 0 - left
   if (direction === 0 && base.x != 0) {
     base.x -= 5;
   // 1 - right
   }else if (direction === 1 && base.x != 420) {
     base.x += 5;
   }
 };
 
 
 const ballPositionChecker = () => {
   if (ball.xPosition + ball.moveXSpeed > canvas.width - ball.radius) { // touch left wall or right wall  
       ball.moveXSpeed = -ball.moveXSpeed;
       console.log('right wall collision');   
   // touched up or down wall  
   } else if (ball.xPosition + ball.moveXSpeed < ball.radius){
     ball.moveXSpeed = -ball.moveXSpeed;
   } else if (ball.yPosition + ball.moveYSpeed < ball.radius) {
              ball.moveYSpeed = -ball.moveYSpeed;
   /*
     ball collision with base:
     if x coordinate of the ball is bigger then the x coordinate of the base
     and
     x coordinate of the ball is less then then x coordinate of the base + 
     base width
     (first two condition make sure that the ball is with in the range of the bases
     top left edge and top right edge)
     and the distance between the base y position and the balls y position are less then
     the balls radius 
     and
     the balls y position is not bigger the the bases y position 
   */  
   } else if ((ball.xPosition > base.x && ball.xPosition < base.x + base.width) &&
              (base.y - ball.yPosition) < ball.radius && (!(ball.yPosition > base.y))) {
     ball.moveYSpeed = -ball.moveYSpeed;
     console.log("base collision");  
   } else if (ball.yPosition + ball.moveYSpeed > canvas.height - ball.radius) {   // ball hits the floor  
     life -= 1;
     ball.moveYSpeed = -ball.moveYSpeed;
   }
 };
 
 const isGameOver = () => {
   if (life === 0) {
     clearInterval(fps);
     canvas2dObj.clearRect(0, 0, WIDTH, HEIGHT);
     canvas2dObj.font = 'italic small-caps bold 30px cursive';
     canvas2dObj.fillText('Game Over', 180, 180);
     canvas2dObj.textAlign = 'center';
   }
 };
 
 //Life updator
 const lifeUpdator = () => {
   canvas2dObj.font = 'italic small-caps bold 23px cursive';
   canvas2dObj.fillText('Life:' + life, 440, 480);
 };
 
 const moveBall = () => {
   ball.xPosition += ball.moveXSpeed;
   ball.yPosition += ball.moveYSpeed;
 };
 
 // all the stuff that needs updating on the screen goes here
 // and is executed each mili second
 const updateGameState = () => {
   canvas2dObj.clearRect(0, 0, WIDTH, HEIGHT);
 
   drawBall();
   drawBase();
   drawBricks();
 
   moveBall();
   
   ballPositionChecker();
   checkBallCollisionWithBricks();
   checkIfBrickBroke();
   lifeUpdator();
   isGameOver();
   updateBasePosition();
 };
 
 document.onkeydown = (event) => {
   if (event.keyCode === 37) {
     direction = 0;
   } else if (event.keyCode === 39) {
     direction = 1;
   } else if (event.keyCode === 80) {
     initializeGame();
   }
 };
 
 const initializeGame = () => {
   canvas2dObj.clearRect(0, 0, WIDTH, HEIGHT);
   fps = setInterval(updateGameState, 40);
 };
 
 generateBricks();
 setInitialPage();