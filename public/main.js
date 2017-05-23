var Main = function () {}

Main.prototype = {
  preload: function () {
    game.scale.scaleMode = Phaser.ScaleManager.aspectRatio;
    game.scale.pageAlignVertically = true;
    game.scale.pageAlignHorizontally = true;
    game.scale.setShowAll();
    game.scale.refresh();

    game.load.image('stars', 'assets/images/stars.jpg')
    game.load.image('loading', 'assets/images/loading.png')
    game.load.image('brand', 'assets/images/logo.png')
    game.load.script('splash', 'states/splash.js')
  },

  create: function () {
    game.state.add('Splash', Splash)
    game.state.start('Splash')
  }
}

const game = new Phaser.Game(640, 400)
game.state.add('Main', Main)
game.state.start('Main')
