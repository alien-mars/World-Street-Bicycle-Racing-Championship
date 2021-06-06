//declare variables
var bg, bgImg;
var road, roadImg;
var invisible_ground;
var cyclist, cyclistImg, cyclistImg2;
var edges;
var coin, coinImg, coinScore, coinGrp;
var lifeImg, life, lifeScore, lifeGrp;
var energy_boosterImg, energy_booster, energy_boosterGrp;
var obstacle1, obstacle1Grp, obstacle1Img, obstacle2Img, obstacle3Img, obstacle4Img;
var restart, restartImg, gameOver, gameOverImg;
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var score;
var checkpoint_sound, lose_sound, cycling_sound, coin_sound, energy_sound, life_sound, hit_sound, jump_sound;

function preload(){
 
  //load images, sounds and animations
  bgImg = loadImage("bg.jpg");
  roadImg = loadImage("road.jpg");
  
  cyclistImg = loadAnimation("girl1.png","girl2.png","girl3.png","girl4.png","girl5.png","girl6.png");
  cyclistImg2 = loadAnimation("girl1.png");

  jumpImg = loadAnimation("flip1.png","flip2.png","flip3.png","flip4.png","flip5.png","flip6.png","flip7.png","flip8.png");
  
  coinImg = loadImage("coin.png");
  lifeImg = loadImage("life.png");
  energy_boosterImg = loadImage("energy_booster.png");
  
  obstacle1Img = loadImage("traffic_cone.png");
  obstacle2Img = loadImage("box.png");

  obstacle3Img = loadImage("barrier.png");
  obstacle4Img = loadImage("spikes_1.png");
  
  restartImg = loadImage("restart.png");
  gameOverImg = loadImage("gameover.png");
  
}

function setup() {
 
  createCanvas(windowWidth,windowHeight);
  
  bg = createSprite(windowWidth/2,(windowHeight/2)-200,windowWidth,windowHeight-400);
  bg.addImage(bgImg);
  bg.scale = 5.45;
  bg.velocityX = -5;
  
  road = createSprite(windowWidth/2,windowHeight-20,windowWidth,40);
  road.addImage(roadImg);
  road.scale = 1.4
  
  invisible_ground = createSprite(windowWidth/2,windowHeight-50,windowWidth,10);
  invisible_ground.visible = false;
  
  cyclist = createSprite(150,invisible_ground.y-25,50,50);
  cyclist.addAnimation("riding",cyclistImg);
  cyclist.scale = 1.3;
  //cyclist.debug = true;
  cyclist.setCollider("rectangle",0,0,80,100);
  
  gameOver = createSprite(windowWidth/2,windowHeight/2,50,50);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 1.3
  gameOver.visible = false;

  restart = createSprite(windowWidth/2,(windowHeight/2)+60,50,50);
  restart.addImage(restartImg);
  restart.scale = 0.1;
  restart.visible = false;
 
  coinGrp = new Group();
  lifeGrp = new Group();
  energy_boosterGrp = new Group();
  obstacle1Grp = new Group();
  
  coinScore = 0;
  lifeScore = 3;
  score = 0;

  checkpoint_sound = new Audio("checkpoint.wav");
  lose_sound = new Audio("lose.mp3");
  cycling_sound = new Audio("cycling.mp3");
  coin_sound = new Audio("coin.mp3");
  energy_sound = new Audio("energy.mp3");
  life_sound = new Audio("life.mp3");
  hit_sound = new Audio("hit.mp3");
  jump_sound = new Audio("jump.mp3");

}

