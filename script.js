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
    var gameStarted = false; // Variable pour suivre si le jeu a commencé

    init();

    function init(){
        canvas = document.createElement("canvas");
        canvas.width = canvaswidth;
        canvas.height = canvasheight;
        canvas.style.border = "30px solid #000000";
        canvas.style.margin = "50px auto";
        canvas.style.display = "block";
        canvas.style.backgroundColor = "#2E8B57";
        document.body.appendChild(canvas);
        ctx = canvas.getContext("2d");
        Snakee = new Snake([[6,4], [5,4], [4,4], [3,4], [2,4]], "right");
        applee = new Apple([10,10]);
        score = 0;
        refreshCanvas();
    }

    function refreshCanvas(){
        if (gameStarted) {
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
                timeout = setTimeout(refreshCanvas, delay);
            }
        } else {
            drawStartMessage(); // Affiche le message de démarrage
        }
    }

    function gameOver(){
        ctx.save();
        ctx.font = "bold 70px sans-serif";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.strokeStyle = "white";
        ctx.lineWidth = 5;  
        var centerX = canvaswidth/2;
        var centerY = canvasheight/2;
        ctx.strokeText("Game Over", centerX, centerY - 180);
        ctx.fillText("Game Over", centerX, centerY - 180);
        ctx.font = "bold 30px sans-serif";
        ctx.strokeText("Appuyer sur la touche Espace pour Rejouer", centerX, centerY - 120);
        ctx.fillText("Appuyer sur la touche Espace pour Rejouer", centerX, centerY - 120);
        ctx.restore();
        gameStarted = false; // Met à jour l'état du jeu pour le mettre à l'arrêt
    }

    function restart(){
        gameStarted = true; // Met à jour l'état du jeu
        Snakee = new Snake([[6,4], [5,4], [4,4], [3,4], [2,4]], "right");
        applee = new Apple([10,10]);
        score = 0;
        clearTimeout(timeout); 
        refreshCanvas();
    }

    function drawScore(){
        ctx.save();
        ctx.font = "bold 30px sans-serif"; // Taille de la police diminuée
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";  
        var centerX = canvaswidth / 2;
        ctx.fillText("Score: " + score.toString(), centerX, 30); // Affichage du score au-dessus du canvas
        ctx.restore(); 
    }

    function drawStartMessage(){
        ctx.save();
        ctx.font = "bold 30px sans-serif";
        ctx.fillStyle = "#FFFFFF";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        var centerX = canvaswidth / 2;
        var centerY = canvasheight / 2;
        ctx.fillText("Appuyez sur la touche Espace pour commencer", centerX, centerY - 60);
        ctx.fillText("Utilisez les touches de direction pour diriger le serpent", centerX, centerY);
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
            ctx.fillStyle = "#FFD700"; 
            for(var i = 0; i < this.body.length; i++){
                drawBlock(ctx, this.body[i]);
            }
            ctx.restore();
        };

        this.advance = function(){
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
            var allowedDirections;
            switch(this.direction){
                case "left":
                case "right":
                    allowedDirections = ["up", "down"];
                    break;
                case "down":
                case "up":
                    allowedDirections = ["left", "right"];              
                    break;
                default:
                    throw("Invalid Direction");
            }
            if(allowedDirections.indexOf(newDirection) > -1){
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
            var maxX = widthInBlocks - 1;
            var maxY = heightInBlocks - 1;
            var isNotBetweenHorizontalWalls = SnakeX < minX || SnakeX > maxX;
            var isNotBetweenVerticalWalls = SnakeY < minY || SnakeY > maxY;
            
            if(isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls){
                wallCollision = true;
            }

            for(var i = 0; i < rest.length; i++){
                if (SnakeX === rest[i][0] && SnakeY === rest[i][1]){
                    snakeCollision = true;
                }
            }

            return wallCollision || snakeCollision;
        };

        this.isEatingApple = function(appleToEat){
            var head = this.body[0];
            return head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1];
        }
    }

    function Apple(position){
        this.position = position;
        this.draw = function(){
            ctx.save();
            ctx.fillStyle = "#800080";
            ctx.beginPath();
            var radius = blockSize / 2;
            var x = this.position[0] * blockSize + radius;
            var y = this.position[1] * blockSize + radius;
            ctx.arc(x, y, radius, 0, Math.PI * 2, true);
            ctx.fill(); 
            ctx.restore();
        }

        this.setNewposition = function(){
            var newX = Math.round(Math.random() * (widthInBlocks - 1));
            var newY = Math.round(Math.random() * (heightInBlocks - 1));
            this.position = [newX, newY];
        }

        this.isOnSnake = function(snakeToCheck){
            return snakeToCheck.body.some(bodyPart => this.position[0] === bodyPart[0] && this.position[1] === bodyPart[1]);
        }
    }

    document.onkeydown = function handleKeyDown(e){
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
                // Relancer le jeu en cas de Game Over
                if (!gameStarted) { 
                    restart();
                } else {
                    return;
                }
                return;
            default:
                return;
        }
        if (gameStarted) { // Changer la direction seulement si le jeu a commencé
            Snakee.setDirection(newDirection);
        }
    }
}
