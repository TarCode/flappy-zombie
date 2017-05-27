var Game = function () {}
Game.prototype = {
  preload: function () {

  // Load zombie
  game.load.image('zombie', 'assets/images/dead12.png')
  // Load pipe sprite
  game.load.image('pipe', 'assets/images/pipe.jpg')
  game.load.image('bg', 'assets/images/desert_BG.png')
  game.load.image('bg2', 'assets/images/swamp.png')
  game.load.audio('jump', 'assets/bgm/jump.wav');

},

create: function () {
  this.background = game.add.tileSprite(0, game.height - 400, game.width, 400, 'bg');

  this.pipes = game.add.group()

  game.stage.backgroundColor = '#71c'

  game.physics.startSystem(Phaser.Physics.ARCADE)

  // Display zombie at x: 100, y:245
  this.zombie = game.add.sprite(100, 245, 'zombie')
  //Add physics to zombie
  //Needed for movements, gravity collisions, etc
  game.physics.arcade.enable(this.zombie)

  this.zombie.body.gravity.y = 1000
  this.jumpSound = game.add.audio('jump');

  // add pipes every 1.5 seconds
  this.timer = game.time.events.loop(1500, this.addRowOfPipes, this)

  const spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
  const click = game.input.activePointer.leftButton
  spaceKey.onDown.add(this.jump, this)
  click.onDown.add(this.jump, this)
  // Add and display score

  this.score = 0

  this.labelScore = game.add.text(20, 20, "Score: 0", {
    font: "33px Verdana",
    fill: "#fff"
  })
},

update: function () {
  // speed to scroll in pixels per second
   var scrollSpeed = 50;

   // a little bit of math to make sure the speed is consistent whatever the fps
   this.background.tilePosition.x -= scrollSpeed * (game.time.elapsed * 0.001);
  // Restart game if zombie is screwed
  if (this.zombie.y < 0 || this.zombie.y > 400)
    this.restartGame()

  if(this.zombie.angle < 20)
    this.zombie.angle += 1

  if(this.score > 3)
    this.background.loadTexture('bg2')
  game.physics.arcade.overlap(
      this.zombie, this.pipes, this.hitPipe, null, this);
  game.scale.setShowAll();
  game.scale.refresh();
},

jump: function () {
  if (this.zombie.alive == false)
    return;
  this.zombie.body.velocity.y = -350
  this.jumpSound.play();
  game.add.tween(this.zombie).to({ angle: -20 }, 100).start()

  this.zombie.anchor.setTo(-0.2, 0.5)
},
hitPipe: function() {
    // If the zombie has already hit a pipe, do nothing
    // It means the zombie is already falling off the screen
    if (this.zombie.alive == false)
        return;

    // Set the alive property of the bird to false
    this.zombie.alive = false;

    // Prevent new pipes from appearing
    game.time.events.remove(this.timer);

    // Go through all the pipes, and stop their movement
    this.pipes.forEach(function(p){
        p.body.velocity.x = 0;
    }, this);
},
restartGame: function () {
  game.state.start('GameMenu')
},

addOnePipe: function(x, y) {
  var pipe = game.add.sprite(x, y, 'pipe')

  this.pipes.add(pipe)

  game.physics.arcade.enable(pipe)

  pipe.body.velocity.x = -200

  pipe.checkWorldBounds = true
  pipe.outOfBoundsKill = true
},

addRowOfPipes: function() {
  var hole = Math.floor(Math.random() * 5) + 1

  for (var i = 0; i < 8; i++) {
    if(i != hole && i != hole + 1) {
      this.addOnePipe(400, i * 60 + 10)
    }
  }

  this.score += 1
  this.labelScore.text = "Score: " + this.score
}
}
