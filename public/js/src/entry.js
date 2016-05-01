import $ from 'jquery';
import 'pixi';
import 'p2';
import 'phaser';



var music, player, platforms, cursors, tacos, score = 0, scoreText;

var game = new Phaser.Game(800 /*width*/, 500 /*height*/, Phaser.AUTO /*WebGL or Canvas*/, 'phaser-game' /* id of parent DOM element*/, {
  preload: preload,
  create: create,
  update: update
});

function preload() {
  game.load.image('tacoMini', 'img/taco_mini.png');
  game.load.image('tortilla', 'img/tortilla.jpg');
  game.load.image('guac', 'img/guac.jpg');
  game.load.image('guacLedge', 'img/guac_ledge.jpg');
  game.load.spritesheet('pirate', 'img/pirate.png', 32, 48);
  game.load.audio('music', 'sound/music.wav');

}

function create() {

  //  We're going to be using physics, so enable the Arcade Physics system
  game.physics.startSystem(Phaser.Physics.ARCADE);

  //  A simple background for our game
  game.add.sprite(0, 0, 'tortilla');

  music = game.add.audio('music');

  music.loopFull(0.2);

  scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

  //  The platforms group contains the ground and the 2 ledges we can jump on
  platforms = game.add.group();

  //  We will enable physics for any object that is created in this group
  platforms.enableBody = true;

  // Here we create the ground.
  var ground = platforms.create(0, game.world.height - 64, 'guac');

  // Scale it to fit the width of the game (the original sprite is 400x32 in size)
  ground.scale.setTo(2, 2);

  //  This stops it from falling away when you jump on it
  ground.body.immovable = true;

  //  Now let's create two ledges
  var ledge = platforms.create(500, 100, 'guacLedge');

  ledge.body.immovable = true;

  var ledge = platforms.create(-300, 250, 'guacLedge');

  ledge.body.immovable = true;

  var ledge = platforms.create(450, 340, 'guacLedge');

  ledge.body.immovable = true;


  // The player and its settings
  player = game.add.sprite(32, game.world.height - 150, 'pirate');

  //  We need to enable physics on the player
  game.physics.arcade.enable(player);

  //  Player physics properties. Give the little guy a slight bounce.
  player.body.bounce.y = 0.2;
  player.body.gravity.y = 350;
  player.body.collideWorldBounds = true;

  //  Our two animations, walking left and right.
  player.animations.add('left', [4,5,6,7], 10, true);
  player.animations.add('right', [8,9,10,11], 10, true);


  tacos = game.add.group();

  tacos.enableBody = true;

  //  Here we'll create 12 of them evenly spaced apart
  for (var i = 0; i < 12; i++)
  {
      //  Create a star inside of the 'stars' group
      var taco = tacos.create(i * 70, 0, 'tacoMini');

      //  Let gravity do its thing
      taco.body.gravity.y = 6;

      //  This just gives each taco a slightly random bounce value
      taco.body.bounce.y = 0.7 + Math.random() * 0.2;
  }

}

function collectTaco (player, taco) {

    // Removes the taco from the screen
    taco.kill();

    //  Add and update the score
    score += 10;
    scoreText.text = 'Score: ' + score;

}

function update() {
  //  Collide the player and the stars with the platforms
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(tacos, platforms);
    game.physics.arcade.overlap(player, tacos, collectTaco, null, this);

    cursors = game.input.keyboard.createCursorKeys();

    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        //  Move to the left
        player.body.velocity.x = -150;

        player.animations.play('left');
    }
    else if (cursors.right.isDown)
    {
        //  Move to the right
        player.body.velocity.x = 150;

        player.animations.play('right');
    }
    else
    {
        //  Stand still
        player.animations.stop();

        player.frame = 1;
    }

    //  Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown && player.body.touching.down)
    {
        player.body.velocity.y = -350;
    }

}
