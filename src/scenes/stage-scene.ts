import { BulletAnimations } from "../animations/bullet-animations";
import { EnemiesHeavyAnimations } from "../animations/enemies-heavy-animations";
import { EnemiesRegularAnimations } from "../animations/enemies-regular-animations";
import { EnemiesShooterAnimations } from "../animations/enemies-shooter-animations";
import { EnemiesSpeedyAnimations } from "../animations/enemies-speedy-animations";
import { FortressAnimations } from "../animations/fortress-animations";
import { PlayerOneAnimations } from "../animations/player-one-animations";
import { PlayerTwoAnimations } from "../animations/player-two-animations";
import { SpawnPointAnimations } from "../animations/spawn-point-animations";

import { GameProgress } from "../entities/game-progress";
import { ScriptManager } from "../scripting/script-manager";
import { StateMachine } from "../scripting/state-machine";

import { StateControlBullets } from "../state-control/state-bullets";
import { StateControlEnemies } from "../state-control/state-enemies";
import { StateControlPlayer } from "../state-control/state-player";
import Phaser from "phaser";
import VirtualJoystick from 'phaser3-rex-plugins/plugins/virtualjoystick.js';

export class StageScene extends Phaser.Scene {

  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  private background: Phaser.GameObjects.Image;
  private logoEnemiesCount: Phaser.GameObjects.Group;
  private logoGameOver: Phaser.GameObjects.Image;
  private logoLevelCount: Phaser.GameObjects.Image;
  private textLevelCount: Phaser.GameObjects.BitmapText;
  private logoLivesCount1: Phaser.GameObjects.Image;
  private textLivesCount1A: Phaser.GameObjects.BitmapText;
  private textLivesCount1B: Phaser.GameObjects.BitmapText;
  // private logoLivesCount2: Phaser.GameObjects.Image;
  // private textLivesCount2A: Phaser.GameObjects.BitmapText;
  // private textLivesCount2B: Phaser.GameObjects.BitmapText;

  private frameLayer: Phaser.Tilemaps.TilemapLayer;
  private waterLayer: Phaser.Tilemaps.TilemapLayer;
  private rockLayer: Phaser.Tilemaps.TilemapLayer;
  private gameLayer: Phaser.Tilemaps.TilemapLayer;
  private bulletsEnemies: Phaser.Physics.Arcade.Group;
  private bulletsPlayer1: Phaser.Physics.Arcade.Group;
  // private bulletsPlayer2: Phaser.Physics.Arcade.Group;
  private enemies: Phaser.Physics.Arcade.Group;
  private fortress: Phaser.Physics.Arcade.Sprite;
  private player1: Phaser.Physics.Arcade.Sprite;
  // private player2: Phaser.Physics.Arcade.Sprite;

  private directionPlayer1: number;
  private gameProgress: GameProgress;

  private filesBaseKey: string;
  private filesBaseUrl: string;
  private gameOver: boolean;
  private stageCompleted: boolean;
  private sceneEnding: boolean;
  private joyStick: VirtualJoystick;

  constructor() {
    super({ key: "StageScene" });
  }

  public init(params: GameProgress): void {
    this.gameProgress = params;
    this.gameProgress.resetStageStats();
    StateControlPlayer.resetDirection();

    this.filesBaseKey = "game-stage" + this.gameProgress.getStageName();
    this.filesBaseUrl = "assets/stages/stage" + this.gameProgress.getStageName();

    this.gameOver = false;
    this.stageCompleted = false;
    this.sceneEnding = false;
  }

