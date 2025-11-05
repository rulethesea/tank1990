import { GameProgress } from "../entities/game-progress";
import Phaser from "phaser";

export class ScoresScene extends Phaser.Scene {

  private background: Phaser.GameObjects.Image;
  private textStageNumber: Phaser.GameObjects.BitmapText;

  private textPlayerOnePoints: Phaser.GameObjects.BitmapText;
  private textPlayerOneRegulars: Phaser.GameObjects.BitmapText;
  private textPlayerOneSpeedies: Phaser.GameObjects.BitmapText;
  private textPlayerOneShooters: Phaser.GameObjects.BitmapText;
  private textPlayerOneHeavies: Phaser.GameObjects.BitmapText;
  private textPlayerOneTotal: Phaser.GameObjects.BitmapText;

  /*private textPlayerTwoPoints: Phaser.GameObjects.BitmapText;
  private textPlayerTwoRegulars: Phaser.GameObjects.BitmapText;
  private textPlayerTwoSpeedies: Phaser.GameObjects.BitmapText;
  private textPlayerTwoShooters: Phaser.GameObjects.BitmapText;
  private textPlayerTwoHeavies: Phaser.GameObjects.BitmapText;*/

  private gameProgress: GameProgress;

  constructor() {
    super ({ key: "ScoresScene" });
  }

  public init(params: GameProgress): void {
    this.gameProgress = params;
    this.gameProgress.calculateStageStats();
  }

  public preload(): void {
    this.load.image("scores-background", "assets/images/backgrounds/scores-background.png");
  }

  public create(): void {

    const defaultTankMessage = "     PTS   ";
    const defaultTotalMessage = "   TOTAL   ";

    this.background = this.add.image(0, 0, "scores-background").setOrigin(0, 0);

    this.textStageNumber = this.add.bitmapText(220 , 300, "console-font", "STAGE  " + this.gameProgress.stageNumber, 24);
    this.textStageNumber.setTint(0xEEEEEE);

    const msgPlayerOnePoints = this.buildPlayerPoints(this.gameProgress.playerOneTotalPoints);
    this.textPlayerOnePoints = this.add.bitmapText(180 , 400, "console-font", msgPlayerOnePoints, 24);
    this.textPlayerOnePoints.setTint(0xFFB600);

    this.textPlayerOneRegulars = this.add.bitmapText(140, 480, "console-font", defaultTankMessage, 24);
    this.textPlayerOneRegulars.setTint(0xEEEEEE);
    this.time.delayedCall(500, () => {
      const messagePlayerOneRegulars = this.buildTanksMessage(this.gameProgress.playerOneRegularsCount, this.gameProgress.playerOneRegularsPoints);
      this.textPlayerOneRegulars.setText(messagePlayerOneRegulars);
    });

    this.textPlayerOneSpeedies = this.add.bitmapText(140, 560, "console-font", defaultTankMessage, 24);
    this.textPlayerOneSpeedies.setTint(0xEEEEEE);
    this.time.delayedCall(1000, () => {
      const msgPlayerOneSpeedies = this.buildTanksMessage(this.gameProgress.playerOneSpeediesCount, this.gameProgress.playerOneSpeediesPoints);
      this.textPlayerOneSpeedies.setText(msgPlayerOneSpeedies);
    });

    this.textPlayerOneShooters = this.add.bitmapText(140, 640, "console-font", defaultTankMessage, 24);
    this.textPlayerOneShooters.setTint(0xEEEEEE);
    this.time.delayedCall(1500, () => {
      const msgPlayerOneShooters = this.buildTanksMessage(this.gameProgress.playerOneShootersCount, this.gameProgress.playerOneShootersPoints);
      this.textPlayerOneShooters.setText(msgPlayerOneShooters);
    });

    this.textPlayerOneHeavies = this.add.bitmapText(140, 720, "console-font", defaultTankMessage, 24);
    this.textPlayerOneHeavies.setTint(0xEEEEEE);
    this.time.delayedCall(2000, () => {
      const msgPlayerOneHeavies = this.buildTanksMessage(this.gameProgress.playerOneHeaviesCount, this.gameProgress.playerOneHeaviesPoints);
      this.textPlayerOneHeavies.setText(msgPlayerOneHeavies);
    });

    this.textPlayerOneTotal = this.add.bitmapText(140, 800, "console-font", defaultTotalMessage, 24);
    this.textPlayerOneTotal.setTint(0xEEEEEE);
    this.time.delayedCall(2500, () => {
      const msgPlayerOneTotal = this.buildTotalMessage(this.gameProgress.playerOneStageCount);
      this.textPlayerOneTotal.setText(msgPlayerOneTotal);
    });

    this.time.delayedCall(5000, () => {
      this.gameProgress.nextStage();
      this.scene.start("StageNumberScene", this.gameProgress );
    });
  }

  public update(_time: number): void {
    // .
  }

  private buildPlayerPoints(playerPoints: number): string {
    return this.padRight(playerPoints, 6, " ");
  }

  private buildTanksMessage(tankCount: number, tankPoints: number): string {
    return this.padRight(tankPoints, 4, " ") + " PTS " + this.padRight(tankCount, 2, " ");
  }

  private buildTotalMessage(tankCount: number) {
    return "   TOTAL " + this.padRight(tankCount, 2, " ");
  }

  private padRight(text: string | number, length: number, paddingChar: string = " "): string {
    let result: string = text.toString();

    while (result.length < length) {
      result = paddingChar + result;
    }

    return result;
  }
}
