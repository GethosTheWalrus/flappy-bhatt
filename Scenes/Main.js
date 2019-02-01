// Create our main state that will contain the game
class Main extends Phaser.Scene {
    preload() { 
        // This function will be executed at the beginning     
        // That's where we load the images and sounds 

        this.load.image('hole', 'assets/blank.png');
        this.load.image('pipe', 'assets/pipe.png');
        this.load.image('bhatt', 'assets/bhatt.png');
        this.load.image('background', 'assets/background.png');
        this.load.image('ground', 'assets/ground.png');

        score = 0;
    }

    create() { 
        // console.log("started main scene");
        
        this.background = this.add.tileSprite(0, 0, 400, 490, 'background');
        this.background.setOrigin(0, 0);

        this.ground = this.physics.add.sprite(0, 460, 'ground');
        this.ground.displayWidth = 400;
        this.ground.displayHeight = 100;
        this.ground.setOrigin(0, 0);
        this.ground.body.immovable = true;

        // Display the bird at the position x=100 and y=245
        this.bird = this.physics.add.sprite(100, 245, 'bhatt');
        this.bird.setOrigin(-0.2, 0.5);
        this.bird.alive = true;
        this.bird.body.setCircle(28);

        // Add gravity to the bird to make it fall
        this.bird.body.gravity.y = 1000;

        // Create an empty group
        this.pipes = this.physics.add.group(); 
        this.holes = this.physics.add.group();

        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        
        // Add pipes every 15 seconds
        this.pipeSpawnTimer = this.time.addEvent({ delay: 1500, callback: this.addRowOfPipes, callbackScope: this, loop: 1});

        // score and label for the score
        score = 0;
        this.labelScore = this.add.text(20, 20, "0", { font: "30px Arial", fill: "#ffffff" });

        // Add collisions to the bird
        // this.physics.add.collider(this.bird, this.pipes)
        // this.physics.add.collider(this.bird, this.holes)

        this.physics.add.collider(this.bird, this.ground);

        this.physics.add.overlap(this.bird, this.pipes, this.hitPipe, null, this);
        this.physics.add.overlap(this.bird, this.holes, this.passThroughHole, null, this);

        // restart the game when you hit the ground
        this.physics.add.overlap(this.bird, this.ground, this.gameOver, null, this);

    }

    update() {

        // background scrolling
        if(this.bird.alive)
            this.background.tilePositionX += .5;

        // Call the 'jump' function when the spacekey is hit
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey))
            this.jump();

        // bounds checking
        if (this.bird.y < 0 || this.bird.y > 490)
            this.bird.alive = false;

        // bob effect
        if (this.bird.angle < 20)
            this.bird.angle += 1; 

    }

    // Make the bird jump 
    jump() {

        if (this.bird.alive == false)
            return;  

        // Add a vertical velocity to the bird
        this.bird.body.velocity.y = -350;

        // this.add.tween(this.bird).to({angle: -20}, 100).start(); 
        let tween = this.tweens.add({
            targets: this.bird,
            duration: 100,
            delay: 0,
            alpha: 1,
            repeat: 0,
            angle: -20
        });
    }

    addOnePipe(x, y) {
        // Create a pipe at the position x and y
        // var pipe = this.game.add.sprite(x, y, 'pipe');
        var pipe = this.physics.add.sprite(x, y, 'pipe');
    
        // Add the pipe to our previously created group
        this.pipes.add(pipe);
    
        // Add velocity to the pipe to make it move left
        pipe.body.velocity.x = -200; 
    
        // Automatically kill the pipe when it's no longer visible 
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    }

    addOneHole(x, y) {
        // Create a pipe at the position x and y
        // var hole = this.game.add.sprite(x, y, 'hole');
        var hole = this.physics.add.sprite(x, y, 'hole');
    
        // Add the pipe to our previously created group
        this.holes.add(hole);
    
        // Enable physics on the pipe 
        // this.game.physics.arcade.enable(hole);
    
        // Add velocity to the pipe to make it move left
        hole.body.velocity.x = -200; 
    
        // Automatically kill the pipe when it's no longer visible 
        hole.checkWorldBounds = true;
        hole.outOfBoundsKill = true;
    }

    addRowOfPipes() {

        if(this.bird.alive == false) {

            return;

        }

        // Randomly pick a number between 1 and 5
        // This will be the hole position
        var hole = Math.floor(Math.random() * 5) + 1;
    
        // Add the 6 pipes 
        // With one big hole at position 'hole' and 'hole + 1'
        for (var i = 0; i < 8; i++)
            if (i != hole && i != hole + 1) 
                this.addOnePipe(400, i * 60 + 35);   
            else
                this.addOneHole(400, i * 60 + 35);
    }

    // Restart the game
    restartGame() {
        // Start the 'main' state, which restarts the game
        this.game.scene.start('Main');
    }

    // Go back to the menu
    goToMenu() {

        this.scene.start('Menu');

    }

    gameOver() {

        self = this;
        setTimeout(function() {

           self.goToMenu(); 

        }, 2000);

    }

    hitPipe() {

        // If the bird has already hit a pipe, do nothing
        // It means the bird is already falling off the screen
        if (this.bird.alive == false)
            return;
    
        // Set the alive property of the bird to false
        this.bird.alive = false;

        // stop pipes from spawning
        this.time.removeAllEvents;

        // stop pies from moving
        this.pipes.setVelocityX(0);
        this.holes.setVelocityX(0);
    }

    passThroughHole() {

        if(scored){
            return;
        };

        scored = true;

        if(this.bird.alive == true) {

            this.labelScore.setText(++score);

        }
        
        setTimeout(function() {

            scored = false;
            
        }, 1000);

    }
};