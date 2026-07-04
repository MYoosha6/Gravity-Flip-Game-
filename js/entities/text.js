export class TextDisplay {
    constructor(text, x, y, size = '24px') {
        this.text = text;
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = '#888888';
    }

    render(ctx) {
        ctx.fillStyle = this.color;
        ctx.font = `600 ${this.size} Inter, sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(this.text, this.x, this.y);
    }
}
