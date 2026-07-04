export class Hazard {
    constructor(x, y, width, height, isCeiling = false) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = '#ff0055'; // Danger neon pink/red
        this.isCeiling = isCeiling;
    }

    render(ctx) {
        ctx.fillStyle = this.color;
        
        ctx.beginPath();
        const spikeWidth = 20;
        const numSpikes = Math.floor(this.width / spikeWidth);
        
        let currentX = this.x;
        let baseY = this.isCeiling ? this.y : this.y + this.height;
        let pointY = this.isCeiling ? this.y + this.height : this.y;

        ctx.moveTo(currentX, baseY);
        for (let i = 0; i < numSpikes; i++) {
            ctx.lineTo(currentX + spikeWidth / 2, pointY);
            ctx.lineTo(currentX + spikeWidth, baseY);
            currentX += spikeWidth;
        }
        
        // Connect the path
        ctx.lineTo(this.x + this.width, baseY);
        
        ctx.fill();
    }
}
