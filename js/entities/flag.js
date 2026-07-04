export class Flag {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = '#ffff00'; // Victory yellow
    }

    render(ctx) {
        // Draw the pole
        ctx.fillStyle = '#888888';
        ctx.fillRect(this.x, this.y, 4, this.height);

        // Draw the flag (triangle)
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(this.x + 4, this.y + 10);
        ctx.lineTo(this.x + this.width, this.y + 25);
        ctx.lineTo(this.x + 4, this.y + 40);
        ctx.fill();
    }
}
