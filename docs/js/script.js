const canvas = document.querySelector("canvas");//Pega o elemento canvas do html 
const ctx = canvas.getContext("2d");//Mostra em plano está sendo executado

const score = document.querySelector(".score-value");
const finalScore = document.querySelector(".final-score > span");
const menu = document.querySelector(".menu-screen");
const buttonPlay = document.querySelector(".btn-play");

const audio = new Audio("./assets/audio.mp3");//Pega o som do audio

const size = 20; //Tamanho padrão de cada desenho

const inicialPosition = {x: 180, y: 180}; //Posição inicial da cobra

let snake = [ inicialPosition ];

const incrementScore = () => {
//  score.innerText = +score.innerText + 10 - Outra forma de fazer
    score.innerText = parseInt(score.innerText) + 10;
}

const randomNumber = (min, max) => { //Cria um número aleatório
    return Math.round(Math.random() * (max - min) + min)
}

const randomPosition = () => {//Cria uma posição aleatória
    const number = randomNumber(0, canvas.width - size);
    return Math.round(number / 20) * 20;
}

const ramdomColor = () => {//Cria um a cor aleatória
    const red = randomNumber(0, 255);
    const green = randomNumber(0, 255);
    const blue = randomNumber(0, 255);

    return `rgb(${red}, ${green}, ${blue})`;
}

const food = { //Comida da cobrinha
    x: randomPosition(),
    y: randomPosition(),
    color: ramdomColor()
}

let direction, loopId;

const drawFood = () => { 

    const {x, y, color} = food;

    ctx.shadowColor = color;
    ctx.shadowBlur = 6;
    ctx.fillStyle = color
    ctx.fillRect(x, y, size, size)
    ctx.shadowBlur = 0; //Criado para evitar o bug de ficar todos os blocos com blur
}

const drawSnake = () => { //Maneira de desenhar a cobra 
    ctx.fillStyle = "#ddd";//Define a cor do elemento
    
    snake.forEach((position, index) => { //Usa esse array para percorrer todas as posições e aumentar o corpo da cobra
        if(index == snake.length - 1){ //Muda a cor da cabeça da cobrinha
            ctx.fillStyle = "white";
        };

        ctx.fillRect(position.x, position.y, size, size);//Insere o desenho dentro do campo
    });
}

const moveSnake = () => { //Maneira de mover a cobrinha 

    if(!direction) return; /*Corrigir o bug de apagar a cobrinha quando não tiver nem uma direção selecionada 
                            e pula para o final da função*/

    const head = snake[snake.length - 1];// Maneira mais antiga
    //const head = snake.at(-1); //Seleciona a posição 0 do array - Maneira mais nova

    if(direction == "right"){
        snake.push({ x: head.x + size, y: head.y});//Usado par mover a cobrinha
    }

    if(direction == "left"){
        snake.push({ x: head.x - size, y: head.y});
    }

    if(direction == "down"){
        snake.push({ x: head.x, y: head.y + size});
    }

    if(direction == "up"){
        snake.push({ x: head.x, y: head.y - size});
    }

    snake.shift(); //Remove o primeiro elemento do array
}

const drawGrid = () => { //Desenha o grid 
    ctx.lineWidth = 1
    ctx.strokeStyle = "#191919"

    for (let i = 20; i < canvas.width; i += 20) {
        ctx.beginPath()//Faz com que sempre comece do 0 e acabe no 400, sem "costurar" as linhas
        ctx.lineTo(i, 0)
        ctx.lineTo(i, 400)
        ctx.stroke();

        ctx.beginPath()
        ctx.lineTo(0, i)
        ctx.lineTo(400, i)
        ctx.stroke();
    }
}

const checkEat = () => {
    const head = snake[snake.length - 1];

    if(head.x == food.x && head.y == food.y){
        incrementScore(); //Aumenta o contador todo vez que a cobrinha come
        snake.push(head); //Adiciona o mais uma posição ao array
        audio.play(); //Adiciona um som

        let x = randomPosition();
        let y = randomPosition();

        //Função que não deixa a comida nascer no mesmo lugar que a cobra
        while(snake.find((position) => position.x == x && position.y == y)){ 
            x = randomPosition();
            y = randomPosition();
        }

        food.x = x
        food.y = y
        food.color =  ramdomColor()
    }
}

const checkCollision = () => {
    const head = snake[snake.length - 1];
    const canvasLimit = canvas.width - size;
    const neckIndex = snake.length - 2;
    const wallCollision = head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit;

    const selfCollision = snake.find((position, index) => {
        return index < neckIndex && position.x == head.x && position.y == head.y
    })

    if(wallCollision || selfCollision){
        gameOver();
    }
}

const gameOver = () => {
    direction = undefined;

    menu.style.display = "flex"
    finalScore.innerText = score.innerText;
    canvas.style.filter = "blur(10px)"

}

const gameLoop = () => { //Loop para o jogo 
    clearInterval(loopId);//Evita criar dois loops ao mesmo tempo e criar um bug
    ctx.clearRect(0, 0, 400, 400);

    drawGrid();
    drawFood();
    drawSnake();//Desenha os elementos
    moveSnake();//Move os elementos
    checkEat();
    checkCollision();

    loopId = setTimeout(() => {
        gameLoop();
    }, 300)
}

gameLoop();

document.addEventListener("keydown", ({ key }) => { //Estabelece contato com o teclado 
    
    do{
        if(key == "ArrowRight" && direction != "left"){
            direction = "right";
        }
        if(key == "ArrowLeft" && direction != "right"){
            direction = "left";
        }
        if(key == "ArrowDown" && direction != "up"){
            direction = "down";
        }
        if(key == "ArrowUp" && direction != "down"){
            direction = "up";
        }
    }while(checkCollision() = false)

    

});

buttonPlay.addEventListener("click", () => {
    score.innerText = "00"
    menu.style.display = "none"
    canvas.style.filter = "none"

    direction = undefined;
    snake = [inicialPosition];
})
