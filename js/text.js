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
  textElement.style.opacity = 0;

  setTimeout(() => {
    textElement.textContent = stage.text;
    leftBar.style.width = stage.barWidth + "px";
    rightBar.style.width = stage.barWidth + "px";
    textElement.style.opacity = 1;

    currentStage++;
    if (currentStage < stages.length) {
      setTimeout(nextStage, 2000); // đợi 2s rồi chuyển stage tiếp
    }
  }, 500); // thời gian tắt chữ để đổi nội dung
}

setTimeout(nextStage, 1000); // bắt đầu sau 1s
