window.onload = function(){
    var canvaswidth = 900;
    var canvasheight = 600;
    var blockSize = 30;
    var canvas;
    var ctx;
    var delay = 300;
    var Snakee;
    var applee;
    var widthInBlocks = canvaswidth/blockSize;
    var heightInBlocks = canvasheight/blockSize;
    var score;
    var timeout;

    init();

    function init(){
        canvas = document.createElement("canvas");
        canvas.width = canvaswidth;
        canvas.height = canvasheight;
        canvas.style.border = "30px solid gray" ;
        canvas.style.margin = "50px auto";
        canvas.style.display = "block";
        canvas.style.backgroundColor = "#ddd";
        document.body.appendChild(canvas);
        ctx = canvas.getContext("2d");
        Snakee = new Snake([[6,4], [5,4], [4,4], [3,4], [2,4]], "right");
        applee = new Apple([10,10]);
        score =  0;
        refreshCanvas();
    }
    function refreshCanvas(){
        Snakee.advance();
        if(Snakee.checkCollision()){
            gameOver();
        }else{
            if(Snakee.isEatingApple(applee)){
                score++;
                Snakee.ateApple = true;
                do{

                    applee.setNewposition();
                }
                while(applee.isOnSnake(Snakee))
            }
            ctx.clearRect(0, 0, canvaswidth, canvasheight);
            drawScore(); 
            Snakee.draw();
            applee.draw();
            timeout = setTimeout(refreshCanvas,delay);
        }
        
    }

    function gameOver(){
        ctx.save();
        ctx.font = "bold 70px sans-serif";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.strokeStyle = "white";
        ctx.linewidth = 5;  
        var centerX = canvaswidth/2;
        var centerY = canvasheight/2;
        ctx.strokeText("Game Over", centerX,centerY -180);
        ctx.fillText("Game Over", centerX, centerY -180);
        ctx.font = "bold 30px sans-serif";
        ctx.strokeText("Appuyer sur la touche Espace pour Rejouer", centerX,centerY -120);
        ctx.fillText("Appuyer sur la touche Espace pour Rejouer", centerX, centerY -120);

        ctx.restore();
        }
    function restart(){
        Snakee = new Snake([[6,4], [5,4], [4,4], [3,4], [2,4]], "right");
        applee = new Apple([10,10]);
        score =  0;
        clearTimeout(timeout); 
        refreshCanvas();
    }
    function drawScore(){
        ctx.save();
        ctx.font = "bold 200px sans-serif";
        ctx.fillStyle = "gray";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";  
        var centerX = canvaswidth/2;
        var centerY = canvasheight/2;
        ctx.fillText(score.toString(), centerX, centerY);
        ctx.restore(); 

    }
    
    function drawBlock(ctx, position){
        var x = position[0] * blockSize;
        var y = position[1] * blockSize;
        ctx.fillRect(x, y, blockSize, blockSize);
    }
    function Snake(body, direction){
        this.body = body;
        this.direction = direction;
        this.ateApple = false;
        this.draw = function(){
            ctx.save();
            ctx.fillStyle = "#ff0000"; 
            for( var i = 0; i < this.body.length; i++){
                drawBlock(ctx, this.body[i]);
            }
            ctx.restore();
        
        };
        this.advance= function(){
            var nextPosition = this.body[0].slice();
            switch(this.direction){
                case "left":
                nextPosition[0] -= 1;
                    break;
                case "right":
                nextPosition[0] += 1;
                    break;
                case "down":
                nextPosition[1] += 1;
                    break;
                case "up":
                nextPosition[1] -= 1;                
                    break;
                default:
                    throw("Invalid Direction");
            }
            this.body.unshift(nextPosition);
            if(!this.ateApple)
            this.body.pop();
            else
                this.ateApple = false;
        };
        this.setDirection = function(newDirection){
            var allowedDiretions;
            switch(this.direction){
                case "left":
                case "right":
                allowedDiretions = ["up", "down"];
                    break;
                case "down":
                case "up":
                allowedDiretions = ["left", "right"];              
                    break;
                default:
                    throw("Invalid Direction");
            }
            if(allowedDiretions.indexOf(newDirection) > -1){
                this.direction = newDirection;
            }
        };
        this.checkCollision = function(){
            var wallCollision = false;
            var snakeCollision = false;
            var head = this.body[0];
            var rest = this.body.slice(1);
            var SnakeX = head[0];
            var SnakeY = head[1];
            var minX = 0;
            var minY = 0;
            var maxX = widthInBlocks -1;
            var maxY = heightInBlocks -1;
            var isNotBetweenHorizotalwalls = SnakeX < minX || SnakeX > maxX;
            var isNotBetweenVerticalwalls = SnakeY < minY || SnakeY > maxY;
            
            if(isNotBetweenHorizotalwalls || isNotBetweenVerticalwalls){
                wallCollision = true;
            }

            for(var i = 0; i < rest.length; i++){
                if (SnakeX === rest[i][0] && SnakeY === rest[i][1] ){
                    snakeCollision = true;
                  }
                
            }

            return wallCollision || snakeCollision;
        };
        this.isEatingApple = function(appleToEat){
            var head = this.body[0];
            if(head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1]){
                return true;
            }
            else{
                return false;
            } 
        }
    }
    function Apple(position){
        this.position = position;
        this.draw = function(){
            ctx.save();
            ctx.fillStyle = "#33cc33";
            ctx.beginPath();
            var raduis = blockSize/2;
            var x = this.position[0]*blockSize + raduis;
            var y = this.position[1]*blockSize + raduis;
            ctx.arc(x,y, raduis, 0, Math.PI*2, true);
            ctx.fill(); 
            ctx.restore();
        }
        this.setNewposition = function(){
            var newX = Math.round(Math.random() * (widthInBlocks -1));
            var newY = Math.round(Math.random() * (heightInBlocks -1));
            this.position = [newX, newY];
        }
        this.isOnSnake = function(snakeTocheck){
            var isOnSnake = false;

            for(var i = 0; i < snakeTocheck.body.length; i++){
                if(this.position[0] === snakeTocheck.body[i][0] && this.position[1] === snakeTocheck.body[i][1]){
                    isOnSnake = true;
                }
            }
            return isOnSnake;
        }
    }

    document.onkeydown = function handlekeyDown(e){
        var key = e.keyCode;
        var newDirection;
        switch(key){
            case 37:
                newDirection = "left";
                break;
            case 38:
                newDirection = "up";
                break;
            case 39:
                newDirection = "right";
                break;
            case 40:
                newDirection = "down";
                break;
            case 32:
                restart();
                return;
            default:
                return;
        }
        Snakee.setDirection(newDirection);
    }
}