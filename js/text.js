const textElement = document.getElementById("love-text");
const leftBar = document.querySelector(".left-bar");
const rightBar = document.querySelector(".right-bar");

const stages = [
  { text: "I love you", barHeight: 180 },
  { text: "I ❤️ you", barHeight: 120 },
  { text: "I ❤️ u", barHeight: 80 },
  { text: "💖", barHeight: 40 }
];

let currentStage = 0;

function nextStage() {
  const stage = stages[currentStage];
  textElement.classList.remove("heartbeat");

  // Ẩn chữ trước
  textElement.style.opacity = 0;
  textElement.style.transform = "scale(0.8)";
  textElement.style.filter = "blur(4px)";

  setTimeout(() => {
    textElement.textContent = stage.text;
    leftBar.style.height = `${stage.barHeight}px`;
    rightBar.style.height = `${stage.barHeight}px`;

    if (stage.text === "💖") {
      textElement.classList.add("heartbeat");
    }

    textElement.style.opacity = 1;
    textElement.style.transform = "scale(1)";
    textElement.style.filter = "blur(0)";

    currentStage++;
    if (currentStage < stages.length) {
      setTimeout(nextStage, 2500);
    } else {
      setTimeout(() => {
        currentStage = 0;
        nextStage();
      }, 5000);
    }
  }, 700);
}

setTimeout(nextStage, 1000);