  public preload(): void {
    this.load.image("game-background", "assets/images/backgrounds/game-background.png");

    this.load.tilemapTiledJSON(this.filesBaseKey + "-tilemap", this.filesBaseUrl + "-tilemap.json");
    this.load.json(this.filesBaseKey + "-script", this.filesBaseUrl + "-script.json");
    this.load.image("game-tileset", "assets/images/tiles/game-tileset.png");

    this.load.image("left", "assets/images/pad/left.png");
    this.load.image("right", "assets/images/pad/right.png");
    this.load.image("up", "assets/images/pad/up.png");
    this.load.image("down", "assets/images/pad/down.png");
    this.load.image("shooting", "assets/images/sprites/shooting.png");
    this.load.image("btnRight", "assets/images/sprites/right.png");

    this.load.spritesheet("game-bullet", "assets/images/sprites/bullet.png", { frameWidth: 12, frameHeight: 12 });
    this.load.spritesheet("game-bullet-explosion", "assets/images/sprites/bullet-explosion.png", { frameWidth: 48, frameHeight: 48 });
    this.load.spritesheet("game-enemy-regular", "assets/images/sprites/enemy-regular.png", { frameWidth: 48, frameHeight: 48 });
    this.load.spritesheet("game-enemy-speedy", "assets/images/sprites/enemy-speedy.png", { frameWidth: 48, frameHeight: 48 });
    this.load.spritesheet("game-enemy-shooter", "assets/images/sprites/enemy-shooter.png", { frameWidth: 48, frameHeight: 48 });
    this.load.spritesheet("game-enemy-heavy", "assets/images/sprites/enemy-heavy.png", { frameWidth: 48, frameHeight: 48 });
    this.load.spritesheet("game-fortress", "assets/images/sprites/fortress.png", { frameWidth: 48, frameHeight: 48 });
    this.load.spritesheet("game-player-one", "assets/images/sprites/player-one.png", { frameWidth: 48, frameHeight: 48 });
    this.load.spritesheet("game-player-two", "assets/images/sprites/player-two.png", { frameWidth: 48, frameHeight: 48 });
    this.load.spritesheet("game-points", "assets/images/sprites/game-points.png", { frameWidth: 48, frameHeight: 48 });
    this.load.spritesheet("game-spawn-blink", "assets/images/sprites/spawn-blink.png", { frameWidth: 48, frameHeight: 48 });
    this.load.spritesheet("game-tank-explosion", "assets/images/sprites/tank-explosion.png", { frameWidth: 96, frameHeight: 96 });

    this.load.image("game-enemies-count", "assets/images/sprites/logo-enemies.png");
    this.load.image("game-game-over", "assets/images/sprites/logo-game-over.png");
    this.load.image("game-level-count", "assets/images/sprites/logo-flag.png");
    this.load.image("game-lives-count", "assets/images/sprites/logo-lives.png");
    this.load.image("game-spawn-point", "assets/images/sprites/spawn-point.png");

    this.load.audio("bullet_shot", "assets/sound/bullet_shot.ogg");
    this.load.audio("bullet_hit_1", "assets/sound/bullet_hit_1.ogg");
    this.load.audio("bullet_hit_1", "assets/sound/bullet_hit_1.ogg");
    this.load.audio("explosion_1", "assets/sound/explosion_1.ogg");
    this.load.audio("explosion_2", "assets/sound/explosion_2.ogg");

    // var url = 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js';
    // this.load.plugin('rexvirtualjoystickplugin', url, true);

    this.cameras.main.setScroll(-250, 0);
  }