function draw() {
  background("lightblue");

  if(gameState === PLAY){
    
    cycling_sound.play();

    score = score + Math.round(getFrameRate()/60);
    if(score % 100 === 0 && score !== 0){
      if(!(checkpoint_sound.play())){
        checkpoint_sound.play();
      }
    }
     
    //infinitely scrolling background
    if(bg.x<0){
      bg.x = bg.width/2
    }
  
    if(keyDown(UP_ARROW)&& cyclist.y>440){
      cyclist.velocityY = -13;
      cyclist.addAnimation("jumping",jumpImg);
      cyclist.changeAnimation("jumping");
      jump_sound.play();
    }
    else{
        cyclist.changeAnimation("riding");
    }

    //console.log(cyclist.y);
    //add gravity
    cyclist.velocityY += 0.55;
  
    if(cyclist.isTouching(coinGrp)){
      coinScore  += 1;
      coinGrp.destroyEach();
      coin_sound.play();
    }
  
    if(cyclist.isTouching(lifeGrp)){
      lifeGrp.destroyEach();
      lifeScore  += 1;
      life_sound.play();
    }
  
    if(cyclist.isTouching(energy_boosterGrp)){
      energy_boosterGrp.destroyEach();
      energy_sound.play();
      bg.velocityX -= 1;
    }
  
    if(obstacle1Grp.isTouching(cyclist)){
      obstacle1Grp.destroyEach();
      lifeScore -= 1;
      bg.velocityX += 1;
      if(lifeScore !== 0){
        hit_sound.play();
      }
    }
  
    spawnCoins();
    spawnLife();
    spawnEnergy_booster();
    spawnObstacles1();
    
    if(lifeScore === 0){
      gameState = END;
      lose_sound.play();
      cycling_sound.pause();
    }
    
  }
  else if(gameState === END){
    bg.velocityX = 0;
    
    coinGrp.setVelocityXEach(0);
    lifeGrp.setVelocityXEach(0);
    energy_boosterGrp.setVelocityXEach(0);
    obstacle1Grp.setVelocityXEach(0);
    
    coinGrp.setLifetimeEach(0);
    lifeGrp.setLifetimeEach(0);
    energy_boosterGrp.setLifetimeEach(0);
    obstacle1Grp.setLifetimeEach(0);
    
    restart.visible = true;
    gameOver.visible = true;

    cyclist.x = 150;
    cyclist.y = invisible_ground.y-25;
    cyclist.addAnimation("lastImage",cyclistImg2);
    cyclist.changeAnimation("lastImage");
    
    if(mousePressedOver(restart)){
      reset();
    }
  }
  
  edges = createEdgeSprites();
  
  cyclist.collide(edges);
  cyclist.collide(invisible_ground);
  
  //console.log(bg.velocityX);
  //console.log(gameState);
  
  drawSprites();
  
  fill(0);
  textSize(25);
  text("Score : " + score, 10,40);

  image(coinImg,15,45);
  text(" : " + coinScore,50,75);
  
  image(lifeImg,15,85);
  text(" : " + lifeScore,50,110);
  
  //remarks on the basis of score
  if(gameState === END){
    if(score<500){
      text("Bad luck!",windowWidth/2-50,windowHeight/2 - 50);
    }
    else if(score>500 && score<1500){
      text("Well tried!",windowWidth/2-60,windowHeight/2 - 50);
    }
    else if(score>1500 && score<3000){
      text("Amazingly played!!",windowWidth/2-70,windowHeight/2 - 50);
    }
    else if(score>3000 && score<4500){
      text("Hatsoff Buddy!!",windowWidth/2-60,windowHeight/2 - 50);
    }
    else{
      text("Awesome champ!!",windowWidth/2-60,windowHeight/2 - 50);
    }
  }
}

function spawnCoins(){
  if(frameCount%400===0){
    coin = createSprite(windowWidth-10,(windowHeight/2)+50,50,50);
    //coin.velocityX = -2;
    coin.velocityX = bg.velocityX;
    coin.lifetime = 500;
    coin.addImage(coinImg);
    coin.scale = 1.2;
    //coin.debug = true;
    coinGrp.add(coin);
  }
}

function spawnLife(){
  if(frameCount%1000===0){
    life = createSprite(windowWidth-10,(windowHeight/2)+50,50,50);
    //life.velocityX = -2;
    life.velocityX = bg.velocityX;
    life.lifetime = 500;
    life.addImage(lifeImg);
    life.scale = 1.2;
    //life.debug = true;
    lifeGrp.add(life);
  }
}

function spawnEnergy_booster(){
  if(frameCount%700===0){
    energy_booster = createSprite(windowWidth-10,(windowHeight/2)+50,50,50);
    //energy_booster.velocityX = -2;
    energy_booster.velocityX = bg.velocityX;
    energy_booster.lifetime = 500;
    energy_booster.addImage(energy_boosterImg);
    //energy_booster.debug = true;
    energy_booster.setCollider("rectangle",0,0,270,300);
    energy_booster.scale = 0.25;
    energy_boosterGrp.add(energy_booster);
  }
}

function spawnObstacles1(){
  if(frameCount%350===0){
    obstacle1 = createSprite(windowWidth-10,invisible_ground.y-25,50,50);
    //obstacle1.velocityX = -2;
    obstacle1.velocityX = bg.velocityX;
    obstacle1.scale = 1.7;
    obstacle1.lifetime = 500;
    //obstacle1.debug = true;
    obstacle1.setCollider("rectangle",0,0,40,40);
    var rand = Math.round(random(1,4));
    switch(rand){
      case 1 : obstacle1.addImage(obstacle1Img);
      break;
      case 2 : obstacle1.addImage(obstacle2Img);
      break;
      case 3 : obstacle1.addImage(obstacle3Img);
      break;
      case 4  : obstacle1.addImage(obstacle4Img);
      break;
      default : break;
     }
    obstacle1Grp.add(obstacle1);
  }
}

function reset(){
  gameState = PLAY;
  bg.velocityX = -5;
  restart.visible = false;
  gameOver.visible = false;
  cyclist.changeAnimation("riding",cyclistImg);
  score = 0;
  coinScore = 0;
  lifeScore = 3;
}
