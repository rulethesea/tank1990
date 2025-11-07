import { GameProgress } from "../entities/game-progress";
import Phaser from "phaser";

export class StageNumberScene extends Phaser.Scene {

  private background: Phaser.GameObjects.Image;
  private textStageNumber: Phaser.GameObjects.BitmapText;

  private gameProgress: GameProgress;

  constructor() {
    super ({ key: "StageNumberScene" });
  }

  public init(params: GameProgress): void {
    this.gameProgress = params;
  }

  public preload(): void {
    this.load.image("load-background", "assets/images/backgrounds/load-background.png");
  }
 
  public create(): void {
    this.background = this.add.image(this.game.scale.width/2, 0, "load-background").setOrigin(0.5, 0);

    this.textStageNumber = this.add.bitmapText(this.game.scale.width/2 , 340, "console-font", "STAGE  " + this.gameProgress.stageNumber, 24).setOrigin(0.5, 0.5);
    this.textStageNumber.setTint(0x111111);

    this.cameras.main.setScroll(0, -720);
    this.cameras.main.pan(this.game.scale.width/2, 360, 500, "Linear", false);

    this.time.delayedCall(2000, () => {
      this.scene.start("StageScene", this.gameProgress);
    });
  }

  public update(time: number): void {
    // .
  }
}