  public create(): void {

    this.cursors = this.input.keyboard!.createCursorKeys();
    this.resetCursorKeys();

    this.background = this.add.image(640, 360, "game-background");
    this.background.setOrigin(0.5, 0.5);

    let btnRight = this.add.image(900, 450, "btnRight").setInteractive();
    let btnShooting = this.add.image(900, 450, "shooting");
    btnRight.on('pointerdown', () => {
      btnShooting.scale = 1.1;
      this.cursors.space.reset();
      this.createBulletForPlayerOne();
    });
    btnRight.on('pointerup', () => {
      btnShooting.scale = 1.0;
    });

    const map = this.make.tilemap({ key: this.filesBaseKey + "-tilemap" });
    const tileSet = map.addTilesetImage("game-tileset", "game-tileset");
    //ts-ignore
    if (!tileSet) {
      throw new Error("Failed to load game-tileset");
    }

    this.frameLayer = map.createLayer("frame-layer", tileSet, 0, 0)!;
    this.frameLayer.setCollisionBetween(1, 9999, true, true);
    this.gameLayer = map.createLayer("game-layer", tileSet, 0, 0)!;
    this.gameLayer.setCollisionBetween(1, 9999, true, true);
    this.rockLayer = map.createLayer("rock-layer", tileSet, 0, 0)!;
    this.rockLayer.setCollisionBetween(1, 9999, true, true);
    this.waterLayer = map.createLayer("water-layer", tileSet, 0, 0)!;
    this.waterLayer.setCollisionBetween(1, 9999, true, true);
    const aboveLayer = (map.createLayer("above-layer", tileSet, 0, 0)!).setDepth(2);

    this.bulletsEnemies = this.physics.add.group();
    this.bulletsPlayer1 = this.physics.add.group();
    // this.bulletsPlayer2 = this.physics.add.group();
    this.enemies = this.physics.add.group();

    this.fortress = this.physics.add.sprite(360, 648, "game-fortress");
    this.fortress.refreshBody();
    this.fortress.setBounce(0, 0);
    this.fortress.setCollideWorldBounds(true);
    this.fortress.setImmovable(true);

    this.player1 = this.physics.add.sprite(264, 648, "game-player-one");
    this.player1.setData("name", "player-one");
    this.player1.setBounce(0, 0);
    this.player1.setCollideWorldBounds(true);
    this.player1.setImmovable(false);
    this.player1.setPushable(false);

    // this.player2 = this.physics.add.sprite(456, 648, "game-player-two");
    // this.player2.setData("name", "player-two");
    // this.player2.setBounce(0, 0);
    // this.player2.setCollideWorldBounds(true);
    // this.player2.setImmovable(false);
    // this.player2.setPushable(false);

    this.joyStick = new VirtualJoystick(this, {
      x: 120,
      y: 450,
      radius: 80,
      base: this.add.circle(0, 0, 80, 0x888888),
      thumb: this.add.circle(0, 0, 40, 0xcccccc),
      dir: '4dir',   // 'up&down'|0|'left&right'|1|'4dir'|2|'8dir'|3
      forceMin: 15,
      // enable: true
    }).on('update', this.dumpJoyStickState, this);

    // let btnDown = this.add.image(-100, 600, "down").setInteractive();
    // let btnUp = this.add.image(-100, 500, "up").setInteractive();
    // let btnLeft = this.add.image(-150, 550, "left").setInteractive();
    // let btnRight = this.add.image(- 50, 550, "right").setInteractive();
    

    // btnDown.on('pointerdown', () => {
    //   this.directionPlayer1 = Phaser.DOWN;
    // });
    // btnUp.on('pointerdown', () => {
    //   this.directionPlayer1 = Phaser.UP;
    // });
    // btnLeft.on('pointerdown', () => {
    //   this.directionPlayer1 = Phaser.LEFT;
    // });
    // btnRight.on('pointerdown', () => {
    //   this.directionPlayer1 = Phaser.RIGHT;
    // });


    // btnDown.on('pointerup', () => {
    //   this.directionPlayer1 = -1;
    // });
    // btnUp.on('pointerup', () => {
    //   this.directionPlayer1 = -1;
    // });
    // btnLeft.on('pointerup', () => {
    //   this.directionPlayer1 = -1;
    // });
    // btnRight.on('pointerup', () => {
    //   this.directionPlayer1 = -1;
    // });

    this.logoGameOver = this.add.image(360, 744, "game-game-over").setDepth(3);
    this.logoLevelCount = this.add.image(720, 576, "game-level-count");
    this.textLevelCount = this.add.bitmapText(720, 600, "console-font", this.gameProgress.stageNumber.toString(), 24);
    this.textLevelCount.setTint(0x111111);
    this.logoLivesCount1 = this.add.image(708, 444, "game-lives-count");
    this.textLivesCount1A = this.add.bitmapText(696, 408, "console-font", "IP", 24);
    this.textLivesCount1A.setTint(0x111111);
    this.textLivesCount1B = this.add.bitmapText(724, 432, "console-font", this.gameProgress.playerOneLives.toString(), 24);
    this.textLivesCount1B.setTint(0x111111);
    // this.logoLivesCount2 = this.add.image(708, 516, "game-lives-count");
    // this.textLivesCount2A = this.add.bitmapText(696, 480, "console-font", "#P", 24);
    // this.textLivesCount2A.setTint(0x111111);
    // this.textLivesCount2B = this.add.bitmapText(724, 504, "console-font", this.gameProgress.playerTwoLives.toString(), 24);
    // this.textLivesCount2B.setTint(0x111111);
    this.logoEnemiesCount = this.add.group();
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 2; j++) {
        this.logoEnemiesCount.create(708 + (j * 24), 84 + (i * 24), "game-enemies-count");
      }
    }

    this.setupAnimations();
    this.setupCollitions();

    const dataJSON = this.cache.json.get(this.filesBaseKey + "-script");
    ScriptManager.parse(this, this.enemies, dataJSON, this.enemyCreated, this.logoEnemiesCount);
  }

  dumpJoyStickState() {
    var cursorKeys = this.joyStick.createCursorKeys();

    if (cursorKeys['up'].isDown) {
      this.directionPlayer1 = Phaser.UP;
    } else if (cursorKeys['down'].isDown) {
      this.directionPlayer1 = Phaser.DOWN;
    } else if (cursorKeys['left'].isDown) {
      this.directionPlayer1 = Phaser.LEFT;
    } else if (cursorKeys['right'].isDown) {
      this.directionPlayer1 = Phaser.RIGHT;
    } else {
      this.directionPlayer1 = -1;
    }
  }

  public update(time: number): void {

    if (this.player1.body === undefined) { return; }

    if (this.directionPlayer1 > 0) {
      StateControlPlayer.processMovementKey(this.player1, this.directionPlayer1);
    } else {
      StateControlPlayer.processMovement(this.player1, this.cursors);
    }

    if (this.cursors.space.isDown) {
      this.cursors.space.reset();
      this.createBulletForPlayerOne();
    }

    this.enemies.getChildren().forEach((element) => {
      const enemy = element as Phaser.Physics.Arcade.Sprite;

      const enemyName = element.getData("name").toString();
      const enemyMovement = StateMachine.getMovement(enemyName);
      const enemyShooting = StateMachine.getShooting(enemyName);

      StateControlEnemies.processMovement(enemy, enemyMovement);
      if (enemyShooting) { this.createBulletForEnemy(enemy); }
    });

    if (this.gameOver && !this.sceneEnding) { this.stageFailed(); }
    if (this.stageCompleted && !this.sceneEnding) { this.stageSucceeded(); }

    if (this.cursors.shift.isDown && this.gameProgress.stageNumber < this.gameProgress.MAX_STAGE) {
      this.cursors.shift.reset();
      this.stageSucceeded();
    }
    if (this.cursors.shift.isDown && this.gameProgress.stageNumber === this.gameProgress.MAX_STAGE) {
      this.cursors.shift.reset();
      this.stageFailed();
    }
  }

  private setupAnimations(): void {
    BulletAnimations.create(this);
    EnemiesHeavyAnimations.create(this);
    EnemiesRegularAnimations.create(this);
    EnemiesShooterAnimations.create(this);
    EnemiesSpeedyAnimations.create(this);
    FortressAnimations.create(this);
    PlayerOneAnimations.create(this);
    PlayerTwoAnimations.create(this);
    SpawnPointAnimations.create(this);
  }

  private setupCollitions(): void {
    // this.physics.add.collider(this.player1, this.player2);

    this.physics.add.collider(this.player1, this.frameLayer);
    this.physics.add.collider(this.player1, this.gameLayer);
    this.physics.add.collider(this.player1, this.fortress);
    this.physics.add.collider(this.player1, this.enemies);
    this.physics.add.collider(this.player1, this.rockLayer);
    this.physics.add.collider(this.player1, this.waterLayer);

    // this.physics.add.collider(this.player2, this.frameLayer);
    // this.physics.add.collider(this.player2, this.gameLayer);
    // this.physics.add.collider(this.player2, this.fortress);
    // this.physics.add.collider(this.player2, this.enemies);
    // this.physics.add.collider(this.player2, this.rockLayer);

    this.physics.add.collider(this.enemies, this.frameLayer);
    this.physics.add.collider(this.enemies, this.gameLayer);
    this.physics.add.collider(this.enemies, this.fortress);
    this.physics.add.collider(this.enemies, this.rockLayer);
    this.physics.add.collider(this.enemies, this.waterLayer);

    //@ts-ignore
    this.physics.add.collider(this.bulletsPlayer1, this.rockLayer, this.collitionDestroyBullet, null, this);
    //@ts-ignore
    this.physics.add.collider(this.bulletsPlayer1, this.frameLayer, this.collitionDestroyBullet, null, this);
    //@ts-ignore
    this.physics.add.collider(this.bulletsPlayer1, this.gameLayer, this.collitionDestroyGameLayer, null, this);
    //@ts-ignore
    this.physics.add.collider(this.bulletsPlayer1, this.fortress, this.collitionDestroyFortress, null, this);
    //@ts-ignore
    this.physics.add.collider(this.bulletsPlayer1, this.enemies, this.collitionDestroyEnemy, null, this);
    //@ts-ignore
    this.physics.add.collider(this.bulletsPlayer1, this.bulletsEnemies, this.collitionDestroyBullets, null, this);
    // this.physics.add.collider(this.bulletsPlayer1, this.player2, this.collitionDestroyBullet, null, this);

    // this.physics.add.collider(this.bulletsPlayer2, this.rockLayer, this.collitionDestroyBullet, null, this);
    // this.physics.add.collider(this.bulletsPlayer2, this.player1, this.collitionDestroyBullet, null, this);
    // this.physics.add.collider(this.bulletsPlayer2, this.frameLayer, this.collitionDestroyBullet, null, this);
    // this.physics.add.collider(this.bulletsPlayer2, this.gameLayer, this.collitionDestroyGameLayer, null, this);
    // this.physics.add.collider(this.bulletsPlayer2, this.fortress, this.collitionDestroyFortress, null, this);
    // this.physics.add.collider(this.bulletsPlayer2, this.enemies, this.collitionDestroyEnemy, null, this);
    // this.physics.add.collider(this.bulletsPlayer2, this.bulletsEnemies, this.collitionDestroyBullets, null, this);

    //@ts-ignore
    this.physics.add.collider(this.bulletsEnemies, this.player1, this.collitionDestroyPlayer, null, this);
    //@ts-ignore
    this.physics.add.collider(this.bulletsEnemies, this.rockLayer, this.collitionDestroyBullet, null, this);
    //@ts-ignore
    this.physics.add.collider(this.bulletsEnemies, this.frameLayer, this.collitionDestroyBullet, null, this);
    //@ts-ignore
    this.physics.add.collider(this.bulletsEnemies, this.gameLayer, this.collitionDestroyGameLayer, null, this);
    //@ts-ignore
    this.physics.add.collider(this.bulletsEnemies, this.fortress, this.collitionDestroyFortress, null, this);
    // this.physics.add.collider(this.bulletsEnemies, this.player2, this.collitionDestroyBullet, null, this); // to modifiy
  }

  private createBulletForPlayerOne() {
    this.sound.play("bullet_shot");

    if (this.bulletsPlayer1.getLength() > 1) { return; }
    // if (this.bulletsPlayer1.getLength() > 0) { return; }
    const BULLET_SPEED = 360;
    const BULLET_DELTA = 24 - 1; // -1 for tiles coordinates

    let anim: string = "";
    let posX: number = 0;
    let posY: number = 0;
    let velX: number = 0;
    let velY: number = 0;

    const direction = StateControlPlayer.getDirection();

    if (direction == Phaser.UP || direction == undefined) {
      anim = "game-anim-bullet-up";
      posX = this.player1.x;
      posY = this.player1.y - BULLET_DELTA;
      velX = 0;
      velY = -BULLET_SPEED;
    }
    else if (direction == Phaser.RIGHT) {
      anim = "game-anim-bullet-right";
      posX = this.player1.x + BULLET_DELTA;
      posY = this.player1.y;
      velX = BULLET_SPEED;
      velY = 0;
    }
    else if (direction == Phaser.DOWN) {
      anim = "game-anim-bullet-down";
      posX = this.player1.x;
      posY = this.player1.y + BULLET_DELTA;
      velX = 0;
      velY = BULLET_SPEED;
    }
    else if (direction == Phaser.LEFT) {
      anim = "game-anim-bullet-left";
      posX = this.player1.x - BULLET_DELTA;
      posY = this.player1.y;
      velX = -BULLET_SPEED;
      velY = 0;
    }

    const bullet: Phaser.Physics.Arcade.Sprite = this.bulletsPlayer1.create(posX, posY, "game-bullet");
    bullet.setData("name", "player-one-bullet");
    bullet.setData("key", Phaser.Math.RND.integer());
    bullet.setBounce(0, 0);
    bullet.setCollideWorldBounds(true);
    bullet.setVelocity(velX, velY);
    bullet.anims.play(anim, true);

    const bulletDirection = StateControlPlayer.getDirection();
    StateControlBullets.register(bullet.getData("name"), bullet.getData("key"), bulletDirection);
  }

  private createBulletForEnemy(enemy: Phaser.Physics.Arcade.Sprite) {

    // if (this.bulletsEnemies.getLength() > 0) { return; }
    // ToDo: Limitar a 1 disparo a la vez por enemigo

    const BULLET_SPEED = 360;
    const BULLET_DELTA = 24 - 1; // -1 for tiles coordinates

    let anim: string = "";
    let posX: number = 0;
    let posY: number = 0;
    let velX: number = 0;
    let velY: number = 0;

    const direction = StateControlEnemies.getDirection(enemy);

    if (direction == Phaser.UP) {
      anim = "game-anim-bullet-up";
      posX = enemy.x;
      posY = enemy.y - BULLET_DELTA;
      velX = 0;
      velY = -BULLET_SPEED;
    }
    else if (direction == Phaser.RIGHT) {
      anim = "game-anim-bullet-right";
      posX = enemy.x + BULLET_DELTA;
      posY = enemy.y;
      velX = BULLET_SPEED;
      velY = 0;
    }
    else if (direction == Phaser.DOWN) {
      anim = "game-anim-bullet-down";
      posX = enemy.x;
      posY = enemy.y + BULLET_DELTA;
      velX = 0;
      velY = BULLET_SPEED;
    }
    else if (direction == Phaser.LEFT) {
      anim = "game-anim-bullet-left";
      posX = enemy.x - BULLET_DELTA;
      posY = enemy.y;
      velX = -BULLET_SPEED;
      velY = 0;
    }

    const bullet: Phaser.Physics.Arcade.Sprite = this.bulletsEnemies.create(posX, posY, "game-bullet");
    bullet.setBounce(0, 0);
    bullet.setCollideWorldBounds(true);
    bullet.setData("name", "enemy-bullet");
    bullet.setData("key", Phaser.Math.RND.integer());
    bullet.setVelocity(velX, velY);
    bullet.anims.play(anim, true);

    const bulletDirection = StateControlEnemies.getDirection(enemy);
    StateControlBullets.register(bullet.getData("name"), bullet.getData("key"), bulletDirection);
  }

  private collitionDestroyBullet(src: Phaser.Physics.Arcade.Sprite, dst: Phaser.Physics.Arcade.Sprite): void {

    if (src.getData !== undefined) {
      this.sound.play("explosion_1");

      src.anims.play("game-anim-bullet-explosion", true);
      // StateControlBullets.unregister(src.getData("name"), src.getData("key"));

      if (src.getData("name") === "player-one-bullet") {
        this.time.delayedCall(150, () => { this.bulletsPlayer1.remove(src, true, true); });
      }
      if (src.getData("name") === "enemy-bullet") {
        this.time.delayedCall(150, () => { this.bulletsEnemies.remove(src, true, true); });
      }
    }

    if (dst.getData !== undefined) {
      this.sound.play("explosion_1");

      dst.anims.play("game-anim-bullet-explosion", true);
      // StateControlBullets.unregister(dst.getData("name"), dst.getData("key"));

      if (dst.getData !== undefined && dst.getData("name") === "player-one-bullet") {
        this.time.delayedCall(150, () => { this.bulletsPlayer1.remove(dst, true, true); });
      }
      if (dst.getData !== undefined && dst.getData("name") === "enemy-bullet") {
        this.time.delayedCall(150, () => { this.bulletsEnemies.remove(dst, true, true); });
      }
    }
  }

  private collitionDestroyBullets(src: Phaser.Physics.Arcade.Sprite, dst: Phaser.Physics.Arcade.Sprite): void {
    this.bulletsPlayer1.remove(src, true, true);
    this.bulletsEnemies.remove(dst, true, true);
  }

  private collitionDestroyEnemy(src: Phaser.Physics.Arcade.Sprite, dst: Phaser.Physics.Arcade.Sprite): void {
    this.sound.play("explosion_2");
    src.anims.play("game-anim-bullet-explosion", true);
    this.time.delayedCall(150, () => {
      this.bulletsPlayer1.remove(src, true, true);
    });

    const type = dst.getData("type");
    const anim = "game-anim-" + type + "-explosion";

    if (type === "regular") {
      this.gameProgress.playerOneRegularsCount += 1;
    } else if (type === "speedy") {
      this.gameProgress.playerOneSpeediesCount += 1;
    } else if (type === "shooter") {
      this.gameProgress.playerOneShootersCount += 1;
    } else if (type === "heavy") {
      this.gameProgress.playerOneHeaviesCount += 1;
    }

    dst.body!.enable = false;
    dst.setData("stop", true);
    dst.anims.play(anim, true);

    this.time.delayedCall(1000, () => {
      this.enemies.remove(dst, true, true);
      this.checkStageCompleted();
    });
  }

  private collitionDestroyFortress(src: Phaser.Physics.Arcade.Sprite, dst: Phaser.Physics.Arcade.Sprite): void {

    this.fortress.anims.play("game-anim-fortress-destroyed");

    this.bulletsPlayer1.remove(dst, true, true);
    this.bulletsEnemies.remove(dst, true, true);

    this.gameOver = true;
  }

  private collitionDestroyGameLayer(src: Phaser.Physics.Arcade.Sprite, dst: Phaser.Physics.Arcade.Sprite): void {

    src.anims.play("game-anim-bullet-explosion", true);

    const name: string = src.getData("name");

    if (name === "player-one-bullet") {
      this.time.delayedCall(150, () => { this.bulletsPlayer1.remove(src, true, true); });
    }
    else if (name === "enemy-bullet") {
      this.time.delayedCall(150, () => { this.bulletsEnemies.remove(src, true, true); });
    }

    const direction = StateControlBullets.getDirection(src);

    const tileXY: Phaser.Math.Vector2 = this.gameLayer.worldToTileXY(src.x, src.y);

    // console.log("Tile X: " + tileXY.x + " Y: " + tileXY.y);
    // console.log("Direction: " + direction);
    const delta = 1;

    if (direction == Phaser.UP) {
      // const delta = this.gameLayer.hasTileAt(tileXY.x, tileXY.y - 1) ? 1 : 2;
      let tile1 = this.gameLayer.removeTileAt(tileXY.x + 1, tileXY.y - delta);
      let tile2 = this.gameLayer.removeTileAt(tileXY.x + 0, tileXY.y - delta);
      let tile3 = this.gameLayer.removeTileAt(tileXY.x - 1, tileXY.y - delta);
      let tile4 = this.gameLayer.removeTileAt(tileXY.x - 2, tileXY.y - delta);
    }
    else if (direction == Phaser.RIGHT) {
      // const delta = this.gameLayer.hasTileAt(tileXY.x + 1, tileXY.y) ? 1 : 2;
      this.gameLayer.removeTileAt(tileXY.x + delta, tileXY.y - 2);
      this.gameLayer.removeTileAt(tileXY.x + delta, tileXY.y - 1);
      this.gameLayer.removeTileAt(tileXY.x + delta, tileXY.y + 0);
      this.gameLayer.removeTileAt(tileXY.x + delta, tileXY.y + 1);
    }
    else if (direction == Phaser.DOWN) {
      // const delta = this.gameLayer.hasTileAt(tileXY.x, tileXY.y + 1) ? 1 : 2;
      this.gameLayer.removeTileAt(tileXY.x + 1, tileXY.y + delta);
      this.gameLayer.removeTileAt(tileXY.x + 0, tileXY.y + delta);
      this.gameLayer.removeTileAt(tileXY.x - 1, tileXY.y + delta);
      this.gameLayer.removeTileAt(tileXY.x - 2, tileXY.y + delta);
    }
    else if (direction == Phaser.LEFT) {
      // const delta = this.gameLayer.hasTileAt(tileXY.x - 1, tileXY.y) ? 1 : 2;
      this.gameLayer.removeTileAt(tileXY.x - delta, tileXY.y - 2);
      this.gameLayer.removeTileAt(tileXY.x - delta, tileXY.y - 1);
      this.gameLayer.removeTileAt(tileXY.x - delta, tileXY.y + 0);
      this.gameLayer.removeTileAt(tileXY.x - delta, tileXY.y + 1);
    }
  }

  private collitionDestroyPlayer(src: Phaser.Physics.Arcade.Sprite, dst: Phaser.Physics.Arcade.Sprite): void {

    dst.anims.play("game-anim-bullet-explosion", true);
    dst.body!.enable = false;
    this.bulletsEnemies.remove(dst, true, true);

    this.gameProgress.playerOneLives -= 1;

    if (this.gameProgress.playerOneLives >= 0) {
      this.textLivesCount1B.setText(this.gameProgress.playerOneLives.toString());
      this.player1.setPosition(264, 648);

    } else {
      this.gameOver = true;
      this.player1.setVisible(false);
    }
  }

  private enemyCreated(logoEnemiesCount: Phaser.GameObjects.Group) {
    logoEnemiesCount.remove(logoEnemiesCount.getLast(true), true, true);
  }

  private resetCursorKeys(): void {
    this.cursors.down.reset();
    this.cursors.left.reset();
    this.cursors.right.reset();
    this.cursors.shift.reset();
    this.cursors.space.reset();
    this.cursors.up.reset();
  }

  private checkStageCompleted(): void {
    if (this.logoEnemiesCount.getLength() === 0 && this.enemies.getLength() === 0) {
      this.stageCompleted = true;
    }
  }

  private stageFailed() {
    if (this.sceneEnding) { return; }
    this.sceneEnding = true;

    this.tweens.add({ duration: 2000, ease: "Back", repeat: 0, targets: this.logoGameOver, y: "342", yoyo: false });
    this.time.delayedCall(3000, () => { this.scene.start("GameOverScene"); });
  }

  private stageSucceeded() {
    if (this.sceneEnding) { return; }
    this.sceneEnding = true;

    this.time.delayedCall(2000, () => {
      this.resetCursorKeys();
      this.scene.start("ScoresScene", this.gameProgress);
    });
  }
}
