const textElement = document.getElementById("love-text");
const leftBar = document.querySelector(".left-bar");
const rightBar = document.querySelector(".right-bar");

const stages = [
  { text: "I love you", barWidth: 200 },
  { text: "I ❤️ you", barWidth: 150 },
  { text: "I ❤️ u", barWidth: 100 },
  { text: "❤️", barWidth: 50 }
];

let currentStage = 0;

function nextStage() {
  const stage = stages[currentStage];

  // Làm mờ và thu nhỏ chữ trước khi chuyển
  textElement.style.opacity = 0;
  textElement.style.transform = "scale(0.8)";
  textElement.style.filter = "blur(4px)";

  setTimeout(() => {
    // Thay đổi nội dung và hiệu ứng thanh
    textElement.textContent = stage.text;
    leftBar.style.width = `${stage.barWidth}px`;
    rightBar.style.width = `${stage.barWidth}px`;

    // Làm hiện chữ lại mượt
    textElement.style.opacity = 1;
    textElement.style.transform = "scale(1)";
    textElement.style.filter = "blur(0)";

    currentStage++;
    if (currentStage < stages.length) {
      setTimeout(nextStage, 2500);
    } else {
      // Lặp lại sau 5s (tuỳ chọn)
      setTimeout(() => {
        currentStage = 0;
        nextStage();
      }, 5000);
    }
  }, 700);
}

setTimeout(nextStage, 1000);
