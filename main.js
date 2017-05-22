// Main state contains the game
const mainState = {
  preload: () => {

  },

  create: () => {

  },

  update: () => {

  }
}

var game = new Phaser.Game(400, 490)

game.state.add('main', mainState)

game.state.start('main')
