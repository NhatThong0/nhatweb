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
            this.maxParticles = 50;
            this.centerParticleCount = 6;
            this.heartLayers = 2;
            this.trailLength = 3;
            this.rotationSpeed = 0.01;
            this.animationSpeed = 0.025;
        } else if (this.isTablet) {
            this.maxParticles = 70;
            this.centerParticleCount = 10;
            this.heartLayers = 2;
            this.trailLength = 4;
            this.rotationSpeed = 0.015;
            this.animationSpeed = 0.02;
        } else {
            this.maxParticles = 90;
            this.centerParticleCount = 12;
            this.heartLayers = 3;
            this.trailLength = 5;
            this.rotationSpeed = 0.018;
            this.animationSpeed = 0.018;
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
            const spread = this.isMobile ? 20 : 30;
            this.centerParticles.push({
                x: this.centerX + (Math.random() - 0.5) * spread,
                y: this.centerY + (Math.random() - 0.5) * spread,
                vx: (Math.random() - 0.5) * (this.isMobile ? 0.8 : 1.2),
                vy: (Math.random() - 0.5) * (this.isMobile ? 0.8 : 1.2),
                life: 1,
                fadeSpeed: 0.003 + Math.random() * 0.007,
                size: this.isMobile ? 1 + Math.random() * 1.5 : 1.5 + Math.random() * 2,
                hue: 320 + Math.random() * 40,
                pulse: Math.random() * Math.PI * 2,
                pulseSpeed: 0.05 + Math.random() * 0.05
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
                const layerOffset = (layer - Math.floor(this.heartLayers/2)) * 1.5;
                
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
                    speed: this.animationSpeed + Math.random() * 0.008,
                    size: this.isMobile ? 1.2 + Math.random() * 1.2 : 1.5 + Math.random() * 1.5,
                    hue: 320 + Math.random() * 40,
                    life: 1,
                    trail: [],
                    delay: Math.random() * 30 // Thêm delay để tạo hiệu ứng mượt mà
                });
            }
        }
    }
    
    updateParticles() {
        // Cập nhật particles ở giữa với chuyển động mượt mà hơn
        this.centerParticles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= particle.fadeSpeed;
            particle.pulse += particle.pulseSpeed;
            
            // Giới hạn trong vùng trung tâm - responsive
            const boundary = this.isMobile ? 25 : 35;
            if (Math.abs(particle.x - this.centerX) > boundary) particle.vx *= -0.8;
            if (Math.abs(particle.y - this.centerY) > boundary) particle.vy *= -0.8;
            
            // Thêm lực hấp dẫn nhẹ về trung tâm
            const dx = this.centerX - particle.x;
            const dy = this.centerY - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 0) {
                particle.vx += dx / distance * 0.01;
                particle.vy += dy / distance * 0.01;
            }
            
            // Giảm tốc độ để tạo chuyển động mượt
            particle.vx *= 0.98;
            particle.vy *= 0.98;
        });
        
        // Loại bỏ particles đã hết life
        this.centerParticles = this.centerParticles.filter(p => p.life > 0);
        
        // Cập nhật particles tạo hình trái tim với chuyển động mượt
        this.particles.forEach(particle => {
            if (particle.delay > 0) {
                particle.delay--;
                return;
            }
            
            if (particle.progress < 1) {
                particle.progress += particle.speed;
                
                // Smooth easing function - mượt mà hơn
                const easeProgress = particle.progress < 0.5 
                    ? 2 * particle.progress * particle.progress
                    : 1 - Math.pow(-2 * particle.progress + 2, 3) / 2;
                
                particle.x = particle.startX + (particle.targetX - particle.startX) * easeProgress;
                particle.y = particle.startY + (particle.targetY - particle.startY) * easeProgress;
                particle.z = particle.targetZ * easeProgress;
                
                // Thêm trail effect - responsive length
                particle.trail.push({ 
                    x: particle.x, 
                    y: particle.y, 
                    alpha: 1,
                    time: this.time
                });
                
                if (particle.trail.length > this.trailLength) {
                    particle.trail.shift();
                }
                
                // Cập nhật alpha của trail mượt mà hơn
                particle.trail.forEach((point, index) => {
                    const age = this.time - point.time;
                    point.alpha = Math.max(0, (index + 1) / particle.trail.length * (1 - age * 0.02));
                });
            }
        });
        
        // Tạo thêm particles ở giữa nếu cần
        if (this.centerParticles.length < Math.floor(this.centerParticleCount * 0.6)) {
            this.createCenterParticles();
        }
    }
    
    drawParticles() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Tối ưu hóa render cho mobile
        const shadowBlur = this.isMobile ? 8 : 15;
        const glowIntensity = this.isMobile ? 12 : 20;
        
        // Vẽ particles ở giữa với hiệu ứng pulse mượt
        this.centerParticles.forEach(particle => {
            this.ctx.save();
            
            // Tính toán pulse size mượt mà
            const pulseSize = particle.size * (1 + Math.sin(particle.pulse) * 0.3);
            const alpha = particle.life * (0.7 + Math.sin(particle.pulse) * 0.3);
            
            this.ctx.globalAlpha = alpha;
            this.ctx.fillStyle = `hsl(${particle.hue}, 100%, 65%)`;
            this.ctx.shadowBlur = shadowBlur;
            this.ctx.shadowColor = `hsl(${particle.hue}, 100%, 65%)`;
            
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, pulseSize, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });
        
        // Vẽ trail của particles trái tim - tối ưu cho mobile
        if (!this.isMobile || window.innerWidth > 400) {
            this.particles.forEach(particle => {
                particle.trail.forEach(point => {
                    if (point.alpha > 0.1) {
                        this.ctx.save();
                        this.ctx.globalAlpha = point.alpha * 0.6;
                        this.ctx.fillStyle = `hsl(${particle.hue}, 100%, 75%)`;
                        this.ctx.shadowBlur = shadowBlur * 0.5;
                        this.ctx.shadowColor = `hsl(${particle.hue}, 100%, 75%)`;
                        
                        this.ctx.beginPath();
                        this.ctx.arc(point.x, point.y, 0.8, 0, Math.PI * 2);
                        this.ctx.fill();
                        this.ctx.restore();
                    }
                });
            });
        }
        
        // Vẽ particles trái tim chính với chuyển đổi mượt mà
        this.particles.forEach(particle => {
            if (particle.delay <= 0) {
                this.ctx.save();
                
                // Tính toán độ sáng và alpha mượt mà hơn
                const brightness = 50 + (particle.z + 20) * 1.5;
                const alpha = Math.min(1, particle.progress * 3) * (0.8 + Math.sin(this.time * 0.05) * 0.2);
                
                this.ctx.globalAlpha = alpha;
                this.ctx.fillStyle = `hsl(${particle.hue}, 100%, ${brightness}%)`;
                this.ctx.shadowBlur = glowIntensity;
                this.ctx.shadowColor = `hsl(${particle.hue}, 100%, ${brightness}%)`;
                
                // Kích thước mượt dựa trên vị trí Z và progress
                const baseSize = particle.size * (0.5 + particle.progress * 0.5);
                const size = baseSize * (1 + particle.z / 60);
                
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.restore();
            }
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
            // Frame rate mượt mà cho tất cả thiết bị
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