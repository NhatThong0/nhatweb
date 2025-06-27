// Animation controller
class LoveAnimation {
    constructor() {
        this.textElement = document.getElementById('animatedText');
        this.wrapper = document.querySelector('.animation-wrapper');
        this.stages = [
            'I love you',
            'I ❤️ you', 
            'I❤️u',
            '❤️'
        ];
        this.currentStage = 0;
        this.isAnimating = false;
    }

    // Bắt đầu animation
    start() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.currentStage = 0;
        this.nextStage();
    }

    // Chuyển sang giai đoạn tiếp theo
    nextStage() {
        if (this.currentStage >= this.stages.length) {
            this.isAnimating = false;
            return;
        }

        // Cập nhật class cho wrapper
        this.wrapper.className = `animation-wrapper stage-${this.currentStage + 1}`;
        
        // Cập nhật text với hiệu ứng fade
        this.updateText(this.stages[this.currentStage]);
        
        this.currentStage++;
        
        // Chuyển sang stage tiếp theo sau 3 giây
        setTimeout(() => {
            this.nextStage();
        }, 3000);
    }

    // Cập nhật text với hiệu ứng
    updateText(newText) {
        // Fade out
        this.textElement.style.opacity = '0';
        this.textElement.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            // Cập nhật text
            if (newText.includes('❤️')) {
                this.textElement.innerHTML = newText.replace('❤️', '<span class="heart">❤️</span>');
            } else {
                this.textElement.textContent = newText;
            }
            
            // Fade in
            this.textElement.style.opacity = '1';
            this.textElement.style.transform = 'scale(1)';
        }, 500);
    }

    // Reset animation
    reset() {
        this.isAnimating = false;
        this.currentStage = 0;
        this.wrapper.className = 'animation-wrapper';
        this.textElement.style.opacity = '1';
        this.textElement.style.transform = 'scale(1)';
        this.textElement.textContent = 'I love you';
    }
}

// Khởi tạo animation
const loveAnimation = new LoveAnimation();

// Bắt đầu animation khi trang load
window.addEventListener('load', () => {
    setTimeout(() => {
        loveAnimation.start();
    }, 1000);
});

// Hàm restart cho button
function restartAnimation() {
    loveAnimation.reset();
    setTimeout(() => {
        loveAnimation.start();
    }, 500);
}

// Thêm một số hiệu ứng tương tác
document.addEventListener('DOMContentLoaded', () => {
    // Tạo particles nền
    createBackgroundParticles();
    
    // Thêm hiệu ứng click vào text
    document.getElementById('animatedText').addEventListener('click', () => {
        if (!loveAnimation.isAnimating) {
            createHeartExplosion();
        }
    });
});

// Tạo particles nền
function createBackgroundParticles() {
    const container = document.body;
    
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            createFloatingHeart();
        }, i * 200);
    }
    
    // Tạo heart mới mỗi 3 giây
    setInterval(createFloatingHeart, 3000);
}

// Tạo floating heart
function createFloatingHeart() {
    const heart = document.createElement('div');
    heart.innerHTML = '❤️';
    heart.style.position = 'fixed';
    heart.style.left = Math.random() * window.innerWidth + 'px';
    heart.style.top = window.innerHeight + 'px';
    heart.style.fontSize = (Math.random() * 20 + 10) + 'px';
    heart.style.opacity = '0.7';
    heart.style.pointerEvents = 'none';
    heart.style.zIndex = '-1';
    heart.style.transition = 'all 8s linear';
    
    document.body.appendChild(heart);
    
    // Animate upward
    setTimeout(() => {
        heart.style.top = '-50px';
        heart.style.transform = 'rotate(360deg)';
        heart.style.opacity = '0';
    }, 100);
    
    // Remove element
    setTimeout(() => {
        if (heart.parentNode) {
            heart.parentNode.removeChild(heart);
        }
    }, 8100);
}

// Tạo hiệu ứng nổ hearts khi click
function createHeartExplosion() {
    const textRect = document.getElementById('animatedText').getBoundingClientRect();
    const centerX = textRect.left + textRect.width / 2;
    const centerY = textRect.top + textRect.height / 2;
    
    for (let i = 0; i < 12; i++) {
        const heart = document.createElement('div');
        heart.innerHTML = '❤️';
        heart.style.position = 'fixed';
        heart.style.left = centerX + 'px';
        heart.style.top = centerY + 'px';
        heart.style.fontSize = '20px';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '1000';
        heart.style.transition = 'all 1s ease-out';
        
        document.body.appendChild(heart);
        
        // Animate outward
        const angle = (i / 12) * Math.PI * 2;
        const distance = 100;
        const endX = centerX + Math.cos(angle) * distance;
        const endY = centerY + Math.sin(angle) * distance;
        
        setTimeout(() => {
            heart.style.left = endX + 'px';
            heart.style.top = endY + 'px';
            heart.style.opacity = '0';
            heart.style.transform = 'scale(0.5) rotate(360deg)';
        }, 50);
        
        // Remove element
        setTimeout(() => {
            if (heart.parentNode) {
                heart.parentNode.removeChild(heart);
            }
        }, 1050);
    }
}