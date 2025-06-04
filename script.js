// Hàm animation cho thẻ thông tin
function animateCard(card) {
    card.style.transform = 'scale(1.05)';
    card.style.transition = 'transform 0.1s ease';
    
    setTimeout(() => {
        card.style.transform = 'translateY(-5px)';
        card.style.transition = 'all 0.3s ease';
    }, 100);
}

// Hàm thay đổi màu avatar
function changeAvatar() {
    const avatar = document.getElementById('avatarText');
    const colors = [
        'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
        'linear-gradient(45deg, #45b7d1, #96ceb4)',
        'linear-gradient(45deg, #667eea, #764ba2)',
        'linear-gradient(45deg, #f093fb, #f5576c)',
        'linear-gradient(45deg, #4facfe, #00f2fe)'
    ];
    
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    avatar.parentElement.style.background = randomColor;
}

// Animation khi tải trang
window.addEventListener('load', () => {
    const cards = document.querySelectorAll('.info-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '0';
            card.style.transform = 'translateX(-50px)';
            card.style.transition = 'all 0.6s ease';
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateX(0)';
            }, 100);
        }, index * 200);
    });
});

// Hiệu ứng con trỏ chuột
document.addEventListener('mousemove', (e) => {
    const cursor = document.createElement('div');
    cursor.style.position = 'fixed';
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    cursor.style.width = '6px';
    cursor.style.height = '6px';
    cursor.style.background = 'rgba(102, 126, 234, 0.6)';
    cursor.style.borderRadius = '50%';
    cursor.style.pointerEvents = 'none';
    cursor.style.zIndex = '9999';
    cursor.style.animation = 'cursorFade 0.8s ease-out forwards';
    
    document.body.appendChild(cursor);
    
    setTimeout(() => {
        cursor.remove();
    }, 800);
});

// CSS cho hiệu ứng con trỏ
const style = document.createElement('style');
style.textContent = `
    @keyframes cursorFade {
        0% {
            opacity: 1;
            transform: scale(1);
        }
        100% {
            opacity: 0;
            transform: scale(2);
        }
    }
`;
document.head.appendChild(style);