import * as Phaser from "phaser";


import starfieldUrl from "/assets/starfield.png";


export default class Play extends Phaser.Scene {
  fire?: Phaser.Input.Keyboard.Key;
  left?: Phaser.Input.Keyboard.Key;
  right?: Phaser.Input.Keyboard.Key;
  spawnY = 100;
  spawnX = 400;
  ships: Phaser.GameObjects.Shape[] = [];


  starfield?: Phaser.GameObjects.TileSprite;
  spinner?: Phaser.GameObjects.Shape;


  moveSpeed = 1; // radians per millisecond


  constructor() {
    super("play");
  }


  preload() {
    this.load.image("starfield", starfieldUrl);
  }


  #addKey(
    name: keyof typeof Phaser.Input.Keyboard.KeyCodes,
  ): Phaser.Input.Keyboard.Key {
    return this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes[name]);
  }


  create() {
    this.fire = this.#addKey("F");
    this.left = this.#addKey("LEFT");
    this.right = this.#addKey("RIGHT");
    this.starfield = this.add
      .tileSprite(
        0,
        0,
        this.game.config.width as number,
        this.game.config.height as number,
        "starfield",
      )
      .setOrigin(0, 0);
    this.spinner = this.add.rectangle(
      this.spawnY,
      this.spawnX,
      10,
      10,
      0x0ff0f0,
    );
    this.spawnBaddie();
  }
  spawnBaddie() {
    this.ships.push(
      this.add.rectangle(900, Math.random() * 400, 50, 50, 0xff0000),
    );
    setTimeout(
      () => {
        this.spawnBaddie();
      },
      Math.random() * 2500 + 200,
    );
  }


  update(_timeMs: number, delta: number) {
    this.ships.forEach((ship) => {
      ship.x -= 3;
    });
    this.starfield!.tilePositionX -= 4;


    if (this.left!.isDown) {
      this.spinner!.x -= delta * this.moveSpeed;
    }
    if (this.right!.isDown) {
      this.spinner!.x += delta * this.moveSpeed;
    }


    if (this.fire!.isDown) {
      this.tweens.add({
        targets: this.spinner,
        y: "-=200",
        duration: 300,
        ease: Phaser.Math.Easing.Sine.Out,
        onComplete: function (tween, targets) {
          targets[0].y = 400;
          tween = tween;
        },
      });
    }
  }
}

