// Danh sách các ngày lễ
const holidays = {
    '01-01': {
        name: 'Tết Dương Lịch',
        message: 'Chúc Mừng Năm Mới! 🎊 Chúc bạn một năm mới tràn đầy hạnh phúc và thành công!',
        emoji: '🎊🎉🥳'
    },
    '14-02': {
        name: 'Ngày Valentine',
        message: 'Chúc Mừng Ngày Tình Yêu! 💕 Chúc bạn có một ngày Valentine ngọt ngào và hạnh phúc!',
        emoji: '💕❤️🌹'
    },
    '08-03': {
        name: 'Ngày Quốc Tế Phụ Nữ',
        message: 'Chúc Mừng Ngày Quốc Tế Phụ Nữ! 🌸 Chúc tất cả phụ nữ luôn xinh đẹp, hạnh phúc và thành công!',
        emoji: '🌸👑💐'
    },
    '01-04': {
        name: 'Ngày Cá Tháng Tư',
        message: 'Chúc Mừng Ngày Cá Tháng Tư! 🤡 Hãy cẩn thận với những trò đùa hôm nay nhé!',
        emoji: '🤡🎭😂'
    },
    '30-04': {
        name: 'Ngày Giải Phóng Miền Nam',
        message: 'Chúc Mừng Ngày Giải Phóng Miền Nam! 🇻🇳 Tự hào về lịch sử vẻ vang của dân tộc Việt Nam!',
        emoji: '🇻🇳🏆⭐'
    },
    '01-05': {
        name: 'Ngày Quốc Tế Lao Động',
        message: 'Chúc Mừng Ngày Quốc Tế Lao Động! 👷‍♂️ Chúc tất cả người lao động luôn khỏe mạnh và hạnh phúc!',
        emoji: '👷‍♂️💪🔨'
    },
    '01-06': {
        name: 'Ngày Quốc Tế Thiếu Nhi',
        message: 'Chúc Mừng Ngày Quốc Tế Thiếu Nhi! 🧒 Chúc các em nhỏ luôn vui vẻ, khỏe mạnh và học giỏi!',
        emoji: '🧒🎈🎪'
    },
    '02-09': {
        name: 'Ngày Quốc Khánh Việt Nam',
        message: 'Chúc Mừng Ngày Quốc Khánh Việt Nam! 🇻🇳 Chúc đất nước ta luôn thịnh vượng và phát triển!',
        emoji: '🇻🇳🎆🏮'
    },
    '20-10': {
        name: 'Ngày Phụ Nữ Việt Nam',
        message: 'Chúc Mừng Ngày Phụ Nữ Việt Nam! 👩 Chúc các chị em phụ nữ luôn xinh đẹp và hạnh phúc!',
        emoji: '👩🌺💄'
    },
    '20-11': {
        name: 'Ngày Nhà Giáo Việt Nam',
        message: 'Chúc Mừng Ngày Nhà Giáo Việt Nam! 👨‍🏫 Cảm ơn các thầy cô đã tận tâm dạy dỗ!',
        emoji: '👨‍🏫📚🍎'
    },
    '24-12': {
        name: 'Lễ Giáng Sinh',
        message: 'Chúc Mừng Giáng Sinh! 🎄 Chúc bạn có một mùa Giáng Sinh ấm áp và hạnh phúc bên gia đình!',
        emoji: '🎄🎅🎁'
    },
    '25-12': {
        name: 'Lễ Giáng Sinh',
        message: 'Chúc Mừng Giáng Sinh! 🎄 Chúc bạn có một mùa Giáng Sinh ấm áp và hạnh phúc bên gia đình!',
        emoji: '🎄🎅🎁'
    },
    '31-12': {
        name: 'Đêm Giao Thừa',
        message: 'Chúc Mừng Đêm Giao Thừa! 🎊 Chúc bạn một năm mới tràn đầy niềm vui và thành công!',
        emoji: '🎊🥂✨'
    }
};

function checkDate() {
    const dateInput = document.getElementById('dateInput');
    const result = document.getElementById('result');
    const resultText = document.getElementById('resultText');
    
    if (!dateInput.value) {
        showResult('Vui lòng chọn một ngày! 📅', 'no-event');
        return;
    }
    
    const selectedDate = new Date(dateInput.value);
    const day = String(selectedDate.getDate()).padStart(2, '0');
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const dateKey = `${day}-${month}`;
    
    // Kiểm tra sinh nhật đặc biệt (07/03)
    if (dateKey === '07-03') {
        showResult('🎂 Chúc Mừng Sinh Nhật! 🎂<br>Chúc bạn nào đó tuổi mới tràn đầy hạnh phúc, sức khỏe và thành công! Sinh nhật vui vẻ nhé! 🎉🎈🎁', 'birthday');
        createFireworks();
        return;
    }
    if (dateKey === '19-09') {
        showResult('🎂 Chúc Mừng, Bạn đã tìm được ngày sinh nhật của tôi! 🎂<br>Không biết là bạn bấm bừa hay là nhớ được sinh nhật của tui mà chọn ngày này :))hehehehe! 🎉🎈🎁', '');
        createFireworks();
        return;
    }
    // Kiểm tra các ngày lễ
    if (holidays[dateKey]) {
        const holiday = holidays[dateKey];
        showResult(`${holiday.emoji}<br>${holiday.message}`, 'holiday');
        createFireworks();
    } else {
        showResult(`📅 Ngày ${day}/${month} không có sự kiện đặc biệt nào.<br>Nhưng mọi ngày đều là ngày tuyệt vời! 😊`, 'no-event');
    }
}

function showResult(message, type) {
    const result = document.getElementById('result');
    const resultText = document.getElementById('resultText');
    
    // Reset classes
    result.classList.remove('show', 'holiday-result', 'birthday-result', 'no-event-result');
    
    // Set content
    resultText.innerHTML = message;
    
    // Add appropriate class
    if (type === 'holiday') {
        result.classList.add('holiday-result');
    } else if (type === 'birthday') {
        result.classList.add('birthday-result');
    } else {
        result.classList.add('no-event-result');
    }
    
    // Show with animation
    setTimeout(() => {
        result.classList.add('show');
    }, 100);
}

function createFireworks() {
    const fireworksContainer = document.getElementById('fireworks');
    
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const firework = document.createElement('div');
            firework.className = 'firework';
            firework.style.left = Math.random() * 100 + '%';
            firework.style.top = Math.random() * 100 + '%';
            firework.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
            fireworksContainer.appendChild(firework);
            
            setTimeout(() => {
                firework.remove();
            }, 1000);
        }, i * 200);
    }
}

// Set ngày hiện tại làm mặc định
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('dateInput').valueAsDate = new Date();
});

// Cho phép nhấn Enter để kiểm tra
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('dateInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            checkDate();
        }
    });
});

// Easter egg: Double click để hiển thị tất cả ngày lễ
let clickCount = 0;
document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('h1').addEventListener('click', function() {
        clickCount++;
        if (clickCount === 5) {
            alert('🎉 Easter egg! Bạn đã tìm ra bí mật!\n\nDanh sách một số ngày lễ đặc biệt:\n• 01/01 - Tết Dương Lịch\n• 07/03 - Sinh nhật đặc biệt\n• 08/03 - Ngày Phụ nữ\n• 30/04 - Ngày Giải phóng\n• 02/09 - Ngày Quốc khánh\n• 20/10 - Ngày Phụ nữ VN\n• 24-25/12 - Giáng sinh');
            clickCount = 0;
        }
        
        setTimeout(() => {
            clickCount = 0;
        }, 2000);
    });
});