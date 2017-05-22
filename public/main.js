// Main state contains the game
const mainState = {
  preload: function () {
    // Load bird
    game.load.image('bird', 'assets/png/male/dead12.png')
    // Load pipe sprite
    game.load.image('pipe', 'assets/pipe.png')

    game.load.image('bg', 'assets/runners/desert_BG.png')
  },

  create: function () {
    this.background = game.add.tileSprite(0, game.height - 400, game.width, 400, 'bg');

    this.pipes = game.add.group()

    game.stage.backgroundColor = '#71c'

    game.physics.startSystem(Phaser.Physics.ARCADE)

    // Display bnird at x: 100, y:245
    this.bird = game.add.sprite(100, 245, 'bird')
    //Add physics to bird
    //Needed for movements, gravity collisions, etc
    game.physics.arcade.enable(this.bird)

    this.bird.body.gravity.y = 1000

    // add pipes every 1.5 seconds
    this.timer = game.time.events.loop(1500, this.addRowOfPipes, this)

    const spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)

    spaceKey.onDown.add(this.jump, this)

    // Add and display score

    this.score = 0

    this.labelScore = game.add.text(20, 20, "0", {
      font: "33px Verdana",
      fill: "#fff"
    })
  },

  update: function () {
    // speed to scroll in pixels per second
     var scrollSpeed = 50;

     // a little bit of math to make sure the speed is consistent whatever the fps
     this.background.tilePosition.x -= scrollSpeed * (game.time.elapsed * 0.001);
    // Restart game if bird is screwed
    if (this.bird.y < 0 || this.bird.y > 400)
      this.restartGame()

    game.physics.arcade.overlap(this.bird, this.pipes, this.restartGame, null, this)
  },

  jump: function () {
    this.bird.body.velocity.y = -350
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
    this.labelScore.text = this.score
  }
}

var game = new Phaser.Game(600, 400)

game.state.add('main', mainState)

game.state.start('main')
