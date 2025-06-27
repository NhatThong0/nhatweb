const textEl = document.getElementById('love-text');
const leftBar = document.querySelector('.left-bar');
const rightBar = document.querySelector('.right-bar');

const stages = [
  { phase: 'explodeLOVE', from: 'I love you', to: 'I ❤️ you' },
  { phase: 'explodeYOU', from: 'I ❤️ you', to: 'I ❤️ u' },
  { phase: 'explodeALL', from: 'I ❤️ u', to: '💖' }
];

let tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
let delay = 1;

// Khởi tạo từng giai đoạn
stages.forEach((st, i) => {
  tl.addLabel(st.phase, delay);

  // 1. Thanh ép vào giữa
  tl.to([leftBar, rightBar], {
    duration: 0.8,
    height: 200,           // tăng chiều dài để ép mạnh hơn
    y: 0,
  }, st.phase);

  // 2. Từ cần "nổ" scale + biến mất
  tl.fromTo(textEl, {
    text: st.from
  }, {
    duration: 0.4,
    scale: 0.8,
    opacity: 0,
    onStart() { textEl.textContent = st.from; }
  }, `>${st.phase}+=0.8`);

  // 3. Từ mới xuất hiện + "pop"
  tl.fromTo(textEl, {
    opacity: 0,
    scale: 1.3
  }, {
    duration: 0.6,
    opacity: 1,
    scale: 1,
    onStart() { textEl.textContent = st.to; }
  }, `>${st.phase}+=1.2`);

  // 4. Thanh hồi vị với bounce nhẹ
  tl.to([leftBar, rightBar], {
    duration: 0.8,
    height: 100,
    ease: "bounce.out"
  }, `>${st.phase}+=1.5`);

  delay += 3; // cách nhau 3 giây
});

// Lặp lại sau chu kỳ
tl.to({}, { duration: delay + 1, onComplete: () => tl.restart() });
