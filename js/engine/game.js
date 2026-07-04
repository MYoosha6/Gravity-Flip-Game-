import { Renderer } from './renderer.js';
import { InputManager } from './input.js';
import { Player } from '../entities/player.js';
import { Platform } from '../entities/platform.js';
import { Hazard } from '../entities/hazard.js';
import { Camera } from './camera.js';
import { Flag } from '../entities/flag.js';
import { TextDisplay } from '../entities/text.js';
import { AudioController } from './audio.js';

export class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.renderer = new Renderer(canvas);
        this.input = new InputManager();
        this.player = new Player();
        this.camera = new Camera(canvas.width, canvas.height);
        this.audio = new AudioController();
        this.platforms = [
            new Platform(-50, 0, 50, 600, '#555'), // Left boundary wall
            new Platform(-50, 0, 8000, 50, '#555'), // Ceiling
            new Platform(-50, 550, 8000, 50, '#555'), // Floor
            
            // Jump tutorial obstacle
            new Platform(900, 480, 60, 70, '#666'),
            
            // Gravity flip tutorial wall (blocks the floor, open at the ceiling)
            new Platform(1500, 200, 60, 350, '#666'),

            // Ceiling wall (blocks the ceiling, forces player back to floor)
            new Platform(1750, 50, 60, 350, '#666')
        ];
        this.hazards = [
            // Combined Jump + Flip Obstacle
            new Hazard(1900, 50, 300, 20, true),   // Ceiling spikes (punishes flipping too early)
            new Hazard(2000, 530, 500, 20, false), // Floor spikes (too wide to jump across normally)

            // Final stretch hazards
            new Hazard(2800, 530, 100, 20, false), 
            new Hazard(3100, 50, 100, 20, true)     
        ];
        this.flag = new Flag(3600, 450, 40, 100);
        
        this.texts = [
            new TextDisplay('Use A and D or Arrow Keys to move left and right', 400, 400, '32px'),
            new TextDisplay('Press SPACE to jump over obstacles', 930, 380, '32px'),
            new TextDisplay('Press G to invert gravity', 1450, 400, '32px'),
            new TextDisplay('Jump, then press G mid-air to clear the huge gap!', 1850, 350, '26px')
        ];
        
        this.lastTime = 0;
        this.isRunning = false;
        this.isWon = false;
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.input.init();
        this.lastTime = performance.now();
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    stop() {
        this.isRunning = false;
    }

    win() {
        this.isWon = true;
        this.isRunning = false;
        this.audio.playWin();
        document.getElementById('winScreen').style.display = 'flex';
    }

    reset() {
        this.player.die(); // Resets player stats
        this.camera.x = 0; // Reset camera
        this.isWon = false;
    }

    gameLoop(timestamp) {
        if (!this.isRunning) return;

        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        this.update(deltaTime);
        this.renderer.render(this);

        if (!this.isWon) {
            requestAnimationFrame(this.gameLoop.bind(this));
        }
    }

    update(deltaTime) {
        // Update game state
        this.player.update(deltaTime, this.input, this.platforms, this.hazards, this.audio);
        this.camera.update(this.player, deltaTime);

        if (this.player.isCollidingWith(this.flag) && !this.isWon) {
            this.win();
        }
    }
}
