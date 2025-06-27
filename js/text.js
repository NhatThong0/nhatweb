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

stages.forEach((st, i) => {
  tl.addLabel(st.phase, delay);

  // 1. Di chuyển thanh vào trong
  tl.to(leftBar, {
    duration: 0.6,
    x: 120
  }, st.phase);
  tl.to(rightBar, {
    duration: 0.6,
    x: -120
  }, st.phase);

  // 2. Chữ mờ dần, scale nhỏ (ép nổ)
  tl.to(textEl, {
    duration: 0.4,
    opacity: 0,
    scale: 0.8,
    filter: "blur(6px)",
    onStart() { textEl.textContent = st.from; }
  }, `>${st.phase}+=0.4`);

  // 3. Chữ mới hiện ra, pop nhẹ
  tl.to(textEl, {
    duration: 0.5,
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    onStart() { textEl.textContent = st.to; }
  }, `>${st.phase}+=0.9`);

  // 4. Di chuyển thanh về vị trí cũ
  tl.to(leftBar, {
    duration: 0.6,
    x: 0
  }, `>${st.phase}+=1.4`);
  tl.to(rightBar, {
    duration: 0.6,
    x: 0
  }, `>${st.phase}+=1.4`);

  delay += 3.5;
});

// Lặp lại chu kỳ
tl.to({}, { duration: 1, onComplete: () => tl.restart() });
