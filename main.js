var FlappyBird = window.FlappyBird || {};

// Global variables
var score = 0;
var scored = false;

var config = {
    type: Phaser.AUTO,
    width: 400,
    height: 490,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true
        }
    },
    scene: Menu
};

FlappyBird.game = new Phaser.Game(config);
FlappyBird.game.scene.add('Main', Main, false);
FlappyBird.game.scene.add('Menu', Menu, false);