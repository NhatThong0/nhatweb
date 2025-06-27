const textElement = document.getElementById("love-text");
const leftBar = document.querySelector(".left-bar");
const rightBar = document.querySelector(".right-bar");

const stages = [
  { text: "I love you", barWidth: 200 },
  { text: "I ❤️ you", barWidth: 150 },
  { text: "I ❤️ u", barWidth: 100 },
  { text: "💖", barWidth: 50 } // icon trái tim đẹp hơn
];

let currentStage = 0;

function nextStage() {
  const stage = stages[currentStage];

  // Gỡ lớp heartbeat nếu có
  textElement.classList.remove("heartbeat");

  // Ẩn chữ trước khi chuyển
  textElement.style.opacity = 0;
  textElement.style.transform = "scale(0.8)";
  textElement.style.filter = "blur(4px)";

  setTimeout(() => {
    // Cập nhật nội dung và hiệu ứng thanh trắng
    textElement.textContent = stage.text;
    leftBar.style.width = `${stage.barWidth}px`;
    rightBar.style.width = `${stage.barWidth}px`;

    // Nếu là trái tim cuối cùng => thêm heartbeat
    if (stage.text === "💖") {
      textElement.classList.add("heartbeat");
    }

    // Hiện lại chữ
    textElement.style.opacity = 1;
    textElement.style.transform = "scale(1)";
    textElement.style.filter = "blur(0)";

    currentStage++;
    if (currentStage < stages.length) {
      setTimeout(nextStage, 2500);
    } else {
      // Lặp lại sau vài giây (tuỳ chỉnh nếu không muốn lặp thì bỏ đoạn này)
      setTimeout(() => {
        currentStage = 0;
        nextStage();
      }, 5000);
    }
  }, 700);
}

// Khởi động animation sau 1s
setTimeout(nextStage, 1000);
