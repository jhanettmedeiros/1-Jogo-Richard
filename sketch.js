let ambientSound, gunshotSound, soundOfLosingLives;
let gameState = "start"; //estado de jogo inicial
let player, enemie, shot, homeScreenImage, imageOfThePlayingScreen, gameOverScreenImage, playerImage, enemieImage1, enemieImage2, enemieImage3;
let score = 3000;
let enemies=[];
let shots =[];
let lastShot = 0;
let delayShot = 30;

function preload() {
    ambientSound = loadSound("./assets/sounds/Stick The Landing - Everet Almond.mp3"); //som ambiente
    gunshotSound = loadSound("./assets/sounds/Magnum Shots.mp3");//som de tiro
    soundOfLosingLives = loadSound("./assets/sounds/Emergency Radio Alert.mp3"); // som de perdendo vidas
    homeScreenImage = loadImage("./assets/Start.png");
    imageOfThePlayingScreen = loadImage("./assets/Play.png");
    playerImage = loadImage("./assets/player.png");
}

function setup() {
    createCanvas(400,400);
    //ambientSound.play();

    //Criando o jogador
    player = createSprite(45,height/2,80, 80);
    player.addImage(playerImage);
    player.scale = 0.25;
}

function draw() {
    background(homeScreenImage);
    
    if (gameState == "start") {
        showStartScreen();
    } else if(gameState == "play") {
        playGame();
    }else {
        endGame();
    }
    drawSprites();
}

function showStartScreen() {
    background(homeScreenImage);
    textAlign(CENTER);
    fill(255);
    textSize(16);
    text("Pressione o ENTER para iniciar.", width/2, height/2+30);
}

function playGame() {
    background(imageOfThePlayingScreen);

    //Definindo o ambiente
    let bottomSprite = createSprite(width/2, height, width, 15);
    bottomSprite.visible = false;


    //Gravidade do jogador
    player.position.y +=10;
    player.collide(bottomSprite);
    if(player.position.y > height) {
        player.position.y = height - 15 - 100;
    }

    //Controle do Jogador
    if(keyDown("right") && player.position.x < width) {
        console.log("Indo para direita");
        player.position.x += 2;

    }
    if(keyDown("left") && player.position.x > 40) {
        player.position.x -= 2;

    }

    //Chamando os inimigos 
    creatingEnemies();

    //Disparos

    if(keyDown("space") && frameCount - lastShot > delayShot) {

        if (!gunshotSound.isPlaying()) { 
            gunshotSound.play();  // Som do tiro toca apenas uma vez por disparo
        }

        creatingShots();
        lastShot = frameCount;
    }

    //Vamos conferrir a quantidade de inimigos criados de forma decrescente
    for (let e = enemies.length - 1; e >= 0; e--) {
        
        //Vamos conferrir a quantidade de tiros criados de forma decrescente
        for(let s = shots.length -1; s >= 0; s--) {

            //Vamos verificar se o sprite shot sobrepos o sprite enemei
            if(shots[s].overlap(enemies[e])) {

                enemies[e].remove();
                enemies.splice(e, 1);

                shots[s].remove();
                shots.splice(s, 1);

                break;

            }

        }
        
    }

    //Colisão do jogador com os inimigos
    //Vamos conferrir a quantidade de inimigos criados de forma decrescente
    for(let j = enemies.length - 1; j >= 0; j--) {
        if(enemies[j].position.x < player.position.x) {
            if (!soundOfLosingLives.isPlaying()) { 
                soundOfLosingLives.play();  // Som do tiro toca apenas uma vez por disparo
            }
            enemies[j].remove();
            enemies.splice(j, 1);
            score -= 100;
        }
    }

    if(score <= 0) {
        endGame();
    }

    //Exibindo o placar
    fill("white");
    stroke("white");
    textSize(16);
    text("Placar: " + score, 15, 30);

}

function endGame() {
    background(homeScreenImage);
    textAlign(CENTER);
    fill(255);
    textSize(16);
    text("Pressione o ENTER para reiniciar.", width/2, height/2+30);
}

function keyPressed() {
    if(keyCode === ENTER) {
        if(gameState === "start") {
            gameState = "play";
            score = 3000;
            enemies=[];
            
            // Toca a música ambiente apenas quando o jogo começa
            if (!ambientSound.isPlaying()) {
                ambientSound.loop();
            }

        } else if(gameState === "end") {
            gameState = "play";
            score = 3000;
            enemies=[];
        }
    }
}

function creatingEnemies() {
    if(frameCount % 120 === 0) {
        enemie = createSprite(width + 100, height - 40, 25, 80);
        enemie.velocity.x = -2;
        enemie.lifetime =150;
        enemies.push(enemie);
    }
}

function creatingShots() {
    shot = createSprite(player.position.x, player.position.y, 5, 5);
    shot.velocity.x = 5;
    shot.lifetime = 150;
    shots.push(shot);
}

