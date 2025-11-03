import { StateControlEnemy } from "../entities/state-control-enemy";
import Phaser from "phaser";

export class StateControlEnemies {

  public static ENEMIES_SPEED: number = 80;

  public static stateControlEnemies: any[];

  public static register(key: string): void {

    if (this.stateControlEnemies === undefined) { this.stateControlEnemies = new Array(0); }

    const enemy = new StateControlEnemy(key);
    this.stateControlEnemies.push(enemy);
  }

  public static processMovement(enemy: Phaser.Physics.Arcade.Sprite, enemyMovement: number): void {

    const stop: boolean = enemy.getData("stop");
    const type: string = enemy.getData("type");

    if (stop) { return; }

    const stateControlEnemy: StateControlEnemy = this.getStateControlEnemy(enemy);
    if (stateControlEnemy === undefined) { return; }

    enemy.setVelocity(0, 0);
    stateControlEnemy.setNewDirection(enemyMovement);

    if (enemyMovement === Phaser.UP) {
      enemy.setVelocity(0, -this.ENEMIES_SPEED);
      enemy.anims.play("game-anim-" + type + "-enemy-up", true);

    } else if (enemyMovement === Phaser.RIGHT) {
      enemy.setVelocity(this.ENEMIES_SPEED, 0);
      enemy.anims.play("game-anim-" + type + "-enemy-right", true);

    } else if (enemyMovement === Phaser.DOWN) {
      enemy.setVelocity(0, this.ENEMIES_SPEED);
      enemy.anims.play("game-anim-" + type + "-enemy-down", true);

    } else if (enemyMovement === Phaser.LEFT) {
      enemy.setVelocity(-this.ENEMIES_SPEED, 0);
      enemy.anims.play("game-anim-" + type + "-enemy-left", true);
    }

    // align to grid on direction change
    if (stateControlEnemy.currentDirection !== stateControlEnemy.previousDirection) {
      // const newPosX = Phaser.Math.Snap.To(enemy.x, 24);
      // const newPosY = Phaser.Math.Snap.To(enemy.y, 24);
      const newPosX = Phaser.Math.Snap.To(enemy.x, 12);
      const newPosY = Phaser.Math.Snap.To(enemy.y, 12);
      enemy.setPosition(newPosX, newPosY);
    }
  }

  public static getDirection(enemy: Phaser.Physics.Arcade.Sprite): number {
    const stateControlEnemy: StateControlEnemy = this.getStateControlEnemy(enemy);
    if (stateControlEnemy === undefined) { return -1; }

    return stateControlEnemy.currentDirection;
  }

  public static isDirectionDown(enemy: Phaser.Physics.Arcade.Sprite): boolean {
    const stateControlEnemy: StateControlEnemy = this.getStateControlEnemy(enemy);
    if (stateControlEnemy === undefined) { return false; }

    return (stateControlEnemy.currentDirection === Phaser.DOWN);
  }

  public static isDirectionLeft(enemy: Phaser.Physics.Arcade.Sprite): boolean {
    const stateControlEnemy: StateControlEnemy = this.getStateControlEnemy(enemy);
    if (stateControlEnemy === undefined) { return false; }

    return (stateControlEnemy.currentDirection === Phaser.LEFT);
  }

  public static isDirectionRight(enemy: Phaser.Physics.Arcade.Sprite): boolean {
    const stateControlEnemy: StateControlEnemy = this.getStateControlEnemy(enemy);
    if (stateControlEnemy === undefined) { return false; }

    return (stateControlEnemy.currentDirection === Phaser.RIGHT);
  }

  public static isDirectionUp(enemy: Phaser.Physics.Arcade.Sprite): boolean {
    const stateControlEnemy: StateControlEnemy = this.getStateControlEnemy(enemy);
    if (stateControlEnemy === undefined) { return false; }

    return (stateControlEnemy.currentDirection === Phaser.UP);
  }

  private static getStateControlEnemy(enemy: Phaser.Physics.Arcade.Sprite): StateControlEnemy {
    const key: string = enemy.getData("name");
    return this.stateControlEnemies.filter((a) => a.key === key)[0];
  }
}
