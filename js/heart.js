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
        
        // Responsive variables
        this.isMobile = window.innerWidth <= 768;
        this.isTablet = window.innerWidth <= 1024 && window.innerWidth > 768;
        this.devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);
        
        this.initCanvas();
        this.initEventListeners();
        this.createCenterParticles();
        this.optimizeForDevice();
    }
    
    
    optimizeForDevice() {
        // Tối ưu hóa cho từng loại thiết bị
        if (this.isMobile) {
            this.maxParticles = 60;
            this.centerParticleCount = 8;
            this.heartLayers = 2;
            this.trailLength = 3;
            this.rotationSpeed = 0.015;
        } else if (this.isTablet) {
            this.maxParticles = 80;
            this.centerParticleCount = 12;
            this.heartLayers = 2;
            this.trailLength = 4;
            this.rotationSpeed = 0.018;
        } else {
            this.maxParticles = 100;
            this.centerParticleCount = 15;
            this.heartLayers = 3;
            this.trailLength = 5;
            this.rotationSpeed = 0.02;
        }
    }
    
    initCanvas() {
        this.resizeCanvas();
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.updateDeviceType();
            this.optimizeForDevice();
        });
    }
    
    updateDeviceType() {
        this.isMobile = window.innerWidth <= 768;
        this.isTablet = window.innerWidth <= 1024 && window.innerWidth > 768;
    }
    
    resizeCanvas() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * this.devicePixelRatio;
        this.canvas.height = rect.height * this.devicePixelRatio;
        this.ctx.scale(this.devicePixelRatio, this.devicePixelRatio);
        
        this.centerX = rect.width / 2;
        this.centerY = rect.height / 2;
        
        // Scale responsive dựa trên kích thước màn hình
        const minDimension = Math.min(rect.width, rect.height);
        if (this.isMobile) {
            this.scale = minDimension / 25;
        } else if (this.isTablet) {
            this.scale = minDimension / 22;
        } else {
            this.scale = minDimension / 20;
        }
    }
    
    initEventListeners() {
        document.getElementById('startBtn').addEventListener('click', () => this.start());
        document.getElementById('resetBtn').addEventListener('click', () => this.reset());
        document.getElementById('pauseBtn').addEventListener('click', () => this.togglePause());
    }
    
    createCenterParticles() {
        this.centerParticles = [];
        
        for (let i = 0; i < this.centerParticleCount; i++) {
            const spread = this.isMobile ? 30 : 40;
            this.centerParticles.push({
                x: this.centerX + (Math.random() - 0.5) * spread,
                y: this.centerY + (Math.random() - 0.5) * spread,
                vx: (Math.random() - 0.5) * (this.isMobile ? 1.5 : 2),
                vy: (Math.random() - 0.5) * (this.isMobile ? 1.5 : 2),
                life: 1,
                fadeSpeed: 0.005 + Math.random() * 0.01,
                size: this.isMobile ? 1.5 + Math.random() * 2 : 2 + Math.random() * 3,
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
        const numPoints = this.maxParticles;
        const rotationY = this.time * this.rotationSpeed;
        
        for (let i = 0; i < numPoints; i++) {
            const t = (i / numPoints) * Math.PI * 2;
            const heartPoint = this.heartFunction(t, rotationY);
            
            // Số layer dựa trên thiết bị
            for (let layer = 0; layer < this.heartLayers; layer++) {
                const layerOffset = (layer - Math.floor(this.heartLayers/2)) * 2;
                
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
                    speed: (this.isMobile ? 0.02 : 0.015) + Math.random() * 0.01,
                    size: this.isMobile ? 1.5 + Math.random() * 1.5 : 2 + Math.random() * 2,
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
            
            // Giới hạn trong vùng trung tâm - responsive
            const boundary = this.isMobile ? 40 : 50;
            if (Math.abs(particle.x - this.centerX) > boundary) particle.vx *= -1;
            if (Math.abs(particle.y - this.centerY) > boundary) particle.vy *= -1;
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
                
                // Thêm trail effect - responsive length
                particle.trail.push({ x: particle.x, y: particle.y, alpha: 1 });
                if (particle.trail.length > this.trailLength) {
                    particle.trail.shift();
                }
                
                // Cập nhật alpha của trail
                particle.trail.forEach((point, index) => {
                    point.alpha = (index + 1) / particle.trail.length * 0.5;
                });
            }
        });
        
        // Tạo thêm particles ở giữa nếu cần
        if (this.centerParticles.length < Math.floor(this.centerParticleCount * 0.7)) {
            this.createCenterParticles();
        }
    }
    
    drawParticles() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Tối ưu hóa render cho mobile
        const shadowBlur = this.isMobile ? 10 : 20;
        const glowIntensity = this.isMobile ? 15 : 25;
        
        // Vẽ particles ở giữa
        this.centerParticles.forEach(particle => {
            this.ctx.save();
            this.ctx.globalAlpha = particle.life;
            this.ctx.fillStyle = `hsl(${particle.hue}, 100%, 60%)`;
            this.ctx.shadowBlur = shadowBlur;
            this.ctx.shadowColor = `hsl(${particle.hue}, 100%, 60%)`;
            
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });
        
        // Vẽ trail của particles trái tim - skip trên mobile rất nhỏ
        if (!this.isMobile || window.innerWidth > 400) {
            this.particles.forEach(particle => {
                particle.trail.forEach(point => {
                    this.ctx.save();
                    this.ctx.globalAlpha = point.alpha;
                    this.ctx.fillStyle = `hsl(${particle.hue}, 100%, 70%)`;
                    this.ctx.shadowBlur = shadowBlur * 0.7;
                    this.ctx.shadowColor = `hsl(${particle.hue}, 100%, 70%)`;
                    
                    this.ctx.beginPath();
                    this.ctx.arc(point.x, point.y, 1, 0, Math.PI * 2);
                    this.ctx.fill();
                    this.ctx.restore();
                });
            });
        }
        
        // Vẽ particles trái tim chính
        this.particles.forEach(particle => {
            this.ctx.save();
            
            // Tính toán độ sáng dựa trên vị trí Z (hiệu ứng 3D)
            const brightness = 50 + (particle.z + 20) * 2;
            const alpha = Math.min(1, particle.progress * 2);
            
            this.ctx.globalAlpha = alpha;
            this.ctx.fillStyle = `hsl(${particle.hue}, 100%, ${brightness}%)`;
            this.ctx.shadowBlur = glowIntensity;
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
        const glowRadius = this.isMobile ? 60 : 100;
        const gradient = this.ctx.createRadialGradient(
            this.centerX, this.centerY, 0,
            this.centerX, this.centerY, glowRadius
        );
        gradient.addColorStop(0, 'rgba(255, 20, 147, 0.3)');
        gradient.addColorStop(0.5, 'rgba(255, 20, 147, 0.1)');
        gradient.addColorStop(1, 'rgba(255, 20, 147, 0)');
        
        this.ctx.save();
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, glowRadius, 0, Math.PI * 2);
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
            // Tối ưu frame rate cho mobile
            if (this.isMobile) {
                setTimeout(() => {
                    this.animationId = requestAnimationFrame(() => this.animate());
                }, 1000/45); // 45 FPS cho mobile
            } else {
                this.animationId = requestAnimationFrame(() => this.animate());
            }
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