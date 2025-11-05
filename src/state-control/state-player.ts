import Phaser from "phaser";

export class StateControlPlayer {

  public static PLAYER_SPEED: number = 120;

  public static currentDirection: number;
  public static previousDirection: number;

  public static processMovement(player: Phaser.Physics.Arcade.Sprite, cursors: Phaser.Types.Input.Keyboard.CursorKeys): void {
    player.setVelocity(0, 0);

    if (cursors.up.isDown) {
      this.processMovementKey(player, Phaser.UP);
    } else if (cursors.right.isDown) {
      this.processMovementKey(player, Phaser.RIGHT);
    } else if (cursors.down.isDown) {
      this.processMovementKey(player, Phaser.DOWN);
    } else if (cursors.left.isDown) {
      this.processMovementKey(player, Phaser.LEFT);
    }
  }

  public static processMovementKey(player: Phaser.Physics.Arcade.Sprite, dir : number): void {
    player.setVelocity(0, 0);

    if (dir === Phaser.UP) {
      this.setNewDirection(Phaser.UP);
      player.anims.play("game-anim-player01-up", true);
      player.setVelocity(0, -this.PLAYER_SPEED);

    } else if (dir === Phaser.RIGHT) {
      this.setNewDirection(Phaser.RIGHT);
      player.anims.play("game-anim-player01-right", true);
      player.setVelocity(this.PLAYER_SPEED, 0);

    } else if (dir === Phaser.DOWN) {
      this.setNewDirection(Phaser.DOWN);
      player.anims.play("game-anim-player01-down", true);
      player.setVelocity(0, this.PLAYER_SPEED);

    } else if (dir === Phaser.LEFT) {
      this.setNewDirection(Phaser.LEFT);
      player.anims.play("game-anim-player01-left", true);
      player.setVelocity(-this.PLAYER_SPEED, 0);
    }
    // align to grid on direction change
    if (this.currentDirection !== this.previousDirection) {
      const newPosX = Phaser.Math.Snap.To(player.x, 24);
      const newPosY = Phaser.Math.Snap.To(player.y, 24);
      player.setPosition(newPosX, newPosY);
    }
  }

  public static resetDirection() {
    this.currentDirection = Phaser.UP;
  }

  public static getDirection(): number {
    return this.currentDirection;
  }

  public static isDirectionDown(): boolean {
    return (this.currentDirection === Phaser.DOWN);
  }

  public static isDirectionLeft(): boolean {
    return (this.currentDirection === Phaser.LEFT);
  }

  public static isDirectionRight(): boolean {
    return (this.currentDirection === Phaser.RIGHT);
  }

  public static isDirectionUp(): boolean {
    return (this.currentDirection === Phaser.UP);
  }

  private static setNewDirection(direction: number) {
    this.previousDirection = this.currentDirection;
    this.currentDirection = direction;
  }
}
