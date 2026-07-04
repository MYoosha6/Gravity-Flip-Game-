import { Game } from './engine/game.js';

// Main entry point for the application
window.onload = () => {
    const canvas = document.getElementById('gameCanvas');
    const game = new Game(canvas);
    game.start();

    // Wire up the restart button
    document.getElementById('restartBtn').addEventListener('click', () => {
        document.getElementById('winScreen').style.display = 'none';
        game.reset();
        game.start();
    });
};
