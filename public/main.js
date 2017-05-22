// Main state contains the game
const mainState = {
  preload: function () {
    // Make game canvas responsive
    game.scale.scaleMode = Phaser.ScaleManager.aspectRatio;
    game.scale.pageAlignVertically = true;
    game.scale.pageAlignHorizontally = true;
    game.scale.setShowAll();
    game.scale.refresh();

    // Load zombie
    game.load.image('zombie', 'assets/png/male/dead12.png')
    // Load pipe sprite
    game.load.image('pipe', 'assets/pipe.png')

    game.load.image('bg', 'assets/runners/desert_BG.png')
    game.load.image('bg2', 'assets/runners/swamp.png')
  },

  create: function () {
    this.background = game.add.tileSprite(0, game.height - 400, game.width, 400, 'bg');

    this.pipes = game.add.group()

    game.stage.backgroundColor = '#71c'

    game.physics.startSystem(Phaser.Physics.ARCADE)

    // Display bnird at x: 100, y:245
    this.zombie = game.add.sprite(100, 245, 'zombie')
    //Add physics to zombie
    //Needed for movements, gravity collisions, etc
    game.physics.arcade.enable(this.zombie)

    this.zombie.body.gravity.y = 1000

    // add pipes every 1.5 seconds
    this.timer = game.time.events.loop(1500, this.addRowOfPipes, this)

    const spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)

    spaceKey.onDown.add(this.jump, this)

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

    if(this.score > 3)
      this.background.loadTexture('bg2')

    game.physics.arcade.overlap(this.zombie, this.pipes, this.restartGame, null, this)
    game.scale.setShowAll();
    game.scale.refresh();
  },

  jump: function () {
    this.zombie.body.velocity.y = -350
  },

  restartGame: function () {
    game.state.start('main')
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

const game = new Phaser.Game(640, 400)

game.state.add('main', mainState)

game.state.start('main')
