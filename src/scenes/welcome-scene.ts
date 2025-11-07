import { GameProgress } from "../entities/game-progress";
import Phaser from "phaser";

export class WelcomeScene extends Phaser.Scene {

  private background: Phaser.GameObjects.Image;
  private textStart: Phaser.GameObjects.BitmapText;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  private blink: boolean;
  private gameProgress: GameProgress;

  constructor() {
    super({ key: "WelcomeScene" });
    this.gameProgress = new GameProgress();
  }

  public init(params: any): void {
    this.blink = false;
    this.gameProgress.resetGameProgress();
  }

  public preload() {
    this.load.audio("welcome-music", "assets/sound/stage_start.ogg");
    this.load.image("welcome-background", "assets/images/backgrounds/welcome-background.png");
    this.load.bitmapFont("console-font", "assets/fonts/press-start-2p.png", "assets/fonts/press-start-2p.fnt");
  }

  public create() {
    this.sound.play("welcome-music", { loop: false, volume: 0.5 });
    this.background = this.add.image(this.game.scale.width / 2, 0, "welcome-background").setOrigin(0.5, 0);
    this.cursors = this.input.keyboard!.createCursorKeys();

    this.textStart = this.add.bitmapText(this.game.scale.width / 2, 500, "console-font", "RULE THE SEA", 24).setOrigin(0.5, 0.5);
    this.textStart.setTint(0xEEEEEE);

    this.cameras.main.setScroll(0, -720);
    this.cameras.main.pan(this.game.scale.width / 2, 360, 2000, "Linear", false);

    this.time.addEvent({
      callback: this.blinkBackground,
      callbackScope: this,
      delay: 500,
      loop: true,
    });

    // this.scale.orientation = Phaser.Scale.Orientation.LANDSCAPE;
    this.input.once('pointerdown', () => {
      this.scale.startFullscreen();
      this.nextScene();
    });

    this.game.scale.on("orientationchange", function (orientation: any) {
      if (orientation === Phaser.Scale.PORTRAIT) {
        console.log("portrait");
        orientation = Phaser.Scale.LANDSCAPE;
      } else if (orientation === Phaser.Scale.LANDSCAPE) {
        console.log("landscape");
      }
    });

  }

  public nextScene() {
    this.cursors.space.reset();
    this.gameProgress.nextStage();

    // carga de la siguiente escena
    this.scene.start("StageNumberScene", this.gameProgress);
  }

  public update(time: number): void {
    if (this.cursors.space.isDown) {
      this.nextScene();
    }
  }

  private blinkBackground() {
    this.textStart.setVisible(this.blink);
    this.blink = !this.blink;
  }
}
