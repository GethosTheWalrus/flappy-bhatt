var FlappyBird = window.FlappyBird || {};

FlappyBird.game = new Phaser.Game(400, 490);
FlappyBird.Main = function(){}; 
FlappyBird.Menu = function() {};

// Global variables
var score = 0;
var scored = false;

// Create the menu state that will exist before the menu
FlappyBird.Menu.prototype = {
    preload: function() {

        

    },

    create: function() {

        // Change the background color of the game to black
        this.game.stage.backgroundColor = '#000';

        var style = { font: "bold 32px Arial", fill: "#fff", align: "center" };

        var text = "Press 'space' to\nstart flapping";
        this.labelMenu = this.game.add.text(75, 200, text, style);

    },

    update: function() {

        if( score > 0 ) {

            text = "Your score was\n" + score + "\nPress 'space'\nto try again";
            this.labelMenu.setText(text);

        }

        var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.startGame, this);    

    },

    startGame: function() {

        this.game.state.start('Main')

    }
}

// Create our main state that will contain the game
FlappyBird.Main.prototype = {
    preload: function() { 
        // This function will be executed at the beginning     
        // That's where we load the images and sounds 

        this.game.load.image('bird', 'assets/bird.png');
        this.game.load.image('pipe', 'assets/pipe.png');
        this.game.load.image('bhatt', 'assets/bhatt.png');

        score = 0;
    },

    create: function() { 
        // This function is called after the preload function     
        // Here we set up the game, display sprites, etc.  

        // Set the physics system
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        // Change the background color of the game to blue
        this.game.stage.backgroundColor = '#71c5cf';

        // Display the bird at the position x=100 and y=245
        this.bird = this.game.add.sprite(100, 245, 'bhatt');
        this.bird.anchor.setTo(-0.2, 0.5); 
          
        // Add physics to the bird
        // Needed for: movements, gravity, collisions, etc.
        this.game.physics.arcade.enable(this.bird);

        // Add gravity to the bird to make it fall
        this.bird.body.gravity.y = 1000;

        // Create an empty group
        this.pipes = this.game.add.group(); 
        this.holes = this.game.add.group();

        // Call the 'jump' function when the spacekey is hit
        var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);  
        
        // Add pipes every 15 seconds
        this.timer = this.game.time.events.loop(1500, this.addRowOfPipes, this); 

        // score and label for the score
        score = 0;
        this.labelScore = this.game.add.text(20, 20, "0", { font: "30px Arial", fill: "#ffffff" });

    },

    update: function() {
        // This function is called 60 times per second    
        // It contains the game's logic   

        // If the bird is out of the screen (too high or too low)
        // Call the 'restartGame' function
        if (this.bird.y < 0 || this.bird.y > 490)
            this.goToMenu();

        this.game.physics.arcade.overlap(this.bird, this.pipes, this.hitPipe, null, this); 
        this.game.physics.arcade.overlap(this.bird, this.holes, this.passThroughHole, null, this); 

        if (this.bird.angle < 20)
            this.bird.angle += 1; 

    },

    // Make the bird jump 
    jump: function() {

        if (this.bird.alive == false)
            return;  

        // Add a vertical velocity to the bird
        this.bird.body.velocity.y = -350;

        this.game.add.tween(this.bird).to({angle: -20}, 100).start(); 
    },

    addOnePipe: function(x, y) {
        // Create a pipe at the position x and y
        var pipe = this.game.add.sprite(x, y, 'pipe');
    
        // Add the pipe to our previously created group
        this.pipes.add(pipe);
    
        // Enable physics on the pipe 
        this.game.physics.arcade.enable(pipe);
    
        // Add velocity to the pipe to make it move left
        pipe.body.velocity.x = -200; 
    
        // Automatically kill the pipe when it's no longer visible 
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    },

    addOneHole: function(x, y) {
        // Create a pipe at the position x and y
        var hole = this.game.add.sprite(x, y, 'bird');
    
        // Add the pipe to our previously created group
        this.holes.add(hole);
    
        // Enable physics on the pipe 
        this.game.physics.arcade.enable(hole);
    
        // Add velocity to the pipe to make it move left
        hole.body.velocity.x = -200; 
    
        // Automatically kill the pipe when it's no longer visible 
        hole.checkWorldBounds = true;
        hole.outOfBoundsKill = true;
    },

    addRowOfPipes: function() {
        // Randomly pick a number between 1 and 5
        // This will be the hole position
        var hole = Math.floor(Math.random() * 5) + 1;
    
        // Add the 6 pipes 
        // With one big hole at position 'hole' and 'hole + 1'
        for (var i = 0; i < 8; i++)
            if (i != hole && i != hole + 1) 
                this.addOnePipe(400, i * 60 + 10);   
            else
                this.addOneHole(400, i * 60 + 10);
    },

    // Restart the game
    restartGame: function() {
        // Start the 'main' state, which restarts the game
        this.game.state.start('Main');
    },

    // Go back to the menu
    goToMenu: function() {

        this.game.state.start('Menu');

    },

    hitPipe: function() {
        // If the bird has already hit a pipe, do nothing
        // It means the bird is already falling off the screen
        if (this.bird.alive == false)
            return;
    
        // Set the alive property of the bird to false
        this.bird.alive = false;
    
        // Prevent new pipes from appearing
        this.game.time.events.remove(this.timer);
    
        // Go through all the pipes, and stop their movement
        this.pipes.forEach(function(p){
            p.body.velocity.x = 0;
        }, this);

        this.holes.forEach(function(h){
            h.body.velocity.x = 0;
        }, this);
    }, 

    passThroughHole: function() {

        if(scored){
            return;
        };

        scored = true;
        this.labelScore.setText(++score);
        setTimeout(function() {

            scored = false;
            
        }, 1000);

    }
};

FlappyBird.game.state.add('Main', FlappyBird.Main);
FlappyBird.game.state.add('Menu', FlappyBird.Menu);

FlappyBird.game.state.start('Menu');