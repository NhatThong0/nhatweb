class HeartAnimation {
    constructor() {
        this.canvas = document.getElementById('heartCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.centerParticles = [];
        this.animationId = null;
        this.isRunning = false;
        this.isPaused = false;
        this.time = 0;
        this.rotationSpeed = 0.02;
        
        this.initCanvas();
        this.initEventListeners();
        this.createCenterParticles();
    }
    
    initCanvas() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    resizeCanvas() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * window.devicePixelRatio;
        this.canvas.height = rect.height * window.devicePixelRatio;
        this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        
        this.centerX = rect.width / 2;
        this.centerY = rect.height / 2;
        this.scale = Math.min(rect.width, rect.height) / 20;
    }
    
    initEventListeners() {
        document.getElementById('startBtn').addEventListener('click', () => this.start());
        document.getElementById('resetBtn').addEventListener('click', () => this.reset());
        document.getElementById('pauseBtn').addEventListener('click', () => this.togglePause());
    }
    
    createCenterParticles() {
        this.centerParticles = [];
        const numParticles = 15;
        
        for (let i = 0; i < numParticles; i++) {
            this.centerParticles.push({
                x: this.centerX + (Math.random() - 0.5) * 40,
                y: this.centerY + (Math.random() - 0.5) * 40,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                life: 1,
                fadeSpeed: 0.005 + Math.random() * 0.01,
                size: 2 + Math.random() * 3,
                hue: 320 + Math.random() * 40
            });
        }
    }
    
    // Hàm tạo hình trái tim 3D
    heartFunction(t, rotationY = 0) {
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        const z = 5 * Math.sin(t) * Math.cos(t);
        
        // Xoay theo trục Y để tạo hiệu ứng 3D
        const rotatedX = x * Math.cos(rotationY) - z * Math.sin(rotationY);
        const rotatedZ = x * Math.sin(rotationY) + z * Math.cos(rotationY);
        
        return {
            x: rotatedX,
            y: y,
            z: rotatedZ
        };
    }
    
    createHeartParticles() {
        const numPoints = 100;
        const rotationY = this.time * this.rotationSpeed;
        
        for (let i = 0; i < numPoints; i++) {
            const t = (i / numPoints) * Math.PI * 2;
            const heartPoint = this.heartFunction(t, rotationY);
            
            // Thêm nhiều layers để tạo độ dày cho trái tim
            for (let layer = 0; layer < 3; layer++) {
                const layerOffset = (layer - 1) * 2;
                
                this.particles.push({
                    startX: this.centerX,
                    startY: this.centerY,
                    targetX: this.centerX + heartPoint.x * this.scale,
                    targetY: this.centerY + heartPoint.y * this.scale,
                    targetZ: heartPoint.z * this.scale + layerOffset,
                    x: this.centerX,
                    y: this.centerY,
                    z: 0,
                    progress: 0,
                    speed: 0.015 + Math.random() * 0.01,
                    size: 2 + Math.random() * 2,
                    hue: 320 + Math.random() * 40,
                    life: 1,
                    trail: []
                });
            }
        }
    }
    
    updateParticles() {
        // Cập nhật particles ở giữa
        this.centerParticles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= particle.fadeSpeed;
            
            // Giới hạn trong vùng trung tâm
            if (Math.abs(particle.x - this.centerX) > 50) particle.vx *= -1;
            if (Math.abs(particle.y - this.centerY) > 50) particle.vy *= -1;
        });
        
        // Loại bỏ particles đã hết life
        this.centerParticles = this.centerParticles.filter(p => p.life > 0);
        
        // Cập nhật particles tạo hình trái tim
        this.particles.forEach(particle => {
            if (particle.progress < 1) {
                particle.progress += particle.speed;
                
                // Easing function để tạo chuyển động mượt
                const easeProgress = 1 - Math.pow(1 - particle.progress, 3);
                
                particle.x = particle.startX + (particle.targetX - particle.startX) * easeProgress;
                particle.y = particle.startY + (particle.targetY - particle.startY) * easeProgress;
                particle.z = particle.targetZ * easeProgress;
                
                // Thêm trail effect
                particle.trail.push({ x: particle.x, y: particle.y, alpha: 1 });
                if (particle.trail.length > 5) {
                    particle.trail.shift();
                }
                
                // Cập nhật alpha của trail
                particle.trail.forEach((point, index) => {
                    point.alpha = (index + 1) / particle.trail.length * 0.5;
                });
            }
        });
        
        // Tạo thêm particles ở giữa nếu cần
        if (this.centerParticles.length < 10) {
            this.createCenterParticles();
        }
    }
    
    drawParticles() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Vẽ particles ở giữa
        this.centerParticles.forEach(particle => {
            this.ctx.save();
            this.ctx.globalAlpha = particle.life;
            this.ctx.fillStyle = `hsl(${particle.hue}, 100%, 60%)`;
            this.ctx.shadowBlur = 20;
            this.ctx.shadowColor = `hsl(${particle.hue}, 100%, 60%)`;
            
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });
        
        // Vẽ trail của particles trái tim
        this.particles.forEach(particle => {
            particle.trail.forEach(point => {
                this.ctx.save();
                this.ctx.globalAlpha = point.alpha;
                this.ctx.fillStyle = `hsl(${particle.hue}, 100%, 70%)`;
                this.ctx.shadowBlur = 15;
                this.ctx.shadowColor = `hsl(${particle.hue}, 100%, 70%)`;
                
                this.ctx.beginPath();
                this.ctx.arc(point.x, point.y, 1, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.restore();
            });
        });
        
        // Vẽ particles trái tim chính
        this.particles.forEach(particle => {
            this.ctx.save();
            
            // Tính toán độ sáng dựa trên vị trí Z (hiệu ứng 3D)
            const brightness = 50 + (particle.z + 20) * 2;
            const alpha = Math.min(1, particle.progress * 2);
            
            this.ctx.globalAlpha = alpha;
            this.ctx.fillStyle = `hsl(${particle.hue}, 100%, ${brightness}%)`;
            this.ctx.shadowBlur = 25;
            this.ctx.shadowColor = `hsl(${particle.hue}, 100%, ${brightness}%)`;
            
            // Kích thước dựa trên vị trí Z
            const size = particle.size * (1 + particle.z / 50);
            
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });
        
        // Vẽ hiệu ứng ánh sáng trung tâm
        this.drawCenterGlow();
    }
    
    drawCenterGlow() {
        const gradient = this.ctx.createRadialGradient(
            this.centerX, this.centerY, 0,
            this.centerX, this.centerY, 100
        );
        gradient.addColorStop(0, 'rgba(255, 20, 147, 0.3)');
        gradient.addColorStop(0.5, 'rgba(255, 20, 147, 0.1)');
        gradient.addColorStop(1, 'rgba(255, 20, 147, 0)');
        
        this.ctx.save();
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, 100, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
    }
    
    animate() {
        if (!this.isPaused) {
            this.time++;
            this.updateParticles();
        }
        
        this.drawParticles();
        
        if (this.isRunning) {
            this.animationId = requestAnimationFrame(() => this.animate());
        }
    }
    
    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.isPaused = false;
        this.particles = [];
        this.createHeartParticles();
        this.animate();
        
        document.getElementById('startBtn').textContent = 'Đang chạy...';
        document.getElementById('startBtn').disabled = true;
    }
    
    reset() {
        this.isRunning = false;
        this.isPaused = false;
        this.time = 0;
        this.particles = [];
        this.createCenterParticles();
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawParticles();
        
        document.getElementById('startBtn').textContent = 'Bắt đầu Animation';
        document.getElementById('startBtn').disabled = false;
        document.getElementById('pauseBtn').textContent = 'Tạm dừng';
    }
    
    togglePause() {
        if (!this.isRunning) return;
        
        this.isPaused = !this.isPaused;
        document.getElementById('pauseBtn').textContent = this.isPaused ? 'Tiếp tục' : 'Tạm dừng';
    }
}

// Khởi tạo animation khi trang web load
document.addEventListener('DOMContentLoaded', () => {
    new HeartAnimation();
});