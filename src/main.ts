import { GameOverScene } from "./scenes/gameover-scene";
import { ScoresScene } from "./scenes/scores-scene";
import { StageScene } from "./scenes/stage-scene";
import { StageNumberScene } from "./scenes/stagenumber-scene";
import { WelcomeScene } from "./scenes/welcome-scene";
import VirtualJoystickPlugin from 'phaser3-rex-plugins/plugins/virtualjoystick-plugin.js';
import Phaser from "phaser";

const defaultConfig: Phaser.Types.Core.GameConfig = {
  backgroundColor: "000000",
  parent: "game-container",
  physics: {
    arcade: {
      debug: false,
      gravity: { x: 0, y: 0 },
    },
    default: "arcade",
  },
  plugins: {
    global: [{
      key: 'rexVirtualJoystick',
      plugin: VirtualJoystickPlugin,
      start: true
    },
    ]
  },
  scale: {
    mode: Phaser.Scale.FIT,
    // mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  render: { pixelArt: true, antialias: false },
  scene: [WelcomeScene, GameOverScene, ScoresScene, StageScene, StageNumberScene],
  title: "Mini Battle City",
  type: Phaser.AUTO,
  height: 1280,
  width: 720,
};
const StartGame = (parent: string) => {

  return new Phaser.Game({ ...defaultConfig, parent });

}

document.addEventListener('DOMContentLoaded', () => {

  StartGame('game-container');

});
