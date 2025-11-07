import { GameOverScene } from "./scenes/gameover-scene";
import { ScoresScene } from "./scenes/scores-scene";
import { StageScene } from "./scenes/stage-scene";
import { StageNumberScene } from "./scenes/stagenumber-scene";
import { WelcomeScene } from "./scenes/welcome-scene";
import VirtualJoystickPlugin from 'phaser3-rex-plugins/plugins/virtualjoystick-plugin.js';
import Phaser from "phaser";

const defaultConfig: Phaser.Types.Core.GameConfig = {
  backgroundColor: "000000",
  parent: "game",
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
  height: 720,
  width: 1556,
};
const StartGame = (parent: string) => {

  return new Phaser.Game({ ...defaultConfig, parent });

}

document.addEventListener('DOMContentLoaded', () => {

  const game = StartGame('game-container');

  // Try to lock orientation where possible (may require fullscreen/user gesture).
  const tryLockOrientation = async () => {
    const screenApi: any = (window as any).screen || (window as any).screen?.orientation;
    const orientation = (screenApi && screenApi.orientation) ? screenApi.orientation : screenApi;
    if (orientation && typeof orientation.lock === 'function') {
      try {
        // best-effort; will fail silently if not allowed
        await orientation.lock('landscape');
      } catch (e) {
        // ignore lock failure
      }
    }
  };

  const updateOrientationOverlay = () => {
    const overlay = document.getElementById('rotate-overlay');
    if (!overlay) return;
    const isPortrait = window.innerHeight > window.innerWidth;
    overlay.style.display = isPortrait ? 'flex' : 'none';

    // Best-effort pause/resume of scenes so game logic doesn't run while portrait.
    try {
      const scenePlugin: any = game.scene;
      // Pause active scenes when portrait, resume when landscape.
      if (isPortrait) {
        const activeScenes = scenePlugin.getScenes(true) || [];
        activeScenes.forEach((s: any) => {
          try { scenePlugin.pause(s); } catch (_) { }
        });
      } else {
        const pausedScenes = scenePlugin.getScenes(false) || [];
        pausedScenes.forEach((s: any) => {
          try { scenePlugin.resume(s); } catch (_) { }
        });
      }
    } catch (e) {
      // Non-fatal; continue
    }
  };

  // Initial check and event wiring
  updateOrientationOverlay();
  tryLockOrientation();
  window.addEventListener('resize', updateOrientationOverlay);
  window.addEventListener('orientationchange', () => { updateOrientationOverlay(); tryLockOrientation(); });

});
