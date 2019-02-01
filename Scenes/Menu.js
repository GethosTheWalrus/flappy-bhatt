// Create the menu state that will exist before the menu
class Menu extends Phaser.Scene {
    preload() {

        

    }

    create() {

        var style = { font: "bold 32px Arial", fill: "#fff", align: "center" };

        var text = "Press 'space' to\nstart flapping";
        this.labelMenu = this.add.text(75, 200, text, style);

        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    }

    update() {

        if( score > 0 ) {

            var text = "Your score was\n" + score + "\nPress 'space'\nto try again";
            this.labelMenu.setText(text);

        }

        var spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        if (Phaser.Input.Keyboard.JustDown(spacebar)) {

            this.startGame();

        }

    }

    startGame() {

        console.log('start game')
        this.scene.start('Main')

    }
}