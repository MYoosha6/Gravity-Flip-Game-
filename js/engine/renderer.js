export class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // Fixed internal resolution for consistent gameplay and performance
        this.canvas.width = 800;
        this.canvas.height = 600;
    }

    render(game) {
        // Clear previous frame
        this.ctx.fillStyle = '#222';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Apply camera translation
        this.ctx.save();
        this.ctx.translate(-game.camera.x, 0);

        // Render entities
        if (game.texts) {
            for (const text of game.texts) {
                text.render(this.ctx);
            }
        }
        for (const platform of game.platforms) {
            platform.render(this.ctx);
        }
        for (const hazard of game.hazards) {
            hazard.render(this.ctx);
        }
        game.flag.render(this.ctx);
        game.player.render(this.ctx);

        this.ctx.restore();

        // Render UI overlay
        this.renderUI(game);
    }

    renderUI(game) {
        this.ctx.font = '600 20px Inter, sans-serif';
        this.ctx.textAlign = 'left';
        
        const label = 'Gravity: ';
        const direction = game.player.gravityDirection === 1 ? 'DOWN' : 'UP';
        
        // Draw label
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillText(label, 20, 40);
        
        // Draw direction with dynamic coloring
        this.ctx.fillStyle = game.player.gravityDirection === 1 ? '#00ffcc' : '#ff00cc';
        this.ctx.fillText(direction, 20 + this.ctx.measureText(label).width, 40);
    }
}
