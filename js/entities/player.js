export class Player {
    constructor() {
        this.startX = 50;
        this.startY = 300;
        this.x = this.startX; 
        this.y = this.startY; 
        this.width = 30;
        this.height = 30;
        this.color = '#00ffcc';
        
        // Physics properties
        this.vx = 0;
        this.vy = 0;
        this.gravity = 0.002;
        this.gravityDirection = 1; // 1 for normal (down), -1 for inverted (up)
        this.gravityFlipPressed = false;
        
        this.jumpForce = 0.65; // Instantaneous velocity when jumping
        this.isGrounded = false;
        this.jumpPressed = false; // To require letting go of spacebar between jumps
        
        // Horizontal movement constants
        this.acceleration = 0.0015;
        this.friction = 0.001;
        this.maxSpeed = 0.4;
    }

    die() {
        this.x = this.startX;
        this.y = this.startY;
        this.vx = 0;
        this.vy = 0;
        this.gravityDirection = 1;
        this.isGrounded = false;
        this.gravityFlipPressed = false;
        this.jumpPressed = false;
    }

    isCollidingWith(rect) {
        return this.x < rect.x + rect.width &&
               this.x + this.width > rect.x &&
               this.y < rect.y + rect.height &&
               this.y + this.height > rect.y;
    }

    update(deltaTime, input, platforms, hazards, audio) {
        // Horizontal movement
        let isMoving = false;
        
        if (input.isKeyDown('KeyD') || input.isKeyDown('ArrowRight')) {
            this.vx += this.acceleration * deltaTime;
            isMoving = true;
        }
        if (input.isKeyDown('KeyA') || input.isKeyDown('ArrowLeft')) {
            this.vx -= this.acceleration * deltaTime;
            isMoving = true;
        }

        // Apply friction (deceleration) when not actively moving
        if (!isMoving) {
            if (this.vx > 0) {
                this.vx -= this.friction * deltaTime;
                if (this.vx < 0) this.vx = 0; // Stop completely
            } else if (this.vx < 0) {
                this.vx += this.friction * deltaTime;
                if (this.vx > 0) this.vx = 0; // Stop completely
            }
        }

        // Clamp horizontal velocity to maxSpeed
        if (this.vx > this.maxSpeed) this.vx = this.maxSpeed;
        if (this.vx < -this.maxSpeed) this.vx = -this.maxSpeed;

        // Apply horizontal velocity to position
        this.x += this.vx * deltaTime;

        // Horizontal Collisions
        for (const platform of platforms) {
            if (this.isCollidingWith(platform)) {
                
                // We collided horizontally
                if (this.vx > 0) { // Moving right
                    this.x = platform.x - this.width;
                    this.vx = 0;
                } else if (this.vx < 0) { // Moving left
                    this.x = platform.x + platform.width;
                    this.vx = 0;
                }
            }
        }

        // Gravity Flip Logic
        if (input.isKeyDown('KeyG')) {
            if (!this.gravityFlipPressed) {
                this.gravityDirection *= -1; // Toggle gravity
                this.gravityFlipPressed = true;
                if (audio) audio.playFlip();
            }
        } else {
            this.gravityFlipPressed = false;
        }

        // Apply gravity
        this.vy += this.gravity * this.gravityDirection * deltaTime;

        // Jumping Logic
        if (input.isKeyDown('Space')) {
            if (this.isGrounded && !this.jumpPressed) {
                this.vy = -this.jumpForce * this.gravityDirection;
                this.isGrounded = false;
                if (audio) audio.playJump();
            }
            this.jumpPressed = true;
        } else {
            this.jumpPressed = false;
        }

        // Move vertically
        this.y += this.vy * deltaTime;

        // Reset grounded state before checking vertical collisions
        this.isGrounded = false;

        // Vertical Collisions
        for (const platform of platforms) {
            if (this.isCollidingWith(platform)) {
                
                // Collision happened vertically
                if (this.vy > 0) { // Falling down (hitting floor)
                    this.y = platform.y - this.height;
                    this.vy = 0;
                    if (this.gravityDirection === 1) {
                        this.isGrounded = true; // Touched a surface below
                    }
                } else if (this.vy < 0) { // Moving up (hitting ceiling)
                    this.y = platform.y + platform.height;
                    this.vy = 0;
                    if (this.gravityDirection === -1) {
                        this.isGrounded = true; // Touched a surface above
                    }
                }
            }
        }

        // Hazard Collisions
        for (const hazard of hazards) {
            if (this.isCollidingWith(hazard)) {
                if (audio) audio.playDeath();
                this.die();
                return; // Stop processing further physics this frame
            }
        }
    }

    render(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
