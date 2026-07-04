export class Camera {
    constructor(viewportWidth, viewportHeight) {
        this.x = 0;
        this.y = 0;
        this.viewportWidth = viewportWidth;
        this.viewportHeight = viewportHeight;
    }

    update(target, deltaTime) {
        // Calculate the target x position (center the camera on the target)
        const targetX = target.x + (target.width / 2) - (this.viewportWidth / 2);
        
        // Smooth lerp (frame-rate independent)
        const decay = 0.008; 
        const lerpFactor = 1 - Math.exp(-decay * deltaTime);
        
        // Only update horizontal position as per requirements
        this.x += (targetX - this.x) * lerpFactor;
    }
}
